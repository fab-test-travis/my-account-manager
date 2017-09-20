import * as path from 'path'

import CsvLoader from '@/services/CsvLoader'

describe('CsvLoader', () => {
  const csvLoader = new CsvLoader()

  it('should parse simple CSV string', done => {
    let csvString = `
Foo Bar Thing

Date;Libellé;Débit Euros;Crédit Euros;
08/09/2017;"My City -    07/09 10h41 
Retrait Au Distributeur 
";10,00;

`
    csvLoader.extractTransactions(csvString, (transactions, err) => {
      assert.equal(transactions.length, 1)
      assert.deepEqual(transactions[0], {
        date: '08/09/2017',
        label: 'My City -    07/09 10h41 \nRetrait Au Distributeur \n',
        debit: '10,00',
        credit: ''
      })
      done()
    })
  })

  it('should handle error when parsing wrong CSV string', done => {
    let csvString = `
Date;Libellé;Débit Euros;Crédit Euros;
My City -    07/09 10h41 
Retrait Au Distributeur 
";10,00;
`
    csvLoader.extractTransactions(csvString, (transactions, err) => {
      assert.isNotNull(err)
      assert.isNull(transactions)
      done()
    })
  })

  it('should parse file', done => {
    csvLoader.getTransactionsFromFile(
      pathForFile('sample.csv'),
      (transactions, err) => {
        assert.equal(transactions.length, 5)
        assert.deepEqual(transactions[0], {
          date: '08/09/2017',
          label: 'My City -    07/09 10h41 \nRetrait Au Distributeur \n',
          debit: '10,00',
          credit: ''
        })
        done()
      }
    )
  })
})

function pathForFile(file) {
  return path.join(
    process.cwd(),
    'test',
    'unit',
    'specs',
    'services',
    'CsvLoader',
    file
  )
}
