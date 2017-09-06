export default class Formatter {
  constructor(repo) {
    this.repo = repo
  }

  // Displays amounts (that are stored multiplied by 100) with 2 decimals
  amount(value) {
    return (value / 100).toFixed(2)
  }

  // Gives the color for the amount (red for debit, green for credit)
  colorForAmount(amount) {
    return amount < 0 ? 'red--text' : 'green--text'
  }

  // Returns the path to the logo of the institution which ID is passed
  institutionIcon(id) {
    return 'static/institutions/' + id + '.png'
  }

  // Returns the name of the payee based on its ID
  payeeName(id) {
    let payee = this.repo.payee(id)
    return payee == null ? '' : payee.name
  }

  // Returns the name of the category based on its ID
  categoryName(id) {
    let category = this.repo.category(id)
    return category == null ? '' : category.name
  }
}
