import inherits from 'inherits'
module.exports = VersionError

function VersionError(message = 'An attempt was made to open a database using a lower version than the existing version.') {
  this.name = 'VersionError'
  this.message = message
  if (Error.captureStackTrace) Error.captureStackTrace(this, VersionError)
}
inherits(VersionError, Error)
