import { CallFunc } from '../funcs'
import { pause } from './pause'

/**
 * Represents an array of constructors that create types extending
 * the Error class.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ArrayOfErrorTypes = Array<new (...args: any[]) => Error>

/**
 * Returns the result of resolving the callFunc function.  The function will be called at least
 * once, plus an additional attempt each time a transitory error is returned upto the number
 * of elements in the retryIntervalsInMilliseconds array.
 * @param promiseFunc A function that returns a promise.
 * @param transientErrorTypes An array of error types that can be treated as transient.
 * @param retryIntervalsInMilliseconds An array of numbers where each element represents the delay
 * in milliseconds before the promise function is retried after a transient failure.
 */
export async function resolveRetryablePromise (callFunc: CallFunc, transientErrorTypes: ArrayOfErrorTypes, retryIntervalsInMilliseconds: number[]): Promise<unknown> {
  let lastError = null

  for (let i = 0; i <= retryIntervalsInMilliseconds.length; i++) {
    if (i > 0) {
      await pause(retryIntervalsInMilliseconds[i - 1])
    }

    try {
      // we must await here and then return the data in a separate line,
      //  otherwise any exception will be thrown in the context of the caller and not here.
      const data = await callFunc()
      return data
    } catch (err) {
      const isTransientError = transientErrorTypes.findIndex(errorType => err instanceof errorType) > -1

      if (isTransientError) {
        lastError = err
      } else {
        throw err
      }
    }
  }

  throw lastError
}
