export default class Formatter {
  constructor(repo) {
    this.repo = repo
  }

  year(date) {
    return date.substring(0, 4)
  }

  dateInYear(date) {
    return date.substring(8, 10) + ' ' + this.month(date)
  }

  // Displays amounts (that are stored multiplied by 100) with 2 decimals
  amount(value) {
    return (value / 100).toFixed(2)
  }

  // Displays amount of the given transaction when displayed in the given account
  transactionAmount(transaction, accountId) {
    return this.amount(accountId === transaction.toId ? transaction.amount : -transaction.amount)
  }

  // Gives the color for the amount (red for debit, green for credit)
  colorForAmount(amount) {
    return amount < 0 ? 'red--text' : 'green--text'
  }

  // Tells whether the transaction is a transfer or not
  // => Not really a format method... should probably be refactored and put somewhere else
  isTransfer(transaction) {
    return this.repo.bankAccount(transaction.toId) != null && this.repo.bankAccount(transaction.fromId) != null
  }

  // Tells whether the transaction is a list of monthly card payments
  // => Same as previous one: not really a format method... should probably be refactored and put somewhere else
  isCardPayments(transaction) {
    return transaction.stagedDesc && transaction.stagedDesc.indexOf('Depenses Carte') >= 0
  }

  // Label for a transaction that is a transfer
  transferLabel(transaction, accountId) {
    if (this.isTransfer(transaction)) {
      return (
        'Virement ' +
        (accountId === transaction.fromId
          ? 'depuis ' + this.categoryName(transaction.toId)
          : 'vers ' + this.categoryName(transaction.fromId))
      )
    } else {
      return 'PROBLEM: this transaction is not a transfer.'
    }
  }

  // Returns the path to the logo of the institution which ID is passed
  institutionIcon(id) {
    return 'static/institutions/' + id + '.png'
  }

  // Returns the name of the payee based on its ID
  payeeName(id) {
    let payee = this.repo.payee(id)
    return payee == null ? '-- payee? --' : payee.name
  }

  // Returns the name of the category based on its ID
  categoryName(id) {
    let category = this.repo.category(id)
    if (category == null) {
      category = this.repo.bankAccount(id)
    }
    return category == null ? '-- category? --' : category.name
  }

  month(date) {
    let m = date.substring(5, 7)
    switch (m) {
      case '01':
        return 'Janvier'
      case '02':
        return 'Février'
      case '03':
        return 'Mars'
      case '04':
        return 'Avril'
      case '05':
        return 'Mai'
      case '06':
        return 'Juin'
      case '07':
        return 'Juillet'
      case '08':
        return 'Août'
      case '09':
        return 'Septembre'
      case '10':
        return 'Octobre'
      case '11':
        return 'Novembre'
      case '12':
        return 'Décembre'
    }
  }
}
