import * as _ from 'lodash'

export default class Repo {
  constructor(storage, payeeFinder) {
    this.storage = storage
    this.payeeFinder = payeeFinder
    this.initCounters()
  }

  initCounters() {
    this.counters = {}
    this.counters.transaction = this.findNextTransactionCounter()
  }

  findNextTransactionCounter() {
    let lastCounter = _.maxBy(this.transactions(), 'id').id
    // we get an ID like "T000000000000005922"
    // let's remove the T, multiply by 1 to turn it into a number, and add 1 to get the next counter
    return lastCounter.substring(1) * 1 + 1
  }

  nextTransactionID() {
    let nextCounter = this.counters.transaction
    // increase the counter for next ID
    this.counters.transaction++
    // and return the new counter, with the appropriate format 'T3782034'
    return 'T' + nextCounter
  }

  isLoaded() {
    return this.storage.repo != null
  }

  institutions() {
    return _.values(this.storage.repo.institutions)
  }

  payees() {
    return _.values(this.storage.repo.payees)
  }

  payee(id) {
    return this.storage.repo.payees[id]
  }

  bankAccounts(showClosed = false) {
    let accounts = _.values(this.storage.repo.bankAccounts)
    return _.chain(accounts)
      .sortBy(['name'])
      .filter(a => (showClosed ? true : !a.closed))
      .value()
  }

  bankAccount(id) {
    return this.storage.repo.bankAccounts[id]
  }

  categories() {
    return _.values(this.storage.repo.categories)
  }

  category(id) {
    return this.storage.repo.categories[id]
  }

  transactions() {
    return _.values(this.storage.repo.transactions)
  }

  deleteTransaction(transaction) {
    delete this.storage.repo.transactions[transaction.id]
  }

  addStagedTransaction(date, amount, toId, fromId, payeeId, label) {
    let transactionId = this.nextTransactionID()
    this.storage.repo.transactions[transactionId] = {
      id: transactionId,
      date: date,
      amount: amount,
      toId: toId,
      fromId: fromId,
      payeeId: payeeId,
      desc: '',
      stagedDesc: label
    }
  }

  /**
   * Synchronises transactions retrieved from a CSV file. (see CsvLoader)
   * @param {*} accountId the account to add transactions to
   * @param {*} basicTransactions the CSV-format transactions
   */
  synchronizeTransactions(accountId, basicTransactions) {
    basicTransactions.forEach(t => {
      let amount = t.credit == null ? -t.debit : t.credit
      let payee = ''
      let category = ''
      let finder = this.payeeFinder.findBasedOnLabel(t.label)
      if (finder != null) {
        payee = finder.payee
        category = finder.cat
      }
      this.addStagedTransaction(t.date, amount, accountId, category, payee, t.label)
    })
  }

  replaceCardPayments(accountId, transactionToReplace, basicTransactions, cb) {
    let transactionsAmount = _.chain(basicTransactions)
      .map(t => t.credit == null ? -t.debit : t.credit)
      .reduce((a, b) => a + b, 0)
      .value()
    if (transactionsAmount === transactionToReplace.amount) {
      // Perfect, the amounts match: we can replace the given transaction to replace by all the given transactions
      this.synchronizeTransactions(accountId, basicTransactions)
      this.deleteTransaction(transactionToReplace)
      cb()
    } else {
      // we can't replace, let's return an error
      cb(
        new Error(
          `The sum of the transactions (${transactionsAmount}) does not match the sum of card payments (${transactionToReplace.amount}).`
        )
      )
    }
  }

  transactionsForAccount(accountId) {
    return _.chain(this.transactions())
      .filter(t => accountId === t.fromId || accountId === t.toId)
      .value()
  }

  getAccountBalance(accountId) {
    return _.chain(this.transactions())
      .filter(t => accountId === t.fromId || accountId === t.toId)
      .map(t => (accountId === t.toId ? t.amount : -t.amount))
      .reduce((a, b) => a + b, 0)
      .value()
  }
}
