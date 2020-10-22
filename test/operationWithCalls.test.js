import { expect, jest, test } from '@jest/globals'
import { executeOperation, call, TransitoryError } from '../index.js'

function addPromise (a, b) {
  return new Promise((resolve, reject) => {
    resolve(a + b)
  })
}

function failPromise () {
  return new Promise((resolve, reject) => {
    reject(new Error('fail'))
  })
}

function createFlakeyPromise (attempts, callback, result) {
  let index = -1

  return async function () {
    index++
    const result = index >= attempts
    callback(result)

    return new Promise((resolve, reject) => {
      if (result) {
        resolve('done')
      } else {
        reject(new TransitoryError('failed'))
      }
    })
  }
}

test('An operation with a call to a promise completes successfully and saves the progress.', async () => {
  const operation = function * (input, output) {
    yield call('A', () => addPromise(2, 3))
  }

  const options = {
    onSave: jest.fn()
  }

  await expect(executeOperation(operation, options)).resolves.toEqual(true)
  expect(options.onSave).toHaveBeenCalledTimes(1)
  expect(options.onSave).toHaveBeenNthCalledWith(
    1,
    { A: { type: 'CALL_STEP', data: 5 } }
  )
})

test('An operation with a call to a failing promise does not complete.', async () => {
  const operation = function * (input, output) {
    yield call('A', () => failPromise())
  }

  const options = {
    onSave: jest.fn()
  }

  await expect(executeOperation(operation, options)).resolves.toEqual(false)
  expect(options.onSave).toHaveBeenCalledTimes(1)
})

test('An operation with calls to a promise that throws transient errors will still complete successfully after retries.', async () => {
  const cb = jest.fn()

  const operation = function * (input, output) {
    yield call('A', createFlakeyPromise(3, cb, 'done'))
  }

  const options = {
    onSave: jest.fn()
  }

  await expect(executeOperation(operation, options)).resolves.toEqual(true)

  expect(cb).toHaveBeenCalledTimes(4)
  expect(cb.mock.calls).toEqual([[false], [false], [false], [true]])

  expect(options.onSave).toHaveBeenCalledTimes(1)
  expect(options.onSave).toHaveBeenNthCalledWith(
    1,
    { A: { type: 'CALL_STEP', data: 'done' } }
  )
})

test('An operation with calls to a promise that throws more transient errors than we have retries will fail.', async () => {
  const cb = jest.fn()

  const operation = function * (input, output) {
    yield call('A', createFlakeyPromise(100, cb, 'done'), {
      retryIntervals: [50, 50, 50]
    })
  }

  const options = {
    onSave: jest.fn()
  }

  await expect(executeOperation(operation, options)).resolves.toEqual(false)

  expect(cb).toHaveBeenCalledTimes(4)
  expect(cb.mock.calls).toEqual([[false], [false], [false], [false]])

  expect(options.onSave).toHaveBeenCalledTimes(1)
  expect(options.onSave).toHaveBeenNthCalledWith(1, {})
})

test('An operation will skip previously completed call steps.', async () => {
  const operation = function * (input, output) {
    yield call('A', () => addPromise(2, 3))
    yield call('B', () => addPromise(4, 5))
  }

  const options = {
    output: {
      A: {
        type: 'CALL_STEP',
        data: 5
      }
    },
    onLog: jest.fn()
  }

  await expect(executeOperation(operation, options)).resolves.toEqual(true)

  expect(JSON.stringify(options.onLog.mock.calls)).toMatch(/Skipping call step 'A'/)
})
