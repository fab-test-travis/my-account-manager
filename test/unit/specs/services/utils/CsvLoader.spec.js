import * as path from 'path'

import CsvLoader from '@/services/utils/CsvLoader'

describe('CsvLoader', () => {
  const csvLoader = new CsvLoader()

  it('should parse simple CSV string', done => {
    let csvString = `
Foo Bar Thing

Date;Libellé;Débit Euros;Crédit Euros;
14/09/2017;"My City -    07/09 10h41 
Retrait Au Distributeur 
";10,00;

`
    csvLoader.extractTransactions(csvString, (transactions, err) => {
      assert.equal(transactions.length, 1)
      assert.deepEqual(transactions[0], {
        date: '2017-09-14',
        label: 'My City - 07/09 10h41 Retrait Au Distributeur ',
        debit: 1000,
        credit: null
      })
      done()
    })
  })

  it('should handle error when parsing wrong CSV string', done => {
    let csvString = `
Date;Libellé;Débit Euros;Crédit Euros;
14/09/2017;"My City -    07/09 10h41 
Retrait 
`
    csvLoader.extractTransactions(csvString, (transactions, err) => {
      assert.isNotNull(err)
      assert.isNull(transactions)
      done()
    })
  })

  it('should parse bad CSV from card payments', done => {
    // CSV content for card payments misses the semi-colon at the end of each line
    let csvString = `

22/09/2017;"La Bolee                           
.                                  ";44,80 
22/09/2017;"Leroy Merlin                            
.                                  ";;4,60 

`
    // let's sanitize the CSV
    csvString = csvLoader.addMissingSemiColon(csvString)
    // and now check that the result can be parsed
    csvLoader.extractTransactions(csvString, (transactions, err) => {
      assert.equal(transactions.length, 2)
      assert.deepEqual(transactions[0], {
        date: '2017-09-22',
        label: 'La Bolee ',
        debit: 4480,
        credit: null
      })
      assert.deepEqual(transactions[1], {
        date: '2017-09-22',
        label: 'Leroy Merlin ',
        debit: null,
        credit: 460
      })
      done()
    })
  })

  it('should parse file', done => {
    csvLoader.getTransactionsFromFile(pathForFile('sample.csv'), (transactions, err) => {
      assert.equal(transactions.length, 5)
      assert.deepEqual(transactions[0], {
        date: '2017-09-08',
        label: 'My City - 07/09 10h41 Retrait Au Distributeur ',
        debit: 1000,
        credit: null
      })
      assert.deepEqual(transactions[1], {
        date: '2017-09-07',
        label: 'CPAM Virement En Votre Faveur Xpxreference 092849349389 006379389v16 ',
        debit: null,
        credit: 1734
      })
      done()
    })
  })
})

function pathForFile(file) {
  return path.join(process.cwd(), 'test', 'unit', 'specs', 'services', 'utils', 'CsvLoader', file)
}
