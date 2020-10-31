import { expect, jest, test } from '@jest/globals'
import { executeOperation, store } from '../src'

test('An operation with stores will complete successfully.', async () => {
  const operation = function * () {
    yield store('A', { foo: 'bar' })
    yield store('B', { hello: 'world' })
  }

  const options = {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onSave: jest.fn(async () => {})
  }

  await expect(executeOperation(operation, null, options)).resolves.toEqual(true)
  expect(options.onSave).toHaveBeenCalledTimes(2)
  expect(options.onSave).toHaveBeenNthCalledWith(
    1,
    { A: { value: { foo: 'bar' } } }
  )
  expect(options.onSave).toHaveBeenNthCalledWith(
    2,
    { A: { value: { foo: 'bar' } }, B: { value: { hello: 'world' } } }
  )
})

test('An operation with stores but no save will still complete successfully.', async () => {
  const operation = function * () {
    yield store('A', { foo: 'bar' })
    yield store('B', { hello: 'world' })
  }

  await expect(executeOperation(operation)).resolves.toEqual(true)
})

test('An operation will skip previously completed store steps.', async () => {
  const operation = function * () {
    yield store('A', { foo: 'bar' })
    yield store('B', { hello: 'world' })
  }

  const options = {
    state: {
      A: {
        value: {
          foo: 'bar'
        }
      }
    },
    onLog: jest.fn()
  }

  await expect(executeOperation(operation, null, options)).resolves.toEqual(true)

  expect(JSON.stringify(options.onLog.mock.calls)).toMatch(/Skipping store step for key 'A'/)
})
