import PayeeFinder from '@/services/PayeeFinder'

const payeeFinder = new PayeeFinder({
  payeeFinders() {
    return [
      {
        expr: 'Caf De La Haute Savoie',
        payee: 'P1',
        cat: {
          credit: 'C10',
          debit: ''
        }
      },
      {
        expr: 'CA',
        payee: 'P2',
        cat: {
          credit: '',
          debit: 'C20'
        }
      },
      {
        expr: 'Medecins Sans Frontieres',
        payee: 'P3',
        cat: {
          credit: '',
          debit: 'C30'
        }
      }
    ]
  }
})

describe('PayeeFinder', () => {
  it('should return correct payee', () => {
    assert.equal(
      payeeFinder.findBasedOnLabel('Versement Caf De La Haute Savoie 2107')
        .payee,
      'P1'
    )
    assert.equal(payeeFinder.findBasedOnLabel('Virement\n CA').payee, 'P2')
    assert.equal(
      payeeFinder.findBasedOnLabel(
        'Medecins Sans Frontieres\n Account 39480098'
      ).payee,
      'P3'
    )
  })

  it('should return no payee', () => {
    assert.isNull(payeeFinder.findBasedOnLabel('Versement MSF'))
    assert.isNull(
      payeeFinder.findBasedOnLabel('Versement Médecins Sans Frontières')
    )
    assert.isNull(
      payeeFinder.findBasedOnLabel('Versement Medecins Sans\n Frontieres')
    )
  })

  it('should return correct category', () => {
    assert.equal(
      payeeFinder.findBasedOnLabel('Versement Caf De La Haute Savoie 2107').cat
        .credit,
      'C10'
    )
    assert.equal(payeeFinder.findBasedOnLabel('Virement\n CA').cat.debit, 'C20')
  })
})
