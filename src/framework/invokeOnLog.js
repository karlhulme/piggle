/**
 * @callback OnLogCallback
 * @param {String} message A message to be logged.
 * @returns {Promise<void>}
 */

/**
 * Invokes the onLog callback if provided in the options.
 * @param {OnLogCallback} onLog A callback function.
 * @param {String} message A message to log.
 */
export async function invokeOnLog (onLog, message) {
  if (onLog) {
    await onLog(message)
  }
}
