import { SaveCallbackError } from '../errors/index.js'

/**
 * @callback OnSaveCallback
 * @param {Object} output The full output updated to reflect the recently completed step.
 * @returns {Promise<void>}
 */

/**
 * Invokes the onSave callback if provided in the options.
 * @param {OnSaveCallback} onSave A callback function.
 * @param {Object} output The output updated to reflect the recently completed step.
 */
export async function invokeOnSave (onSave, output) {
  if (onSave) {
    try {
      await onSave(output)
    } catch (err) {
      throw new SaveCallbackError(`Error raised by handler for onSave event.\n${err.toString()}`)
    }
  }
}
