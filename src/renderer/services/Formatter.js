export default class Formatter {
  // Displays amounts (that are stored multiplied by 100) with 2 decimals
  amount(value) {
    return (value / 100).toFixed(2)
  }
}
