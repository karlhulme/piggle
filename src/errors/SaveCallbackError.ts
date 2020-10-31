/**
 * An error that is raised if the handler assigned
 * to the onSave event raises an error.
 */
export class SaveCallbackError extends Error {
  /**
   * Constructs a new instance.
   * @param message A message.
   */
  constructor (message: string) {
    super(message)
    this.name = this.constructor.name
  }
}
