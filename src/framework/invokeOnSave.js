/**
 * @callback OnSaveCallback
 * @param {any} additionalOutput The value produced by the last (call or store) step.
 * @param {Object} output The full output updated to reflect the recently completed step.
 * @returns {Promise<void>}
 */

/**
 * Invokes the onSave callback if provided in the options.
 * @param {OnSaveCallback} onSave A callback function.
 * @param {Object} additionalOutput The additional output generated by the last step.
 * @param {Object} output The full output updated to reflect the recently completed step.
 */
export async function invokeOnSave (onSave, additionalOutput, output) {
  if (onSave) {
    await onSave(additionalOutput, output)
  }
}