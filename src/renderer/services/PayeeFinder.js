export default class PayeeFinder {
  constructor(storage) {
    this.storage = storage
  }

  /**
   * Returns the list of finders to look for a payee.
   * A payee finder has the following structure:
   * {
   *  expr: 'CPAM',
   *  payee: 'P123',
   *  cat: 'C267'
   * }
   * , where "expr" is a regular expression.
   */
  finders() {
    return this.storage.payeeFinders()
  }

  /**
   * Adds a new finder that has the following structure:
   * {
   *  expr: 'CPAM',
   *  payee: 'P123',
   *  cat: 'C267'
   * }
   * @param {*} payeeId
   * @param {*} expression
   * @param {*} categoryId
   */
  addFinder(payeeId, expression, categoryId) {
    this.storage.payeeFinders().push({
      payee: payeeId,
      expr: expression.trim(),
      cat: categoryId
    })
  }

  /**
   * Searches throw the payee finders the first one that matches
   * the given label.
   * Returns null if none found.
   * @param {*} label
   */
  findBasedOnLabel(label) {
    for (let finder of this.finders()) {
      if (label.search(finder.expr) >= 0) {
        return finder
      }
    }

    return null
  }
}
