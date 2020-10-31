import { WaitStep } from '../steps'

/**
 * Creates a wait step object that can be yielded during an operation.
 * This is used to pause an operation.
 * @param {Number} milliseconds A number of milliseconds to wait.
 */
export function wait (milliseconds: number) {
  return new WaitStep(milliseconds)
}
