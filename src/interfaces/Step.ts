import { State } from './State'
import { LogFunc } from './LogFunc'

/**
 * Defines the methods that a Step must implement.
 */
export interface Step {
  /**
   * Implementors should return a new state object, which is typically
   * constructed by copying across the keys of the provided state object
   * and appending one or more additional keys.
   * If the step does not perform any actions that should not be repeated
   * then it can return the given state unchanged.
   * @param state The existing state of an operation.
   * @param logFunc A function that adds messages to the log.
   */
  execute (state: State, logFunc: LogFunc): Promise<State>
}
