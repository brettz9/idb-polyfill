import isPlainObject from 'is-plain-obj'
import DataCloneError from './errors/DataCloneError'

module.exports = structuredClone

// http://www.w3.org/TR/html5/infrastructure.html#internal-structured-cloning-algorithm
function structuredClone(input, memory) {
  memory = memory !== undefined ? memory : []

  for (let i = 0; i < memory.length; i++) {
    if (memory[i].source === input) {
      return memory[i].destination
    }
  }

  const type = typeof input
  let output
  let deepClone = 'none'

  if (type === 'string' || type === 'number' || type === 'boolean' || type === 'undefined' || input === null) {
    return input
  }

  if (input instanceof Boolean || input instanceof Number || input instanceof String || input instanceof Date) {
    output = new input.constructor(input.valueOf())
  } else if (input instanceof RegExp) {
    output = new RegExp(input.source, 'g'.substr(0, Number(input.global)) + 'i'.substr(0, Number(input.ignoreCase)) + 'm'.substr(0, Number(input.multiline)))

    // Supposed to also handle Blob, FileList, ImageData, ImageBitmap, ArrayBuffer, and "object with a [[DataView]] internal slot", but fuck it
  } else if (Array.isArray(input)) {
    output = new Array(input.length)
    deepClone = 'own'
  } else if (isPlainObject(input)) {
    output = {}
    deepClone = 'own'
  } else if (input instanceof Map) {
    output = new Map()
    deepClone = 'map'
  } else if (input instanceof Set) {
    output = new Set()
    deepClone = 'set'
  } else {
    throw new DataCloneError()
  }

  memory.push({
    source: input,
    destination: output,
  })

  if (deepClone === 'map') {
    throw new DataCloneError('Map support not implemented yet')
  } else if (deepClone === 'set') {
    throw new DataCloneError('Set support not implemented yet')
  } else if (deepClone === 'own') {
    Object.keys(input).forEach((name) => {
      if (input.hasOwnProperty(name)) {
        const sourceValue = input[name]
        const clonedValue = structuredClone(sourceValue, memory)
        output[name] = clonedValue
      }
    })
  }

  return output
}
