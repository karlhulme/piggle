/**
 * @typedef LogStep
 * @property {String} type The value 'log'.
 * @property {String} message A message.
 */

/**
 * A constant that represents a log step.
 */
export const LOG_STEP = 'LOG_STEP'

/**
 * Creates a log step object that can be yielded from an operation.
 * @param {String} message A message.
 * @returns {LogStep}
 */
export function log (message) {
  return {
    type: LOG_STEP,
    message
  }
}
