import { State } from '../state'
import { LogFunc } from '../funcs'
import { Step } from './Step'

/**
 * A step that adds a message to the log.
 */
export class LogStep implements Step {
  /**
   * Constructs a new LogStep.
   * @param message A message.
   */
  constructor (readonly message: string) {}

  /**
   * Executes the step.
   * @param state A state object.
   * @param logFunc A function for adding messages to the log.
   */
  async execute (state: State, logFunc: LogFunc): Promise<State> {
    logFunc(this.message)

    return state
  }
}
