const isNode = require('is-node')
module.exports = isNode ? require('./memory') : require('./storage')
