import structuredClone from './structuredClone'
import validateKey from './validateKey'

// http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-steps-for-extracting-a-key-from-a-value-using-a-key-path
module.exports = function extractKey(keyPath, value) {
  if (Array.isArray(keyPath)) {
    const result = []

    keyPath.forEach((item) => {
      // This doesn't make sense to me based on the spec, but it is needed to pass the W3C KeyPath tests (see same comment in validateKey)
      if (item !== undefined && item !== null && typeof item !== 'string' && item.toString) {
        item = item.toString()
      }
      result.push(structuredClone(validateKey(extractKey(item, value))))
    })

    return result
  }

  if (keyPath === '') {
    return value
  }

  let remainingKeyPath = keyPath
  let object = value

  while (remainingKeyPath !== null) {
    const i = remainingKeyPath.indexOf('.')
    let identifier

    if (i >= 0) {
      identifier = remainingKeyPath.slice(0, i)
      remainingKeyPath = remainingKeyPath.slice(i + 1)
    } else {
      identifier = remainingKeyPath
      remainingKeyPath = null
    }

    if (!object.hasOwnProperty(identifier)) {
      return undefined
    }

    object = object[identifier]
  }

  return object
}
