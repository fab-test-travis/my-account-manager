import * as _ from 'lodash'

export default class Repo {
  constructor(storage) {
    this.storage = storage
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
    return _.chain(accounts).filter(a => (showClosed ? true : !a.closed)).value()
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
