export default class PayeeFinder {
  constructor(payees) {
    this.payees = payees
  }

  findBasedOnLabel(label) {
    for (let payee in this.payees) {
      for (let regexp of this.payees[payee].regexps) {
        if (label.indexOf(regexp) >= 0) {
          return this.payees[payee]
        }
      }
    }
    return null
  }
}
