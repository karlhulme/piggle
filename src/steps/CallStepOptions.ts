/**
 * Represents the options that can be optionally provided
 * to the CallStep.
 */
export interface CallStepOptions {
  /**
   * An array of error types to be treated as temporary.
   */
  transientErrorTypes?: ErrorConstructor[]

  /**
  * An array of intervals, in milliseconds, between calls of the callFunc if transient errors are received.
  */
  retryIntervalsInMilliseconds?: number[]
}
