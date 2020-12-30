import { LogFunc, State, Step } from '../interfaces'
import { pause } from '../utils'

/**
 * A step that pauses execution for a period of time.
 */
export class WaitStep implements Step {
  /**
   * Constructs a new WaitStep.
   * @param milliseconds The time to wait, specified in milliseconds.
   */
  constructor (readonly milliseconds: number) {}

  /**
   * Executes the step.
   * @param state A state object.
   * @param logFunc A function for adding messages to the log.
   */
  async execute (state: State, logFunc: LogFunc): Promise<State> {
    logFunc(`Pausing for ${this.milliseconds} milliseconds.`)

    await pause(this.milliseconds)

    return state
  }
}
