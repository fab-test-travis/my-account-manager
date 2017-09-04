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

  bankAccounts() {
    return _.values(this.storage.repo.bankAccounts)
  }

  categories() {
    return _.values(this.storage.repo.categories)
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
