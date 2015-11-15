module.exports = typeof localStorage === 'undefined' ? require('./memory') : require('./storage')
