import { CallFunc, LogFunc, State, Step } from '../interfaces'
import { resolveRetryablePromise } from '../utils'
import { CallStepOptions } from './CallStepOptions'
import { TransitoryError } from '../errors'

/**
 * A step that invokes a function, repeatedly if transitory
 * errors are experienced, and records the result in the
 * state.
 */
export class CallStep implements Step {
  /**
   * By default we recognise the TransitoryError as the only retryable error.
   */
  readonly defaultTransientErrorTypes = [TransitoryError]

  /**
   * By default we retry the callFunc 9 times (in addition to the original call)
   * with an exponential backoff that increases from 100ms to 30s, over the course
   * of just over a minute.
   */
  readonly defaultRetryIntervalsInMilliseconds = [100, 250, 500, 1000, 2000, 4000, 8000, 15000, 30000]

  /**
   * Constructs a new CallStep.
   * @param key The name of the state property used to store the value
   * returned by the function.
   * @param callFunc A function that mutates an external resource.
   * @param options A set of options for the call step
   */
  constructor (readonly key: string, readonly callFunc: CallFunc, readonly options: CallStepOptions) {}

  /**
   * Executes the step.
   * @param state A state object.
   * @param logFunc A function for adding messages to the log.
   */
  async execute (state: State, logFunc: LogFunc): Promise<State> {
    if (typeof state[this.key] === 'undefined') {
      logFunc(`Started call step for '${this.key}'.`)
    
      const data = await resolveRetryablePromise(
        this.callFunc,
        this.options.transientErrorTypes || this.defaultTransientErrorTypes,
        this.options.retryIntervalsInMilliseconds || this.defaultRetryIntervalsInMilliseconds
      )
  
      logFunc(`Finished call step '${this.key}'.`)
  
      return {
        ...state,
        [this.key]: {
          value: data
        }
      }
    } else {
      logFunc(`Skipping call step '${this.key}'.`)
      return state
    }
  }
}
