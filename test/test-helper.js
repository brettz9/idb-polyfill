require('../src/idb-polyfill').polyfill()

before(function() { localStorage.clear() })
after(function() { localStorage.clear() })

mocha.setup({ timeout: 10000 })
module.exports = global.pIndexedDB || global.indexedDB
