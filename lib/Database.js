// http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-database
module.exports = class Database {
  constructor(name, version) {
    this.deletePending = false
    this.transactions = []
    this.rawObjectStores = {}
    this.connections = []

    this.name = name
    this.version = version
  }

  processTransactions() {
    setImmediate(() => {
      const anyRunning = this.transactions.some((transaction) => {
        return transaction._started && !transaction._finished
      })

      if (!anyRunning) {
        const next = this.transactions.find((transaction) => {
          return !transaction._started && !transaction._finished
        })

        if (next) {
          next._start()
          next.addEventListener('complete', this.processTransactions.bind(this))
          next.addEventListener('abort', this.processTransactions.bind(this))
        }
      }
    })
  }
}
