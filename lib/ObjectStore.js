import structuredClone from './structuredClone'
import FDBKeyRange from '../lib/FDBKeyRange'
import KeyGenerator from './KeyGenerator'
import ConstraintError from './errors/ConstraintError'
import DataError from './errors/DataError'
import cmp from './cmp'
import extractKey from './extractKey'

// http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-object-store
module.exports = class ObjectStore {
  constructor(rawDatabase, name, keyPath, autoIncrement) {
    this.rawDatabase = rawDatabase
    this.records = []
    this.rawIndexes = {}
    this.keyGenerator = autoIncrement === true ? new KeyGenerator() : null
    this.deleted = false

    this.name = name
    this.keyPath = keyPath
    this.autoIncrement = autoIncrement
  }

  // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-steps-for-retrieving-a-value-from-an-object-store
  getValue(key) {
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

    return record !== undefined ? structuredClone(record.value) : undefined
  }

  // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-steps-for-storing-a-record-into-an-object-store
  storeRecord(newRecord, noOverwrite, rollbackLog) {
    if (this.keyPath !== null) {
      const key = extractKey(this.keyPath, newRecord.value)
      if (key !== undefined) {
        newRecord.key = key
      }
    }

    let i
    if (this.keyGenerator !== null && newRecord.key === undefined) {
      if (rollbackLog) {
        rollbackLog.push(function rollbackItem(keyGeneratorBefore) {
          this.keyGenerator.num = keyGeneratorBefore
        }.bind(this, this.keyGenerator.num))
      }

      newRecord.key = this.keyGenerator.next()

      // Set in value if keyPath defiend but led to no key
      // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-steps-to-assign-a-key-to-a-value-using-a-key-path
      if (this.keyPath !== null) {
        let remainingKeyPath = this.keyPath
        let object = newRecord.value
        let identifier

        i = 0 // Just to run the loop at least once
        while (i >= 0) {
          if (typeof object !== 'object') {
            throw new DataError()
          }

          i = remainingKeyPath.indexOf('.')
          if (i >= 0) {
            identifier = remainingKeyPath.slice(0, i)
            remainingKeyPath = remainingKeyPath.slice(i + 1)

            if (!object.hasOwnProperty(identifier)) {
              object[identifier] = {}
            }

            object = object[identifier]
          }
        }

        identifier = remainingKeyPath

        object[identifier] = newRecord.key
      }
    } else if (this.keyGenerator !== null && typeof newRecord.key === 'number') {
      this.keyGenerator.setIfLarger(newRecord.key)
    }

    i = this.records.findIndex((r) => {
      return cmp(r.key, newRecord.key) === 0
    })

    if (i >= 0) {
      if (noOverwrite) throw new ConstraintError()
      this.deleteRecord(newRecord.key, rollbackLog)
    }

    // Find where to put it so it's sorted by key
    if (this.records.length === 0) {
      i = 0
    }
    i = this.records.findIndex((record) => {
      return cmp(record.key, newRecord.key) === 1
    })
    if (i === -1) {
      i = this.records.length
    }
    this.records.splice(i, 0, newRecord)

    // Update indexes
    Object.keys(this.rawIndexes).forEach((name) => {
      if (this.rawIndexes[name].initialized) {
        this.rawIndexes[name].storeRecord(newRecord)
      }
    })

    if (rollbackLog) {
      rollbackLog.push(this.deleteRecord.bind(this, newRecord.key))
    }

    return newRecord.key
  }

  // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-steps-for-deleting-records-from-an-object-store
  deleteRecord(key, rollbackLog) {
    let range
    if (key instanceof FDBKeyRange) {
      range = key
    } else {
      range = FDBKeyRange.only(key)
    }

    this.records = this.records.filter((record) => {
      const shouldDelete = FDBKeyRange.check(range, record.key)

      if (shouldDelete && rollbackLog) {
        rollbackLog.push(this.storeRecord.bind(this, record, true))
      }

      return !shouldDelete
    })

    Object.keys(this.rawIndexes).forEach((name) => {
      const rawIndex = this.rawIndexes[name]
      rawIndex.records = rawIndex.records.filter((record) => {
        return !FDBKeyRange.check(range, record.value)
      })
    })
  }

  // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-steps-for-clearing-an-object-store
  clear(rollbackLog) {
    if (rollbackLog) {
      this.records.forEach((record) => {
        rollbackLog.push(this.storeRecord.bind(this, record, true))
      })
    }

    this.records = []
    Object.keys(this.rawIndexes).forEach((name) => {
      const rawIndex = this.rawIndexes[name]
      rawIndex.records = []
    })
  }
}
