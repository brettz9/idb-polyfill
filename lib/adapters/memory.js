import Database from '../Database'
const databases = Object.create(null)

exports.getDatabase = (name, cb) => {
  setImmediate(() => {
    cb(null, databases[name])
  })
}

exports.openDatabase = (name, cb) => {
  setImmediate(() => {
    if (!databases[name]) databases[name] = new Database(name, 0)
    cb(null, databases[name])
  })
}

exports.deleteDatabase = (name, cb) => {
  setImmediate(() => {
    delete databases[name]
    cb()
  })
}

exports.submitTransaction = (tr, cb) => {
  setImmediate(() => {
    cb()
  })
}
