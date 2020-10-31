import { SaveFunc, LogFunc } from '../funcs'
import { State } from '../state'

/**
 * A set of options to be used to processing an operation.
 */
export interface OperationOptions {
  /**
   * The state of the operation based on a previous execution.
   */
  state?: State,

  /**
   * A function for saving the state of the operation as it proceeds.
   */
  onSave?: SaveFunc,

  /**
   * A function for adding a message to a log.
   */
  onLog?: LogFunc
}