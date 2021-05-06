/**
 * An error that will be treated as transient if raised
 * during the execution of an operation.
 */
export class TransitoryError extends Error {
  /**
   * Constructs a new instance.
   * @param message A message.
   */
  constructor (message: string) {
    super(message)
    Object.setPrototypeOf(this, new.target.prototype)
    this.name = this.constructor.name
  }
}
