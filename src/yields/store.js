/**
 * @typedef StoreStep
 * @property {String} type The value 'store'.
 * @property {String} message A message.
 */

/**
 * A constant that represents a store step.
 */
export const STORE_STEP = 'STORE_STEP'

/**
 * Creates a store step object that can be yielded from an operation.
 * @param {String} name The name of a store step.
 * @param {Object} data A data object.
 */
export function store (name, data) {
  return {
    type: STORE_STEP,
    name,
    data
  }
}
