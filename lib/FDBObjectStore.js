import structuredClone from './structuredClone'
import Index from './Index'
import FDBCursorWithValue from './FDBCursorWithValue'
import FDBIndex from './FDBIndex'
import FDBKeyRange from './FDBKeyRange'
import FDBRequest from './FDBRequest'
import ConstraintError from './errors/ConstraintError'
import DataError from './errors/DataError'
import InvalidAccessError from './errors/InvalidAccessError'
import InvalidStateError from './errors/InvalidStateError'
import NotFoundError from './errors/NotFoundError'
import ReadOnlyError from './errors/ReadOnlyError'
import TransactionInactiveError from './errors/TransactionInactiveError'
import cmp from './cmp'
import extractKey from './extractKey'
import validateKey from './validateKey'
import validateKeyPath from './validateKeyPath'

// http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#object-store
module.exports = class FBObjectStore {
  constructor(transaction, rawObjectStore) {
    this._rawObjectStore = rawObjectStore
    this._rawIndexesCache = {} // Store the FDBIndex objects

    this.name = rawObjectStore.name
    this.keyPath = rawObjectStore.keyPath
    this.indexNames = Object.keys(rawObjectStore.rawIndexes).sort()
    this.autoIncrement = rawObjectStore.autoIncrement
    this.transaction = transaction
  }

  put(value, key) {
    const record = buildRecordAddPut.call(this, value, key)
    return this.transaction._execRequestAsync({
      source: this,
      operation: this._rawObjectStore.storeRecord.bind(this._rawObjectStore, record, false, this.transaction._rollbackLog),
    })
  }

  add(value, key) {
    const record = buildRecordAddPut.call(this, value, key)
    return this.transaction._execRequestAsync({
      source: this,
      operation: this._rawObjectStore.storeRecord.bind(this._rawObjectStore, record, true, this.transaction._rollbackLog),
    })
  }

  delete(key) {
    if (this.transaction.mode === 'readonly') {
      throw new ReadOnlyError()
    }
    confirmActiveTransaction(this)


    if (!(key instanceof FDBKeyRange)) {
      key = structuredClone(validateKey(key))
    }

    return this.transaction._execRequestAsync({
      source: this,
      operation: this._rawObjectStore.deleteRecord.bind(this._rawObjectStore, key, this.transaction._rollbackLog),
    })
  }

  get(key) {
    confirmActiveTransaction(this)

    if (!(key instanceof FDBKeyRange)) {
      key = structuredClone(validateKey(key))
    }

    return this.transaction._execRequestAsync({
      source: this,
      operation: this._rawObjectStore.getValue.bind(this._rawObjectStore, key),
    })
  }

  clear() {
    if (this.transaction.mode === 'readonly') {
      throw new ReadOnlyError()
    }
    confirmActiveTransaction(this)

    return this.transaction._execRequestAsync({
      source: this,
      operation: this._rawObjectStore.clear.bind(this._rawObjectStore, this.transaction._rollbackLog),
    })
  }

  openCursor(range, direction) {
    confirmActiveTransaction(this)

    if (range === null) { range = undefined }
    if (range !== undefined && !(range instanceof FDBKeyRange)) {
      range = FDBKeyRange.only(structuredClone(validateKey(range)))
    }

    const request = new FDBRequest()
    request.source = this
    request.transaction = this.transaction

    const cursor = new FDBCursorWithValue(this, range, direction)
    cursor._request = request

    return this.transaction._execRequestAsync({
      source: this,
      operation: cursor._iterate.bind(cursor),
      request,
    })
  }

  // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#widl-IDBObjectStore-createIndex-IDBIndex-DOMString-name-DOMString-sequence-DOMString--keyPath-IDBIndexParameters-optionalParameters
  createIndex(name, keyPath, optionalParameters) {
    if (keyPath === undefined) { throw new TypeError() }

    optionalParameters = optionalParameters !== undefined ? optionalParameters : {}
    const multiEntry = optionalParameters.multiEntry !== undefined ? optionalParameters.multiEntry : false
    const unique = optionalParameters.unique !== undefined ? optionalParameters.unique : false

    if (this.transaction.mode !== 'versionchange') {
      throw new InvalidStateError()
    }

    confirmActiveTransaction(this)

    if (this.indexNames.indexOf(name) >= 0) {
      throw new ConstraintError()
    }

    validateKeyPath(keyPath)

    if (Array.isArray(keyPath) && multiEntry) {
      throw new InvalidAccessError()
    }

    // The index that is requested to be created can contain constraints on the data allowed in the index's referenced object store, such as requiring uniqueness of the values referenced by the index's keyPath. If the referenced object store already contains data which violates these constraints, this MUST NOT cause the implementation of createIndex to throw an exception or affect what it returns. The implementation MUST still create and return an IDBIndex object. Instead the implementation must queue up an operation to abort the "versionchange" transaction which was used for the createIndex call.

    this.transaction._rollbackLog.push(function rollbackItem(indexNames) {
      this.indexNames = indexNames
      delete this._rawObjectStore.rawIndexes[name]
    }.bind(this, this.indexNames.slice()))

    const returnIndex = new Index(this._rawObjectStore, name, keyPath, multiEntry, unique)
    this.indexNames.push(name)
    this.indexNames.sort()
    this._rawObjectStore.rawIndexes[name] = returnIndex

    returnIndex.initialize(this.transaction) // This is async by design

    return new FDBIndex(this, returnIndex)
  }

  index(name) {
    if (name === undefined) { throw new TypeError() }

    if (this._rawIndexesCache.hasOwnProperty(name)) {
      return this._rawIndexesCache[name]
    }

    if (this.indexNames.indexOf(name) < 0) {
      throw new NotFoundError()
    }

    if (this._rawObjectStore.deleted) {
      throw new InvalidStateError()
    }

    const returnIndex = new FDBIndex(this, this._rawObjectStore.rawIndexes[name])
    this._rawIndexesCache[name] = returnIndex

    return returnIndex
  }

  deleteIndex(name) {
    if (name === undefined) { throw new TypeError() }

    if (this.transaction.mode !== 'versionchange') {
      throw new InvalidStateError()
    }

    confirmActiveTransaction(this)

    if (!this._rawObjectStore.rawIndexes.hasOwnProperty(name)) {
      throw new NotFoundError()
    }

    this.transaction._rollbackLog.push(function rollbackItem(index) {
      index.deleted = false
      this._rawObjectStore.rawIndexes[name] = index
      this.indexNames.push(name)
      this.indexNames.sort()
    }.bind(this, this._rawObjectStore.rawIndexes[name]))

    this.indexNames = this.indexNames.filter((indexName) => {
      return indexName !== name
    })
    this._rawObjectStore.rawIndexes[name].deleted = true // Not sure if this is supposed to happen synchronously

    this.transaction._execRequestAsync({
      source: this,
      operation: () => {
        delete this._rawObjectStore.rawIndexes[name]
      },
    })
  }

  // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#widl-IDBObjectStore-count-IDBRequest-any-key
  count(key) {
    confirmActiveTransaction(this)

    if (key !== undefined && !(key instanceof FDBKeyRange)) {
      key = structuredClone(validateKey(key))
    }

// Should really use a cursor under the hood
    return this.transaction._execRequestAsync({
      source: this,
      operation: () => {
        let count

        if (key instanceof FDBKeyRange) {
          count = 0
          this._rawObjectStore.records.forEach((record) => {
            if (FDBKeyRange.check(key, record.key)) {
              count += 1
            }
          })
        } else if (key !== undefined) {
          count = 0
          this._rawObjectStore.records.forEach((record) => {
            if (cmp(record.key, key) === 0) {
              count += 1
            }
          })
        } else {
          count = this._rawObjectStore.records.length
        }

        return count
      },
    })
  }

  toString() {
    return '[object IDBObjectStore]'
  }
}


function confirmActiveTransaction(objectStore) {
  if (objectStore._rawObjectStore.deleted) {
    throw new InvalidStateError()
  }

  if (!objectStore.transaction._active) {
    throw new TransactionInactiveError()
  }
}

function buildRecordAddPut(value, key) {
  if (this.transaction.mode === 'readonly') {
    throw new ReadOnlyError()
  }

  confirmActiveTransaction(this)

  if (this.keyPath !== null) {
    if (key !== undefined) {
      throw new DataError()
    }

    const tempKey = extractKey(this.keyPath, value)

    if (tempKey !== undefined) {
      validateKey(tempKey)
    } else {
      if (!this._rawObjectStore.keyGenerator) {
        throw new DataError()
      }
    }
  }

  if (this.keyPath === null && this._rawObjectStore.keyGenerator === null && key === undefined) {
    throw new DataError()
  }

  if (key !== undefined) {
    validateKey(key)
  }

  return {
    key: structuredClone(key),
    value: structuredClone(value),
  }
}
