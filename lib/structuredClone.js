import realisticStructuredClone from 'realistic-structured-clone'
import DataCloneError from './errors/DataCloneError'

module.exports = function structuredClone(input) {
  try {
    return realisticStructuredClone(input)
  } catch (err) {
    throw new DataCloneError()
  }
}
