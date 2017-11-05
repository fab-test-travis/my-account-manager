export default class PayeeFinder {
  constructor(payeeFinders) {
    this.payeeFinders = payeeFinders
  }

  /**
   * Searches throw the payee finders the first one that matches
   * the given label.
   * Returns null if none found.
   * A payee finder has the following structure:
   * {
   *  expr: 'CPAM',
   *  payee: 'P123',
   *  cat: 'C267'
   * }
   * @param {*} label
   */
  findBasedOnLabel(label) {
    for (let finder of this.payeeFinders) {
      if (label.indexOf(finder.expr) >= 0) {
        return finder
      }
    }

    return null
  }
}
