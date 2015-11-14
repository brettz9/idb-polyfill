import Event from './Event'
import FDBOpenDBRequest from './FDBOpenDBRequest'
import FDBDatabase from './FDBDatabase'
import FDBVersionChangeEvent from './FDBVersionChangeEvent'
import AbortError from './errors/AbortError'
import VersionError from './errors/VersionError'
import cmp from './cmp'
import adapter from './adapter'

module.exports = class FDBFactory {
  constructor() {
    this.cmp = cmp
  }

  // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#widl-IDBFactory-deleteDatabase-IDBOpenDBRequest-DOMString-name
  deleteDatabase(name) {
    const request = new FDBOpenDBRequest()
    request.source = null

    adapter.getDatabase(name, (err1, db) => {
      if (err1) return onError(err1)
      const version = db ? db.version : null

      deleteDatabase(db, request, (err2) => {
        if (err2) return onError(err2)
        request.result = undefined
        const event = new FDBVersionChangeEvent('success', {
          oldVersion: version,
          newVersion: null,
        })
        request.dispatchEvent(event)
      })
    })

    return request

    function onError(err) {
      request.error = new Error()
      request.error.name = err.name

      const event = new Event('error', {
        bubbles: true,
        cancelable: false,
      })

      event._eventPath = []
      request.dispatchEvent(event)
    }
  }

  // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#widl-IDBFactory-open-IDBOpenDBRequest-DOMString-name-unsigned-long-long-version
  open(name, version) {
    if (arguments.length > 1 && (isNaN(version) || version < 1 || version >= 9007199254740992)) {
      throw new TypeError()
    }

    const request = new FDBOpenDBRequest()
    request.source = null

    adapter.openDatabase(name, (err1, db) => {
      if (err1) return onError(err1)

      openDatabase(db, version, request, (err2, connection) => {
        if (err2) return onError(err2)

        request.result = connection
        const event = new Event('success')
        event._eventPath = []
        request.dispatchEvent(event)
      })
    })

    return request

    function onError(err) {
      request.result = undefined

      request.error = new Error()
      request.error.name = err.name

      const event = new Event('error', {
        bubbles: true,
        cancelable: false,
      })

      event._eventPath = []
      request.dispatchEvent(event)
    }
  }

  toString() {
    return '[object IDBFactory]'
  }
}

// http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-steps-for-deleting-a-database
function deleteDatabase(db, request, cb) {
  if (!db) return cb()
  let openDatabases

  try {
    db.deletePending = true
    openDatabases = db.connections.filter((connection) => {
      return !connection._closed
    })

    openDatabases.forEach((openDb) => {
      if (!openDb._closePending) {
        const event = new FDBVersionChangeEvent('versionchange', {
          oldVersion: db.version,
          newVersion: null,
        })
        openDb.dispatchEvent(event)
      }
    })

    const anyOpen = openDatabases.some((openDb) => {
      return !openDb._closed
    })

    if (request && anyOpen) {
      const event = new FDBVersionChangeEvent('blocked', {
        oldVersion: db.version,
        newVersion: null,
      })
      request.dispatchEvent(event)
    }
  } catch (err) {
    cb(err)
  }

  function waitForOthersClosed() {
    const hasAnyOpen = openDatabases.some((openDb) => {
      return !openDb._closed
    })

    if (hasAnyOpen) {
      setImmediate(waitForOthersClosed)
      return
    }

    adapter.deleteDatabase(db.name, cb)
  }

  waitForOthersClosed()
}


// http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-steps-for-opening-a-database
function openDatabase(db, version, request, cb) {
  if (version === undefined) {
    version = db.version !== 0 ? db.version : 1
  }

  if (db.version > version) {
    return cb(new VersionError())
  }

  const connection = new FDBDatabase(db)

  if (db.version < version) {
    runVersionchangeTransaction(connection, version, request, (err) => {
      if (err) {
        // DO THIS HERE: ensure that connection is closed by running the steps for closing a database connection before these steps are aborted.
        return cb(err)
      }

      cb(null, connection)
    })
  } else {
    cb(null, connection)
  }
}

// http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-steps-for-running-a-versionchange-transaction
function runVersionchangeTransaction(connection, version, request, cb) {
  connection._runningVersionchangeTransaction = true
  const oldVersion = connection.version
  const openDatabases = connection._rawDatabase.connections.filter((otherDatabase) => {
    return connection !== otherDatabase
  })

  openDatabases.forEach((openDb) => {
    if (!openDb._closed) {
      const event = new FDBVersionChangeEvent('versionchange', {
        oldVersion,
        newVersion: version,
      })
      openDb.dispatchEvent(event)
    }
  })

  const anyOpen = openDatabases.some((openDb) => {
    return !openDb._closed
  })

  if (anyOpen) {
    const event = new FDBVersionChangeEvent('blocked', {
      oldVersion,
      newVersion: version,
    })
    request.dispatchEvent(event)
  }

  function waitForOthersClosed() {
    const hasAnyOpen = openDatabases.some((openDb) => {
      return !openDb._closed
    })

    if (hasAnyOpen) {
      setImmediate(waitForOthersClosed)
      return
    }

    //  Set the version of database to version. This change is considered part of the transaction, and so if the transaction is aborted, this change is reverted.
    connection._rawDatabase.version = version
    connection.version = version

    // Get rid of this setImmediate?
    const transaction = connection.transaction(connection.objectStoreNames, 'versionchange')
    request.result = connection
    request.transaction = transaction

    transaction._rollbackLog.push(() => {
      connection._rawDatabase.version = oldVersion
      connection.version = oldVersion
    })

    const event = new FDBVersionChangeEvent('upgradeneeded', {
      oldVersion,
      newVersion: version,
    })
    request.dispatchEvent(event)

    request.readyState = 'done'

    transaction.addEventListener('error', () => {
      connection._runningVersionchangeTransaction = false
      // throw arguments[0].target.error
      // console.log('error in versionchange transaction - not sure if anything needs to be done here', e.target.error.name)
    })

    transaction.addEventListener('abort', () => {
      connection._runningVersionchangeTransaction = false
      request.transaction = null
      setImmediate(() => {
        cb(new AbortError())
      })
    })

    transaction.addEventListener('complete', () => {
      connection._runningVersionchangeTransaction = false
      request.transaction = null

      // Let other complete event handlers run before continuing
      setImmediate(() => {
        if (connection._closePending) {
          cb(new AbortError())
        } else {
          cb(null)
        }
      })
    })
  }

  waitForOthersClosed()
}
