import FDBCursor from './FDBCursor'

module.exports = class FDBCursorWithValue extends FDBCursor {
  constructor(...args) {
    super(...args)
    this.value = undefined
  }

  toString() {
    return '[object IDBCursorWithValue]'
  }
}
