import inherits from 'inherits'
module.exports = InvalidAccessError

function InvalidAccessError(message = 'An invalid operation was performed on an object. For example transaction creation attempt was made, but an empty scope was provided.') {
  this.name = 'InvalidAccessError'
  this.message = message
  if (Error.captureStackTrace) Error.captureStackTrace(this, InvalidAccessError)
}
inherits(InvalidAccessError, Error)
