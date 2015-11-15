import inherits from 'inherits'
module.exports = TransactionInactiveError

function TransactionInactiveError(message = 'A request was placed against a transaction which is currently not active, or which is finished.') {
  this.name = 'TransactionInactiveError'
  this.message = message
  if (Error.captureStackTrace) Error.captureStackTrace(this, TransactionInactiveError)
}
inherits(TransactionInactiveError, Error)
