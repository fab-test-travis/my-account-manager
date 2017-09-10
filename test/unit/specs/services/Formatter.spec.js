import Formatter from '@/services/Formatter'

describe('Formatter', () => {
  const f = new Formatter()

  it('should return year of date', () => {
    let date = '2017-08-14'
    expect(f.year(date)).to.equal('2017')
  })
})
