import { expect, jest, test } from '@jest/globals'
import { executeOperation, log, store } from '../src'

test('An operation with a throwing onLog callback will not raise an error.', async () => {
  const operation = function * () {
    yield log('a message')
  }

  const options = {
    onLog: () => { throw new Error('unable to log') }
  }

  await expect(executeOperation(operation, null, options)).resolves.toEqual(true)
})

test('An operation with a throwing onSave callback will be shown in the logs.', async () => {
  const operation = function * () {
    yield store('A', { foo: 'bar' })
  }

  const options = {
    onLog: jest.fn(),
    onSave: async () => { throw new Error('unable to save') }
  }

  await expect(executeOperation(operation, null, options)).resolves.toEqual(false)
  expect(JSON.stringify(options.onLog.mock.calls)).toMatch(/SaveCallbackError/)
  expect(JSON.stringify(options.onLog.mock.calls)).toMatch(/unable to save/)
})
