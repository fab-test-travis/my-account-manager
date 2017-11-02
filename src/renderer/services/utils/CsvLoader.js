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
        date: '2017-09-14',
        label: 'Foo',
        debit: 1000,
        credit: null
      }
   * ('credit' and 'debit' are parsed from floats and turned to Cents)
   * @param {*} csvContent
   * @param {*} cb(transactions, err)
   */
  extractTransactions(csvContent, cb) {
    let contentToParse = this.removeUselessChars(csvContent)
    let transactions = []

    Converter({
      headers: ['date', 'label', 'debit', 'credit'],
      noheader: true,
      delimiter: ';',
      includeColumns: [0, 1, 2, 3],
      colParser: {
        date: this.revertDate,
        label: 'string',
        debit: this.turnToCents,
        credit: this.turnToCents
      },
      checkType: true
    })
      .fromString(contentToParse)
      .on('json', jsonObj => {
        transactions.push(jsonObj)
      })
      .on('done', err => {
        if (err) {
          cb(null, err)
        } else {
          cb(transactions, null)
        }
      })
  }

  revertDate(item, head, resultRow, row, colIdx) {
    return item.substr(6, 4) + '-' + item.substr(3, 2) + '-' + item.substr(0, 2)
  }

  turnToCents(item, head, resultRow, row, colIdx) {
    return item === '' ? null : parseFloat(item.replace(',', '.')) * 100
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
