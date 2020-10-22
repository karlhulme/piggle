/**
 * @callback OnLogCallback
 * @param {String} message A message to be logged.
 * @returns {Promise<void>}
 */

/**
 * Invokes the onLog callback if provided in the options.
 * This function swallows exceptions because if the logging fails
 * there is nothing else we can sensibly do with them.
 * @param {OnLogCallback} onLog A callback function.
 * @param {String} message A message to log.
 */
export async function invokeOnLog (onLog, message) {
  if (onLog) {
    try {
      await onLog(message)
    } catch (err) {
      console.log(`Error raised by handler for onLog event.\n${err.toString()}`)
    }
  }
}
