/**
 * Represents an array of constructors that create types extending
 * the Error class.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ArrayOfErrorTypes = Array<new (...args: any[]) => Error>
