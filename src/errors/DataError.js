import inherits from 'inherits'
module.exports = DataError

function DataError(message = 'Data provided to an operation does not meet requirements.') {
  this.name = 'DataError'
  this.message = message
  if (Error.captureStackTrace) Error.captureStackTrace(this, DataError)
}
inherits(DataError, Error)
