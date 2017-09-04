export default class Formatter {
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
}
