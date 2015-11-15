import inherits from 'inherits'
module.exports = ReadOnlyError

function ReadOnlyError(message = 'The mutating operation was attempted in a "readonly" transaction.') {
  this.name = 'ReadOnlyError'
  this.message = message
  if (Error.captureStackTrace) Error.captureStackTrace(this, ReadOnlyError)
}
inherits(ReadOnlyError, Error)
