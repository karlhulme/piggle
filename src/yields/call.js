/**
 * @callback PromiseFunction
 * @returns {Promise<any>}
 */

/**
 * @typedef CallStepConfig
 * @property {Number[]} [retryIntervals] An array of retry intervals where
 * each element represents a retry and the value is the number of
 * milliseconds before it begins.
 * @property {Type[]} [transientErrorTypes] An array of error types that
 * the library should treat as transient and thus can be automatically retried.
 */

/**
 * @typedef CallStep
 * @property {String} type The value 'call'.
 * @property {String} name A unique name within an operation.
 * @property {PromiseFunction} promiseFunc A parameterless function that returns a promise.
 * @property {CallStepConfig} [config] Configuration options for a call step.
 */

/**
 * A constant that represents a call step.
 */
export const CALL_STEP = 'CALL_STEP'

/**
 * Creates a call step object that can be yielded during an operation.
 * This is used to pause an operation while a promise is running and
 * ensure that if the promise resolves successfully the response data
 * is persisted.
 * @param {String} name The name of a call step.
 * @param {PromiseFunction} promiseFunc A parameterless function that returns a promise.
 * @param {CallStepConfig} [config] Configuration options for a call step.
 * @returns {CallStep}
 */
export function call (name, promiseFunc, config) {
  return {
    type: CALL_STEP,
    name,
    promiseFunc,
    config
  }
}
