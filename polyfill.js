var browser = require('deets')()
var goodBrowser = browser.name === 'Chrome' || browser.name === 'Firefox' || browser.name === 'Opera'

if (!goodBrowser) {
  global.indexedDB = global.fakeIndexedDB = require('.')
  global.IDBCursor = require('./lib/FDBCursor')
  global.IDBCursorWithValue = require('./lib/FDBCursorWithValue')
  global.IDBDatabase = require('./lib/FDBDatabase')
  global.IDBFactory = require('./lib/FDBFactory')
  global.IDBIndex = require('./lib/FDBIndex')
  global.IDBKeyRange = require('./lib/FDBKeyRange')
  global.IDBObjectStore = require('./lib/FDBObjectStore')
  global.IDBOpenDBRequest = require('./lib/FDBOpenDBRequest')
  global.IDBRequest = require('./lib/FDBRequest')
  global.IDBTransaction = require('./lib/FDBTransaction')
  global.IDBVersionChangeEvent = require('./lib/FDBVersionChangeEvent')
}
