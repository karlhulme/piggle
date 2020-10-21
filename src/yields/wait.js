/**
 * @typedef WaitStep
 * @property {String} type The value 'wait'.
 * @property {Number} milliseconds A number of milliseconds to wait.
 */

/**
 * A constant that represents a store step.
 */
export const WAIT_STEP = 'WAIT_STEP'

/**
 * Creates a wait step object that can be yielded from an operation.
 * @param {Number} milliseconds A number of milliseconds to wait.
 * @returns {WaitStep}
 */
export function wait (milliseconds) {
  return {
    type: WAIT_STEP,
    milliseconds
  }
}
