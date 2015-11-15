import inherits from 'inherits'
module.exports = InvalidStateError

function InvalidStateError(message = 'An operation was called on an object on which it is not allowed or at a time when it is not allowed. Also occurs if a request is made on a source object that has been deleted or removed. Use TransactionInactiveError or ReadOnlyError when possible, as they are more specific variations of InvalidStateError.') {
  this.name = 'InvalidStateError'
  this.message = message
  if (Error.captureStackTrace) Error.captureStackTrace(this, InvalidStateError)
}
inherits(InvalidStateError, Error)
