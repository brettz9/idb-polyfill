import DataError from './errors/DataError'
import cmp from './cmp'
import validateKey from './validateKey'

// http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#range-concept
module.exports = class FDBKeyRange {
  constructor(lower, upper, lowerOpen, upperOpen) {
    this.lower = lower
    this.upper = upper
    this.lowerOpen = lowerOpen
    this.upperOpen = upperOpen
  }

  toString() {
    return '[object IDBKeyRange]'
  }

  static only(value) {
    if (value === undefined) throw new TypeError()
    validateKey(value)
    return new FDBKeyRange(value, value, false, false)
  }

  static lowerBound(lower, open) {
    if (lower === undefined) throw new TypeError()
    validateKey(lower)
    return new FDBKeyRange(lower, undefined, open === true ? true : false, true)
  }

  static upperBound(upper, open) {
    if (upper === undefined) throw new TypeError()
    validateKey(upper)
    return new FDBKeyRange(undefined, upper, true, open === true ? true : false)
  }

  static bound(lower, upper, lowerOpen, upperOpen) {
    if (lower === undefined || upper === undefined) throw new TypeError()
    const cmpResult = cmp(lower, upper)
    if (cmpResult === 1 || (cmpResult === 0 && (lowerOpen || upperOpen))) throw new DataError()
    validateKey(lower)
    validateKey(upper)
    return new FDBKeyRange(lower, upper, lowerOpen === true ? true : false, upperOpen === true ? true : false)
  }

  static check(keyRange, key) {
    let cmpResult
    if (keyRange.lower !== undefined) {
      cmpResult = cmp(keyRange.lower, key)
      if (cmpResult === 1 || (cmpResult === 0 && keyRange.lowerOpen)) return false
    }
    if (keyRange.upper !== undefined) {
      cmpResult = cmp(keyRange.upper, key)
      if (cmpResult === -1 || (cmpResult === 0 && keyRange.upperOpen)) return false
    }
    return true
  }
}
