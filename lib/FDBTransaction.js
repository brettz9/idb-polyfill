import Event from './Event'
import EventTarget from './EventTarget'
import FDBObjectStore from './FDBObjectStore'
import FDBRequest from './FDBRequest'
import AbortError from './errors/AbortError'
import TransactionInactiveError from './errors/TransactionInactiveError'
import NotFoundError from './errors/NotFoundError'
import InvalidStateError from './errors/InvalidStateError'
import adapter from './adapter'

// http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#transaction
module.exports = class FDBTransaction extends EventTarget {
  constructor(storeNames, mode) {
    super()
    this._scope = storeNames
    this._started = false
    this._active = true
    this._finished = false // Set true after commit or abort
    this._requests = []
    this._rollbackLog = []

    this.mode = mode
    this.db = null
    this.error = null
    this.onabort = null
    this.oncomplete = null
    this.onerror = null
  }

  // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-steps-for-aborting-a-transaction
  _abort(error) {
    this._rollbackLog.reverse().forEach((f) => f())
    let e
    if (error !== null) {
      e = new Error()
      e.name = error
      this.error = e
    }

// Should this directly remove from _requests?
    this._requests.forEach((r) => {
      const request = r.request
      if (request.readyState !== 'done') {
        request.readyState = 'done' // This will cancel execution of this request's operation
        if (request.source) {
          request.result = undefined
          request.error = new AbortError()

          const event = new Event('error', {
            bubbles: true,
            cancelable: true,
          })
          event._eventPath = [this.db, this]
          request.dispatchEvent(event)
        }
      }
    })

    setImmediate(() => {
      const event = new Event('abort', {
        bubbles: true,
        cancelable: false,
      })
      event._eventPath = [this.db]
      this.dispatchEvent(event)
    })

    this._finished = true
  }

  abort() {
    if (this._finished) throw new InvalidStateError()
    this._active = false
    this._abort(null)
  }

  objectStore(name) {
    if (this._scope.indexOf(name) < 0) throw new NotFoundError()
    if (!this._active) throw new InvalidStateError()
    return new FDBObjectStore(this, this.db._rawDatabase.rawObjectStores[name])
  }

  // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-steps-for-asynchronously-executing-a-request
  _execRequestAsync(obj) {
    if (!this._active) throw new TransactionInactiveError()
    const source = obj.source
    const operation = obj.operation
    let request = obj.hasOwnProperty('request') ? obj.request : null

    // Request should only be passed for cursors
    if (!request) {
      if (!source) {
        // Special requests like indexes that just need to run some coe
        request = { readyState: 'pending' }
      } else {
        request = new FDBRequest()
        request.source = source
        request.transaction = source.transaction
      }
    }

    this._requests.push({ request, operation })
    return request
  }

  _start() {
    let event
    this._started = true

    // Remove from request queue - cursor ones will be added back if necessary by cursor.continue and such
    let operation
    let request

    while (this._requests.length > 0) {
      const r = this._requests.shift()

      // This should only be false if transaction was aborted
      if (r.request.readyState !== 'done') {
        request = r.request
        operation = r.operation
        break
      }
    }

    if (request) {
      if (!request.source) {
        // Special requests like indexes that just need to run some code, with error handling already built into operation
        operation()
      } else {
        let defaultAction
        try {
          const result = operation()
          request.readyState = 'done'
          request.result = result
          request.error = undefined

          // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-fire-a-success-event
          this._active = true
          event = new Event('success', {
            bubbles: false,
            cancelable: false,
          })
        } catch (err) {
          request.readyState = 'done'
          request.result = undefined
          request.error = err

          // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-fire-an-error-event
          this._active = true
          event = new Event('error', {
            bubbles: true,
            cancelable: true,
          })

          defaultAction = this._abort.bind(this, err.name)
        }

        try {
          event._eventPath = [this.db, this]
          request.dispatchEvent(event)

          // You're supposed to set this._active to false here, but I'm skipping that.
          // Why? Because scheduling gets tricky when promises are involved. I know that
          // promises and IndexedDB transactions in general are tricky
          // https://lists.w3.org/Archives/Public/public-webapps/2015AprJun/0126.html but
          // for some reason I still tend to do it. So this line is commented out for me,
          // and for any other masochists who do similar things. It doesn't seem to break
          // any tests or functionality, and in fact if I uncomment this line it does make
          // transaction/promise interactions wonky.
          // this._active = false
        } catch (err) {
          this._abort('AbortError')
          throw err
        }

        // Default action of event
        if (!event._canceled) {
          if (defaultAction) {
            defaultAction()
          }
        }
      }

      // On to the next one
      if (this._requests.length > 0) {
        this._start()
      } else {
        // Give it another chance for new handlers to be set before finishing
        setImmediate(this._start.bind(this))
      }
      return
    }

    // Check if transaction complete event needs to be fired
    if (!this._finished) { // Either aborted or committed already
      this._active = false
      this._finished = true

      if (!this.error) {
        adapter.submitTransaction(this, (err) => {
          if (err) {
            this._abort('AbortError')
            throw err
          } else {
            event = new Event()
            event.type = 'complete'
            this.dispatchEvent(event)
          }
        })
      }
    }
  }

  toString() {
    return '[object IDBRequest]'
  }
}
