import * as _ from 'lodash'

export default class Repo {
  constructor(storage) {
    this.storage = storage
    this.initCounters()
  }

  initCounters() {
    this.counters = {}
    this.counters.transaction = this.findNextTransactionCounter()
  }

  findNextTransactionCounter() {
    let count = _.maxBy(this.transactions(), 'id').id
    // we get an ID like "T000000000000005922"
    // let's remove the T and multiply by 1 to turn it into a number
    return count.substring(1) * 1
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

  addTransaction(date, amount, toId, fromId, payeeId, desc) {
    let transactionId = this.counters.transaction++
    this.storage.repo.transactions[transactionId] = {
      id: transactionId,
      date: date,
      amount: amount,
      toId: toId,
      fromId: fromId,
      payeeId: payeeId,
      desc: desc
    }
  }

  synchronizeTransactions(accountId, basicTransactions) {
    basicTransactions.forEach(t => {
      let amount = t.credit == null ? -t.debit : t.credit
      this.addTransaction(t.date, amount, accountId, '', '', t.label)
    })
  }

  transactionsForAccount(accountId) {
    let tList = []
    // couldn't manage to use lodash here... :-(
    this.transactions().forEach(t => {
      if (accountId === t.fromId || accountId === t.toId) {
        tList.push(t)
      }
    })
    return tList
  }

  getAccountBalance(accountId) {
    return _.chain(this.transactions())
      .filter(t => accountId === t.fromId || accountId === t.toId)
      .map(t => (accountId === t.toId ? t.amount : -t.amount))
      .reduce((a, b) => a + b, 0)
      .value()
  }
}
