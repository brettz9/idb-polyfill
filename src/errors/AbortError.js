import inherits from 'inherits'
module.exports = AbortError

function AbortError(message = 'A request was aborted, for example through a call to IDBTransaction.abort.') {
  this.name = 'AbortError'
  this.message = message
  if (Error.captureStackTrace) Error.captureStackTrace(this, AbortError)
}
inherits(AbortError, Error)
