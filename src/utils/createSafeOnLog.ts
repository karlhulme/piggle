import { LogFunc } from '../funcs'

/**
 * Returns an onLog function that handles missing or erroring
 * onLog callbacks.
 * @param onLog A function for adding a message to a log.
 */
export function createSafeOnLog (onLog?: LogFunc | null) {
  return function (message: string): void {
    if (onLog) {
      try {
        onLog(message)
      } catch (err) {
        console.log(`Error raised by handler for onLog event.\n${err.toString()}`)
      }
    }
  }
}
