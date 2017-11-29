import PayeeFinder from '@/services/PayeeFinder'

const payeeFinder = new PayeeFinder({
  finders: [
    {
      expr: 'Caf De La Haute Savoie',
      payee: 'P1',
      cat: 'C10'
    },
    {
      expr: 'CA',
      payee: 'P2',
      cat: 'C20'
    },
    {
      expr: 'Medecins .* Frontieres',
      payee: 'P3',
      cat: 'C30'
    }
  ],
  payeeFinders() {
    return this.finders
  }
})

describe('PayeeFinder', () => {
  it('should return correct payee', () => {
    assert.equal(payeeFinder.findBasedOnLabel('Versement Caf De La Haute Savoie 2107').payee, 'P1')
    assert.equal(payeeFinder.findBasedOnLabel('Virement CA').payee, 'P2')
  })

  it('should return correct payee when using regexp', () => {
    assert.equal(payeeFinder.findBasedOnLabel('Medecins Sans Frontieres Account 39480098').payee, 'P3')
  })

  it('should return no payee', () => {
    assert.isNull(payeeFinder.findBasedOnLabel('Versement MSF'))
    assert.isNull(payeeFinder.findBasedOnLabel('Versement Médecins Sans Frontières'))
  })

  it('should return correct category', () => {
    assert.equal(payeeFinder.findBasedOnLabel('Versement Caf De La Haute Savoie 2107').cat, 'C10')
    assert.equal(payeeFinder.findBasedOnLabel('Virement CA').cat, 'C20')
  })

  it('should add payee finder', () => {
    payeeFinder.addFinder('P4', 'foo', 'C40')
    assert.equal(payeeFinder.finders().length, 4)
    assert.deepEqual(payeeFinder.finders()[3], { expr: 'foo', payee: 'P4', cat: 'C40' })
  })
})
