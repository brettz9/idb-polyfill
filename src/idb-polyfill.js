import 'array.prototype.find'
import 'array.prototype.findindex'
import 'setimmediate'
import 'polyfill-function-prototype-bind'
import deets from 'deets'
import IDBFactory from './FDBFactory'
import IDBKeyRange from './FDBKeyRange'
import IDBCursor from './FDBCursor'
import IDBCursorWithValue from './FDBCursorWithValue'
import IDBDatabase from './FDBDatabase'
import IDBIndex from './FDBIndex'
import IDBObjectStore from './FDBObjectStore'
import IDBOpenDBRequest from './FDBOpenDBRequest'
import IDBRequest from './FDBRequest'
import IDBTransaction from './FDBTransaction'
import IDBVersionChangeEvent from './FDBVersionChangeEvent'

const indexedDB = new IDBFactory()
module.exports = {
  indexedDB,
  IDBCursor,
  IDBCursorWithValue,
  IDBDatabase,
  IDBFactory,
  IDBIndex,
  IDBKeyRange,
  IDBObjectStore,
  IDBOpenDBRequest,
  IDBRequest,
  IDBTransaction,
  IDBVersionChangeEvent,

  polyfill() {
    if (typeof global.pIndexedDB !== 'undefined') return
    global.pIndexedDB = indexedDB
    global.pIDBCursor = IDBCursor
    global.pIDBCursorWithValue = IDBCursorWithValue
    global.pIDBDatabase = IDBDatabase
    global.pIDBFactory = IDBFactory
    global.pIDBIndex = IDBIndex
    global.pIDBKeyRange = IDBKeyRange
    global.pIDBObjectStore = IDBObjectStore
    global.pIDBOpenDBRequest = IDBOpenDBRequest
    global.pIDBRequest = IDBRequest
    global.pIDBTransaction = IDBTransaction
    global.pIDBVersionChangeEvent = IDBVersionChangeEvent
  },

  polyfillExcept(browsers = []) {
    const browser = deets()
    if (typeof indexedDB === 'undefined' || browsers.indexOf(browser.name) === -1) {
      this.polyfill()
    }
  },
}
