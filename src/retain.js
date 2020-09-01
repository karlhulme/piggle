function retain (stepName, promise, handler) {
  return {
    stepName,
    promise,
    handler
  }
}

module.exports = {
  retain
}
