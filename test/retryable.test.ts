import { expect, jest, test } from '@jest/globals'
import { retryable, OperationTransitoryError, OperationInterruptedError } from '../src'

class CustomTransitoryError extends OperationTransitoryError {}
class BespokeError extends Error {}

function createFlakeyPromise (failedAttempts: number, callback: () => unknown, useBespokeError: boolean) {
  let index = -1

  return async function () {
    index++
    const succeed = index >= failedAttempts
    const result = callback()

    return new Promise((resolve, reject) => {
      if (succeed) {
        resolve(result)
      } else {
        reject(useBespokeError
          ? new BespokeError('BESPOKE_FAIL')
          : new CustomTransitoryError('TRANSITORY_FAIL')
        )
      }
    })
  }
}

test('An operation that passes is executed once.', async () => {
  const testOp = jest.fn(async () => 123)

  const result = await retryable(testOp)
  expect(result).toEqual(123)

  expect(testOp).toHaveBeenCalledTimes(1)
})

test('An operation that fails with a permanent error is executed once and raises the underlying error.', async () => {
  const testOp = jest.fn(async () => { throw new Error('FAIL') })

  await expect(retryable(testOp)).rejects.toThrowError('FAIL')

  expect(testOp).toHaveBeenCalledTimes(1)
})

test('An operation that fails with transitory errors derived from OperationTransitoryError is re-tried and can succeed.', async () => {
  const testOp = jest.fn(() => 123)
  const flakeyPromise = createFlakeyPromise(2, testOp, false)

  const result = await retryable(flakeyPromise)
  expect(result).toEqual(123)

  expect(testOp).toHaveBeenCalledTimes(3)
})

test('An operation that fails with transitory bespoke errors is re-tried and can succeed.', async () => {
  const testOp = jest.fn(() => 123)
  const flakeyPromise = createFlakeyPromise(2, testOp, true)

  const result = await retryable(flakeyPromise, { isErrorTransient: err => err instanceof BespokeError })
  expect(result).toEqual(123)

  expect(testOp).toHaveBeenCalledTimes(3)
})

test('An operation that fails with transitory errors too many times results in failure.', async () => {
  const testOp = jest.fn(() => 123)
  const flakeyPromise = createFlakeyPromise(3, testOp, false)

  await expect(retryable(flakeyPromise, { retryIntervalsInMilliseconds: [100, 200] })).rejects.toThrow('TRANSITORY_FAIL')

  expect(testOp).toHaveBeenCalledTimes(3)
})

test('An operation can be interrupted.', async () => {
  const testOp = jest.fn(() => 123)
  const flakeyPromise = createFlakeyPromise(2, testOp, false)

  await expect(retryable(flakeyPromise, { canContinueProcessing: () => false })).rejects.toThrow(OperationInterruptedError)

  expect(testOp).toHaveBeenCalledTimes(0)
})
