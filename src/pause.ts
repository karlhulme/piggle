/**
 * Returns a promise that resolves when the given number of milliseconds has passed.
 * @param milliseconds A number of milliseconds.
 */
export async function pause (milliseconds: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(() => resolve(), milliseconds)
  })
}
