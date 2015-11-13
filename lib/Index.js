import FDBKeyRange from './FDBKeyRange'
import ConstraintError from './errors/ConstraintError'
import cmp from './cmp'
import extractKey from './extractKey'
import validateKey from './validateKey'

// http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-index
module.exports = class Index {
  constructor(rawObjectStore, name, keyPath, multiEntry, unique) {
    this.records = []
    this.rawObjectStore = rawObjectStore
    this.initialized = false
    this.deleted = false

    // Initialized should be used to decide whether to throw an error or abort the versionchange transaction when there is a constraint
    this.name = name
    this.keyPath = keyPath
    this.multiEntry = multiEntry
    this.unique = unique
  }

  // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-steps-for-storing-a-record-into-an-object-store (step 7)
  storeRecord(newRecord) {
    let indexKey = extractKey(this.keyPath, newRecord.value)
    if (indexKey === undefined) return

    if (!this.multiEntry || !Array.isArray(indexKey)) {
      try {
        validateKey(indexKey)
      } catch (e) {
        return
      }
    } else {
      // remove any elements from index key that are not valid keys and remove any duplicate elements from index key such that only one instance of the duplicate value remains.
      const keep = []
      indexKey.forEach((part) => {
        if (keep.indexOf(part) < 0) {
          try {
            validateKey(part)
            keep.push(part)
          } catch (err) { /* Do nothing */ }
        }
      })
      indexKey = keep
    }

    if (!this.multiEntry || !Array.isArray(indexKey)) {
      if (this.unique) {
        const i = this.records.findIndex((record) => {
          return cmp(record.key, indexKey) === 0
        })
        if (i >= 0) {
          throw new ConstraintError()
        }
      }
    } else {
      if (this.unique) {
        indexKey.forEach((individualIndexKey) => {
          this.records.forEach((record) => {
            if (cmp(record.key, individualIndexKey) === 0) {
              throw new ConstraintError()
            }
          })
        })
      }
    }

    // Store record {key (indexKey) and value (recordKey)} sorted ascending by key (primarily) and value (secondarily)
    const storeInIndex = (newNewRecord) => {
      let i = this.records.findIndex((record) => {
        return cmp(record.key, newNewRecord.key) >= 0
      })

      // If no matching key, add to end
      if (i === -1) {
        i = this.records.length
      } else {
        // If matching key, advance to appropriate position based on value
        while (i < this.records.length && cmp(this.records[i].key, newNewRecord.key) === 0) {
          if (cmp(this.records[i].value, newNewRecord.value) !== -1) {
            // Record value >= newNewRecord value, so insert here
            break
          }

          i += 1 // Look at next record
        }
      }

      this.records.splice(i, 0, newNewRecord)
    }

    if (!this.multiEntry || !Array.isArray(indexKey)) {
      storeInIndex({
        key: indexKey,
        value: newRecord.key,
      })
    } else {
      indexKey.forEach((individualIndexKey) => {
        storeInIndex({
          key: individualIndexKey,
          value: newRecord.key,
        })
      })
    }
  }

  _getRecord(key) {
    let record
    if (key instanceof FDBKeyRange) {
      record = this.records.find((r) => {
        return FDBKeyRange.check(key, r.key)
      })
    } else {
      record = this.records.find((r) => {
        return cmp(r.key, key) === 0
      })
    }
    return record
  }

  // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-steps-for-retrieving-a-value-from-an-index
  getKey(key) {
    const record = this._getRecord(key)
    return record !== undefined ? record.value : undefined
  }

  // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#index-referenced-value-retrieval-operation
  getValue(key) {
    const record = this._getRecord(key)
    return record !== undefined ? this.rawObjectStore.getValue(record.value) : undefined
  }


  initialize(transaction) {
    if (this.initialized) throw new Error('Index already initialized')
    transaction._execRequestAsync({
      source: null,
      operation: () => {
        try {
          // Create index based on current value of objectstore
          this.rawObjectStore.records.forEach((record) => {
            this.storeRecord(record)
          })
          this.initialized = true
        } catch (err) {
          transaction._abort(err.name)
        }
      },
    })
  }
}
