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
   */
  finders() {
    return this.storage.payeeFinderConf()
  }

  /**
   * Searches throw the payee finders the first one that matches
   * the given label.
   * Returns null if none found.
   * @param {*} label
   */
  findBasedOnLabel(label) {
    for (let finder of this.finders()) {
      if (label.indexOf(finder.expr) >= 0) {
        return finder
      }
    }

    return null
  }
}
