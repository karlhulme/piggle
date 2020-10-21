import { TransitoryError } from '../errors/index.js'
import { pause } from './pause'

/**
 * @typedef CallResult
 * @property {Boolean} complete True if the promise was successfully resolved.
 * @property {String} [errorMessage] The error message that was returned if the promise was rejected.
 * @property {any} [data] The data that was returned if the promise resolved.
 */

/**
 * Creates an object that encapsulates the result of
 * executing a call step.
 * @param {String} [errorMessage] An error message.
 * @param {Object} [data] A data object.
 * @returns {CallResult}
 */
function createCallResult (errorMessage, data) {
  return {
    complete: !errorMessage,
    errorMessage,
    data: data
  }
}

/**
 * Executes the call step.
 * @param {import('../yields/call.js').CallStep} step A call step.
 * @returns {CallResult}
 */
export async function executeCall (step) {
  const stepConfig = step.config || {}
  const retryIntervals = stepConfig.retryIntervals || [100, 250, 500, 1000, 2000, 4000, 8000, 15000, 30000]
  const transientErrorTypes = [TransitoryError].concat(step.transientErrorTypes || [])

  let lastErrorMsg = null

  for (let i = 0; i <= retryIntervals.length; i++) {
    if (i > 0) {
      await pause(retryIntervals[i - 1])
    }

    try {
      const data = await step.promiseFunc()
      return createCallResult(null, data)
    } catch (err) {
      const isTransientError = transientErrorTypes.findIndex(errorType => err instanceof errorType) > -1

      if (!isTransientError) {
        return createCallResult(err.toString(), null)
      } else {
        lastErrorMsg = err.toString()
      }
    }
  }

  return createCallResult(`Transitory errors received on initial (1) and all retry (${retryIntervals.length}) attempts.\n${lastErrorMsg}`)
}
