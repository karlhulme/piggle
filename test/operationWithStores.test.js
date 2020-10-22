import { expect, jest, test } from '@jest/globals'
import { executeOperation, store } from '../index.js'

test('An operation with stores will complete successfully.', async () => {
  const operation = function * (input, output) {
    yield store('A', { foo: 'bar' })
    yield store('B', { hello: 'world' })
  }

  const options = {
    onSave: jest.fn()
  }

  await expect(executeOperation(operation, options)).resolves.toEqual(true)
  expect(options.onSave).toHaveBeenCalledTimes(3)
  expect(options.onSave).toHaveBeenNthCalledWith(
    1,
    { A: { type: 'STORE_STEP', data: { foo: 'bar' } } }
  )
  expect(options.onSave).toHaveBeenNthCalledWith(
    2,
    { A: { type: 'STORE_STEP', data: { foo: 'bar' } }, B: { type: 'STORE_STEP', data: { hello: 'world' } } }
  )
  expect(options.onSave).toHaveBeenNthCalledWith(
    3,
    { A: { type: 'STORE_STEP', data: { foo: 'bar' } }, B: { type: 'STORE_STEP', data: { hello: 'world' } } }
  )
})

test('An operation with stores but no save will still complete successfully.', async () => {
  const operation = function * (input, output) {
    yield store('A', { foo: 'bar' })
    yield store('B', { hello: 'world' })
  }

  await expect(executeOperation(operation)).resolves.toEqual(true)
})

test('An operation will skip previously completed store steps.', async () => {
  const operation = function * (input, output) {
    yield store('A', { foo: 'bar' })
    yield store('B', { hello: 'world' })
  }

  const options = {
    output: {
      A: {
        type: 'STORE_STEP',
        data: {
          foo: 'bar'
        }
      }
    },
    onLog: jest.fn()
  }

  await expect(executeOperation(operation, options)).resolves.toEqual(true)

  expect(JSON.stringify(options.onLog.mock.calls)).toMatch(/Skipping store step 'A'/)
})
