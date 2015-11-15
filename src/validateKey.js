import DataError from './errors/DataError'

// http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-valid-key
module.exports = function validateKey(key, seen) {
  if (typeof key === 'number') {
    if (isNaN(key)) {
      throw new DataError()
    }
  } else if (key instanceof Date) {
    if (isNaN(key.valueOf())) {
      throw new DataError()
    }
  } else if (Array.isArray(key)) {
    seen = seen !== undefined ? seen : []
    key.forEach((x) => {
      // Only need to test objects, because otherwise [0, 0] shows up as circular
      if (typeof x === 'object' && seen.indexOf(x) >= 0) {
        throw new DataError()
      }
      seen.push(x)
    })

    let count = 0
    key = key.map((item) => {
      count += 1
      return validateKey(item, seen)
    })
    if (count !== key.length) {
      throw new DataError()
    }
    return key
  } else if (typeof key !== 'string') {
    throw new DataError()
  }

  return key
}
