/**
 * Returns a promise that resolves after the given number of milliseconds have passed.
 * @param {Number} milliseconds The number of milliseconds to pause.
 * @returns {Promise<void>}
 */
export async function pause (milliseconds) {
  return new Promise(resolve => {
    setTimeout(() => resolve(), milliseconds)
  })
}
