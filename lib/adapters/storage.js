import localForage from 'localforage'
import values from 'object-values'
import Database from '../Database'
import ObjectStore from '../ObjectStore'
import Index from '../Index'
const prefix = '__idb__'

exports.getDatabase = (name, cb) => {
  localForage.getItem(prefix + name, (err, rawDb) => {
    if (err) return cb(err)
    if (!rawDb) return cb()
    cb(null, initDb(rawDb))
  })
}

exports.openDatabase = (name, cb) => {
  localForage.getItem(prefix + name, (err, rawDb) => {
    if (err) return cb(err)
    cb(null, rawDb ? initDb(rawDb) : new Database(name, 0))
  })
}

exports.deleteDatabase = (name, cb) => {
  localForage.removeItem(prefix + name, cb)
}

exports.submitTransaction = (tr, cb) => {
  if (tr.mode === 'readonly') return setImmediate(cb)
  localForage.setItem(prefix + tr.db.name, {
    name: tr.db.name,
    version: tr.db.version,
    stores: values(tr.db._rawDatabase.rawObjectStores).map((store) => {
      return {
        name: store.name,
        keyPath: store.keyPath,
        autoIncrement: store.autoIncrement,
        records: store.records,
        indexes: store.rawIndexes.map((index) => {
          return {
            name: index.name,
            keyPath: index.keyPath,
            multiEntry: index.multiEntry,
            unique: index.unique,
            records: index.records,
          }
        }),
      }
    }),
  }, cb)
}

function initDb(rawDb) {
  const db = new Database(rawDb.name, rawDb.version)
  rawDb.stores.forEach((s) => {
    const store = new ObjectStore(db, s.name, s.keyPath, s.autoIncrement, s.records)
    s.indexes.forEach((i) => {
      store.rawIndexes[i.name] = new Index(store, i.name, i.keyPath, i.multiEntry, i.unique, i.records)
    })
    db.rawObjectStores[s.name] = store
  })
  return db
}
