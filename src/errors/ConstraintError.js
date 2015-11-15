import inherits from 'inherits'
module.exports = ConstraintError

function ConstraintError(message = ' A mutation operation in the transaction failed because a constraint was not satisfied. For example, an object such as an object store or index already exists and a request attempted to create a new one.') {
  this.name = 'ConstraintError'
  this.message = message
  if (Error.captureStackTrace) Error.captureStackTrace(this, ConstraintError)
}
inherits(ConstraintError, Error)
