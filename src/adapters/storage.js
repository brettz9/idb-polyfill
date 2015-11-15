import values from 'object-values'
import Database from '../Database'
import ObjectStore from '../ObjectStore'
import Index from '../Index'
const prefix = '__idb__'
const connections = {}
const isDate = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/

const storage = {
  get(key, cb) {
    setImmediate(() => {
      try {
        cb(null, JSON.parse(localStorage.getItem(key), dateReviewer))
      } catch (err) {
        cb(err)
      }
    })
  },

  set(key, val, cb) {
    setImmediate(() => {
      try {
        localStorage.setItem(key, JSON.stringify(val))
        cb()
      } catch (err) {
        cb(err)
      }
    })
  },

  del(key, cb) {
    setImmediate(() => {
      try {
        localStorage.removeItem(key)
        cb()
      } catch (err) {
        cb(err)
      }
    })
  },
}

exports.getDatabase = (name, cb) => {
  storage.get(prefix + name, (err, rawDb) => {
    if (err) return cb(err)
    if (!rawDb) return cb()
    cb(null, initDb(rawDb))
  })
}

exports.openDatabase = (name, cb) => {
  storage.get(prefix + name, (err, rawDb) => {
    if (err) return cb(err)
    cb(null, rawDb ? initDb(rawDb) : new Database(name, 0))
  })
}

exports.deleteDatabase = (name, cb) => {
  delete connections[name]
  storage.del(prefix + name, cb)
}

exports.submitTransaction = (tr, cb) => {
  if (tr.mode === 'readonly') return setImmediate(cb)
  const newVal = {
    name: tr.db.name,
    version: tr.db.version,
    stores: values(tr.db._rawDatabase.rawObjectStores).map((s) => {
      return {
        name: s.name,
        keyPath: s.keyPath,
        autoIncrement: s.autoIncrement,
        records: s.records,
        indexes: values(s.rawIndexes).map((i) => {
          return {
            name: i.name,
            keyPath: i.keyPath,
            multiEntry: i.multiEntry,
            unique: i.unique,
            records: i.records,
          }
        }),
      }
    }),
  }
  storage.set(prefix + tr.db.name, newVal, cb)
}

exports.pushConnection = (fdb) => {
  if (!connections[fdb._rawDatabase.name]) connections[fdb._rawDatabase.name] = []
  connections[fdb._rawDatabase.name].push(fdb)
}

function initDb(rawDb) {
  const db = new Database(rawDb.name, rawDb.version)
  if (connections[rawDb.name]) db.connections = connections[rawDb.name]

  rawDb.stores.forEach((s) => {
    const store = new ObjectStore(db, s.name, s.keyPath, s.autoIncrement, s.records)
    s.indexes.forEach((i) => {
      store.rawIndexes[i.name] = new Index(store, i.name, i.keyPath, i.multiEntry, i.unique, i.records)
      store.rawIndexes[i.name].initialized = true
    })
    db.rawObjectStores[s.name] = store
  })

  return db
}

function dateReviewer(key, value) {
  if (typeof value === 'string' && isDate.exec(value)) return new Date(value)
  return value
}
