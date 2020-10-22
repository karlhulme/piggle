/**
 * An error that is raised if the handler assigned
 * to the onSave event raises an error.
 */
export class SaveCallbackError extends Error {
  /**
   * Constructs a new instance.
   * @param {String} message A message.
   */
  constructor (message) {
    super(message)
    this.name = this.constructor.name
  }
}
