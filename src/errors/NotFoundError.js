import inherits from 'inherits'
module.exports = NotFoundError

function NotFoundError(message = 'The operation failed because the requested database object could not be found. For example, an object store did not exist but was being opened.') {
  this.name = 'NotFoundError'
  this.message = message
  if (Error.captureStackTrace) Error.captureStackTrace(this, NotFoundError)
}
inherits(NotFoundError, Error)
