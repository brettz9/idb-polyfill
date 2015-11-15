import FDBRequest from './FDBRequest'

module.exports = class FDBOpenDBRequest extends FDBRequest {
  constructor() {
    super()
    this.onupgradeneeded = null
    this.onblocked = null
  }

  toString() {
    return '[object IDBOpenDBRequest]'
  }
}
