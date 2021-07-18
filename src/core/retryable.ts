import { InterruptedError, TransitoryError } from '../errors'
import { ArrayOfErrorTypes } from './ArrayOfErrorTypes'
import { pause } from './pause'

/**
 * By default we recognise the TransitoryError as the only retryable error.
 */
const defaultTransientErrorTypes: ArrayOfErrorTypes = [TransitoryError]

/**
 * By default we retry the func 9 times (in addition to the original call)
 * with an exponential backoff that increases from 100ms to 30s, over the course
 * of just over a minute.
 */
const defaultRetryIntervalsInMilliseconds = [100, 250, 500, 1000, 2000, 4000, 8000, 15000, 30000]

/**
 * Represents the options that can be passed to the retryable function.
 */
export interface RetryableOptions {
  /**
   * An array of error types that can be treated as transient.
   * If not specified, the default is TransitoryError.
   * The test uses instanceof which matches to derived classes too. 
   */
  transientErrorTypes?: ArrayOfErrorTypes

  /**
   * An array of numbers where each element represents the delay
   * in milliseconds before the promise function is retried after a transient failure.
   */
  retryIntervalsInMilliseconds?: number[]

  /**
   * A function that returns true if the operation should be interrupted.
   */
  interruptFunc?: () => boolean
}

/**
 * Returns the result of resolving the given function.  The function will be called at least
 * once, plus an additional attempt each time a transitory error is returned upto the number
 * of elements in the retryIntervalsInMilliseconds array.
 * @param operation A long-running function that returns a promise.
 * @param options The options that control the retries.
 */
export async function retryable<T> (operation: () => Promise<T>, options?: RetryableOptions): Promise<T> {
  let lastError = null
  const retryIntervalsInMilliseconds = options?.retryIntervalsInMilliseconds || defaultRetryIntervalsInMilliseconds
  const transientErrorTypes = options?.transientErrorTypes || defaultTransientErrorTypes

  for (let i = 0; i <= retryIntervalsInMilliseconds.length; i++) {
    if (i > 0) {
      await pause(retryIntervalsInMilliseconds[i - 1])
    }

    try {
      // We must await here and then return the data in a separate line,
      // otherwise any exception will be thrown in the context of the caller and not here.
      const data = await operation()
      return data
    } catch (err) {
      const isTransientError = transientErrorTypes.findIndex(errorType => err instanceof errorType) > -1

      if (isTransientError) {
        lastError = err
      } else {
        throw err
      }

      if (options?.interruptFunc && options.interruptFunc()) {
        throw new InterruptedError()
      }
    }
  }

  throw lastError
}
