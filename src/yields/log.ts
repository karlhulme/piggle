import { LogStep } from '../steps'

/**
 * Creates a log step object that can be yielded during an operation.
 * This is used to add a message to the log.
 * @param message A message.
 */
export function log (message: string): LogStep {
  return new LogStep(message)
}
