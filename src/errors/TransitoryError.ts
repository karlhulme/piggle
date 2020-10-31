/**
 * An error that will be treated as transient if raised
 * during the execution of a call step.
 */
export class TransitoryError extends Error {
  /**
   * Constructs a new instance.
   * @param {String} message A message.
   */
  constructor (message: string) {
    super(message)
    this.name = this.constructor.name
  }
}
