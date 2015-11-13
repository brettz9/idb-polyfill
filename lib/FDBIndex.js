import structuredClone from './structuredClone'
import FDBCursor from './FDBCursor'
import FDBCursorWithValue from './FDBCursorWithValue'
import FDBKeyRange from './FDBKeyRange'
import FDBRequest from './FDBRequest'
import InvalidStateError from './errors/InvalidStateError'
import TransactionInactiveError from './errors/TransactionInactiveError'
import cmp from './cmp'
import validateKey from './validateKey'

// http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#idl-def-IDBIndex
module.exports = class FDBIndex {
  constructor(objectStore, rawIndex) {
    this._rawIndex = rawIndex
    this.name = rawIndex.name
    this.objectStore = objectStore
    this.keyPath = rawIndex.keyPath
    this.multiEntry = rawIndex.multiEntry
    this.unique = rawIndex.unique
  }

    // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#widl-IDBIndex-openCursor-IDBRequest-any-range-IDBCursorDirection-direction
  openCursor(range, direction) {
    confirmActiveTransaction(this)

    if (range === null) { range = undefined }
    if (range !== undefined && !(range instanceof FDBKeyRange)) {
      range = FDBKeyRange.only(structuredClone(validateKey(range)))
    }

    const request = new FDBRequest()
    request.source = this
    request.transaction = this.objectStore.transaction

    const cursor = new FDBCursorWithValue(this, range, direction)
    cursor._request = request

    return this.objectStore.transaction._execRequestAsync({
      source: this,
      operation: cursor._iterate.bind(cursor),
      request: request,
    })
  }

  // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#widl-IDBIndex-openKeyCursor-IDBRequest-any-range-IDBCursorDirection-direction
  openKeyCursor(range, direction) {
    confirmActiveTransaction(this)

    if (range === null) { range = undefined }
    if (range !== undefined && !(range instanceof FDBKeyRange)) {
      range = FDBKeyRange.only(structuredClone(validateKey(range)))
    }

    const request = new FDBRequest()
    request.source = this
    request.transaction = this.objectStore.transaction

    const cursor = new FDBCursor(this, range, direction)
    cursor._request = request

    return this.objectStore.transaction._execRequestAsync({
      source: this,
      operation: cursor._iterate.bind(cursor),
      request: request,
    })
  }

  get(key) {
    confirmActiveTransaction(this)

    if (!(key instanceof FDBKeyRange)) {
      key = structuredClone(validateKey(key))
    }

    return this.objectStore.transaction._execRequestAsync({
      source: this,
      operation: this._rawIndex.getValue.bind(this._rawIndex, key),
    })
  }

  // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#widl-IDBIndex-getKey-IDBRequest-any-key
  getKey(key) {
    confirmActiveTransaction(this)

    if (!(key instanceof FDBKeyRange)) {
      key = structuredClone(validateKey(key))
    }

    return this.objectStore.transaction._execRequestAsync({
      source: this,
      operation: this._rawIndex.getKey.bind(this._rawIndex, key),
    })
  }

  // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#widl-IDBIndex-count-IDBRequest-any-key
  count(key) {
    confirmActiveTransaction(this)

    if (key !== undefined && !(key instanceof FDBKeyRange)) {
      key = structuredClone(validateKey(key))
    }

// Should really use a cursor under the hood
    return this.objectStore.transaction._execRequestAsync({
      source: this,
      operation: () => {
        let count

        if (key instanceof FDBKeyRange) {
          count = 0
          this._rawIndex.records.forEach((record) => {
            if (FDBKeyRange.check(key, record.key)) {
              count += 1
            }
          })
        } else if (key !== undefined) {
          count = 0
          this._rawIndex.records.forEach((record) => {
            if (cmp(record.key, key) === 0) {
              count += 1
            }
          })
        } else {
          count = this._rawIndex.records.length
        }

        return count
      },
    })
  }

  toString() {
    return '[object IDBIndex]'
  }
}

function confirmActiveTransaction(index) {
  if (!index.objectStore.transaction._active) throw new TransactionInactiveError()
  if (index._rawIndex.deleted || index.objectStore._rawObjectStore.deleted) throw new InvalidStateError()
}
