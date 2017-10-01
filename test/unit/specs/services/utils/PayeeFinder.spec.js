import PayeeFinder from '@/services/utils/PayeeFinder'

describe('PayeeFinder', () => {
  const payeeFinder = new PayeeFinder({
    P000400: {
      id: 'P000400',
      regexps: ['Caf De La Haute Savoie', 'CPAM']
    },
    P000006: {
      id: 'P000006',
      regexps: ['Medecins Sans Frontieres']
    },
    P000025: {
      id: 'P000025',
      regexps: ['Area']
    }
  })

  it('should return correct payee', () => {
    assert.equal(
      payeeFinder.findBasedOnLabel('Versement Caf De La Haute Savoie 2107').id,
      'P000400'
    )
    assert.equal(payeeFinder.findBasedOnLabel('Virement\n CPAM').id, 'P000400')
    assert.equal(
      payeeFinder.findBasedOnLabel('Area \n Account 39480098').id,
      'P000025'
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
})
