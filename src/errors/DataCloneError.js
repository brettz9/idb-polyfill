import inherits from 'inherits'
module.exports = DataCloneError

function DataCloneError(message = 'The data being stored could not be cloned by the internal structured cloning algorithm.') {
  this.name = 'DataCloneError'
  this.message = message
  if (Error.captureStackTrace) Error.captureStackTrace(this, DataCloneError)
}
inherits(DataCloneError, Error)
