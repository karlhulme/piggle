import { SaveCallbackError } from '../errors'
import { SaveFunc } from '../funcs'
import { State } from '../state'

/**
 * Returns an onSave function that handles missing or erroring
 * onSave callbacks.
 * @param onSave A function for saving the current state of an operation.
 */
export function createSafeOnSave (onSave?: SaveFunc | null) {
  return async function (state: State) {
    if (onSave) {
      try {
        await onSave(state)
      } catch (err) {
        throw new SaveCallbackError(`Error raised by handler for onSave event.\n${err.toString()}`)
      }
    }
  }
}
