class TransitoryError extends Error {
  constructor () {
    super('Transitory error.')
  }
}

module.exports = {
  TransitoryError
}
