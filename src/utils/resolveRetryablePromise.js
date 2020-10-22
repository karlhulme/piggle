import { TransitoryError } from '../errors/index.js'
import { pause } from './pause.js'

/**
 * Returns the result of resolving the given promise function.  The function will be called at least
 * once, plus an additional time for each element in the retryIntervals array.
 * @param {function():Promise<void>} promiseFunc A function that returns a promise.
 * @param {type[]} transientErrorTypes An array of error types that can be treated as transient.
 * @param {number[]} retryIntervals An array of numbers where each element represents the delay
 * in milliseconds before the promise function is retried after a transient failure.
 * @returns {Promise<any>}
 */
export async function resolveRetryablePromise (promiseFunc, transientErrorTypes, retryIntervals) {
  const resolvedRetryIntervals = retryIntervals || [100, 250, 500, 1000, 2000, 4000, 8000, 15000, 30000]
  const allTransientErrorTypes = [TransitoryError].concat(transientErrorTypes || [])

  let lastError = null

  for (let i = 0; i <= resolvedRetryIntervals.length; i++) {
    if (i > 0) {
      await pause(resolvedRetryIntervals[i - 1])
    }

    try {
      // we must await here and then return the data in a separate line,
      //  otherwise any exception will be thrown in the context of the caller and not here.
      const data = await promiseFunc()
      return data
    } catch (err) {
      const isTransientError = allTransientErrorTypes.findIndex(errorType => err instanceof errorType) > -1

      if (isTransientError) {
        lastError = err
      } else {
        throw err
      }
    }
  }

  throw lastError
}
