import * as fs from 'fs'
import Converter from 'csvtojson'

export default class CsvLoader {
  /**
   * Parses the given file with the same output as
   * #extractTransactions
   */
  getTransactionsFromFile(csvFilePath, cb) {
    let content = fs.readFileSync(csvFilePath, 'latin1')
    return this.extractTransactions(content, cb)
  }

  /**
   * Parses a CSV content downloaded from the Bank app into a list of transactions
   * with the format:
   * {
        date: '08/09/2017',
        label: 'Foo',
        debit: '10,00',
        credit: ''
      }
   * @param {*} csvContent
   * @param {*} cb(transactions, err)
   */
  extractTransactions(csvContent, cb) {
    let contentToParse = this.removeUselessChars(csvContent)
    let transactions = []

    Converter({
      headers: ['date', 'label', 'debit', 'credit'],
      noheader: true,
      delimiter: ';'
    })
      .fromString(contentToParse)
      .on('json', jsonObj => {
        transactions.push(jsonObj)
      })
      .on('done', err => {
        if (err) {
          cb(null, err)
        }
        cb(transactions, null)
      })
  }

  removeUselessChars(csvContent) {
    return csvContent
      .substr(
        csvContent.lastIndexOf('Euros;') + 'Euros;'.length,
        csvContent.length
      )
      .trim()
  }
}
