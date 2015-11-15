require('../src/idb-polyfill').polyfill()

if (typeof localStorage !== 'undefined') {
  before(function() { localStorage.clear() })
  after(function() { localStorage.clear() })
}

module.exports = global.pIndexedDB || global.indexedDB
