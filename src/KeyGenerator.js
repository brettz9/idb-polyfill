import ConstraintError from './errors/ConstraintError'

module.exports = class KeyGenerator {
  constructor() {
    // This is kind of wrong. Should start at 1 and increment only after record is saved
    this.num = 0
  }

  next() {
    if (this.num >= 9007199254740992) throw new ConstraintError()
    this.num += 1
    return this.num
  }

  setIfLarger(num) {
    if (num > 9007199254740992) throw new ConstraintError()
    if (num > this.num) this.num = Math.floor(num)
  }
}
