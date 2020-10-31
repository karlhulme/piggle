import { State } from '../state'
import { LogFunc } from '../funcs'
import { Step } from './Step'

/**
 * A step that stores a value in the state object.
 */
export class StoreStep implements Step {
  /**
   * Constructs a new StoreStep.
   * @param key The name of the state property used to store the given value.
   * @param value The value to be stored. 
   */
  constructor (readonly key: string, readonly value: unknown) {}

  /**
   * Executes the step.
   * @param state A state object.
   * @param logFunc A function for adding messages to the log.
   */
  async execute (state: State, logFunc: LogFunc): Promise<State> {
    if (typeof state[this.key] === 'undefined') {
      logFunc(`Storing value on key '${this.key}'.`)

      return {
        ...state,
        [this.key]: {
          value: this.value
        }
      }
    } else {
      logFunc(`Skipping store step for key '${this.key}'.`)
      return state
    }
  }
}
