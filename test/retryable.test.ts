import { expect, jest, test } from '@jest/globals'
import { retryable, TransitoryError } from '../src'

class CustomTransitoryError extends TransitoryError {}

function createFlakeyPromise (failedAttempts: number, callback: () => unknown) {
  let index = -1

  return async function () {
    index++
    const succeed = index >= failedAttempts
    const result = callback()

    return new Promise((resolve, reject) => {
      if (succeed) {
        resolve(result)
      } else {
        reject(new CustomTransitoryError('TRANSITORY_FAIL'))
      }
    })
  }
}

test('A promise that passes is executed once.', async () => {
  const testPromise = jest.fn(async () => 123)

  const result = await retryable(testPromise)
  expect(result).toEqual(123)

  expect(testPromise).toHaveBeenCalledTimes(1)
})

test('A promise that fails with a permanent error is executed once and raises the underlying error.', async () => {
  const testPromise = jest.fn(async () => { throw new Error('FAIL') })

  await expect(retryable(testPromise)).rejects.toThrowError('FAIL')

  expect(testPromise).toHaveBeenCalledTimes(1)
})

test('A promise that fails with transitory errors is re-tried and can succeed.', async () => {
  const testPromise = jest.fn(() => 123)
  const flakeyPromise = createFlakeyPromise(2, testPromise)

  const result = await retryable(flakeyPromise)
  expect(result).toEqual(123)

  expect(testPromise).toHaveBeenCalledTimes(3)
})

test('A promise that fails with transitory errors too many times results in failure.', async () => {
  const testPromise = jest.fn(() => 123)
  const flakeyPromise = createFlakeyPromise(3, testPromise)

  await expect(retryable(flakeyPromise, { retryIntervalsInMilliseconds: [100, 200]})).rejects.toThrow('TRANSITORY_FAIL')

  expect(testPromise).toHaveBeenCalledTimes(3)
})
