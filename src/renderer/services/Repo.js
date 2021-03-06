import * as _ from 'lodash'

export default class Repo {
  constructor(storage, payeeFinder) {
    this.storage = storage
    this.payeeFinder = payeeFinder
    this.init()
  }

  /**
   * Initialize the repo:
   * - counters to create new entities
   */
  init() {
    if (this.isLoaded()) {
      this.counters = {}
      this.counters.transaction = this.findNextCounter(this.transactions())
      this.counters.payee = this.findNextCounter(this.payees())
      // categories and bank accounts share the same pattern for ID (this comes from KMyMoney)
      this.counters.category = this.findNextCounter(this.categories().concat(this.bankAccounts(true)))
    }
  }

  findNextCounter(list) {
    let maxId = _.chain(list)
      // we map the ID - which is like "T5922" - to an integer
      .map(t => t.id.substring(1) * 1)
      .max()
      .value()
    return maxId + 1
  }

  nextTransactionID() {
    let nextCounter = this.counters.transaction
    // increase the counter for next ID
    this.counters.transaction++
    // and return the new counter, with the appropriate format 'T3782034'
    return 'T' + nextCounter
  }

  nextPayeeID() {
    let nextCounter = this.counters.payee
    // increase the counter for next ID
    this.counters.payee++
    // and return the new counter, with the appropriate format 'P3782034'
    return 'P' + nextCounter
  }

  nextCategoryID() {
    let nextCounter = this.counters.category
    // increase the counter for next ID
    this.counters.category++
    // and return the new counter, with the appropriate format 'P3782034'
    return 'A' + nextCounter
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

  bankAccounts(listClosed = false) {
    let accounts = _.values(this.storage.repo.bankAccounts)
    return _.chain(accounts)
      .sortBy(['name'])
      .filter(a => (listClosed ? true : !a.closed))
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

  transactionsForAccount(accountId) {
    return _.chain(this.transactions())
      .filter(t => accountId === t.fromId || accountId === t.toId)
      .value()
  }

  transactionsForCategory(categoryId) {
    return _.chain(this.transactions())
      .filter(t => categoryId === t.fromId)
      .value()
  }

  getAccountBalance(accountId) {
    return _.chain(this.transactions())
      .filter(t => accountId === t.fromId || accountId === t.toId)
      .map(t => (accountId === t.toId ? t.amount : -t.amount))
      .reduce((a, b) => a + b, 0)
      .value()
  }

  // Tells whether the transaction is a transfer or not
  isTransfer(transaction) {
    return this.bankAccount(transaction.toId) != null && this.bankAccount(transaction.fromId) != null
  }

  changeFavorite(accountId) {
    let isFavorite = this.bankAccount(accountId).favorite
    this.bankAccount(accountId).favorite = !isFavorite
    return !isFavorite
  }

  addPayee(payeeName) {
    let payeeId = this.nextPayeeID()
    let payee = {
      id: payeeId,
      name: payeeName
    }
    this.storage.repo.payees[payeeId] = payee
    return payee
  }

  addCategory(categoryName, parentCategoryId) {
    // let's create the new category
    let catId = this.nextCategoryID()
    let category = {
      id: catId,
      name: categoryName,
      parentId: parentCategoryId
    }
    this.storage.repo.categories[catId] = category
    // we also need to reference this category in its parent too
    let parentCategory = this.storage.repo.categories[parentCategoryId]
    if (!parentCategory.subAccountIds) {
      parentCategory.subAccountIds = []
    }
    parentCategory.subAccountIds.push(catId)
    // and finally return the category
    return category
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
   * Returns true if some staged transactions have not been categorized yet.
   */
  hasNotClassifiedStagedTransaction() {
    for (let t of this.transactions()) {
      if (t.stagedDesc && t.fromId === '') {
        return true
      }
    }
    return false
  }

  /**
   * Confirms that all transactions can be saved
   */
  unstageAllTransactions() {
    this.transactions().forEach(t => {
      if (t.stagedDesc) {
        delete t.stagedDesc
      }
    })
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

  /**
   * Replaces a card payment entry by transactions retrieved from a CSV file
   * @param {*} accountId the account on which the transaction applies
   * @param {*} transactionToReplace the card payment transaction to replace
   * @param {*} basicTransactions Transactions that will replace the card payment transaction
   * @param {*} cb the callback if there's an error
   */
  replaceCardPayments(accountId, transactionToReplace, basicTransactions, cb) {
    let transactionsAmount = _.chain(basicTransactions)
      .map(t => (t.credit == null ? -t.debit : t.credit))
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
          `The sum of the transactions (${transactionsAmount}) does not match the sum of card payments (${
            transactionToReplace.amount
          }).`
        )
      )
    }
  }
}
