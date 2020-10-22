import { expect, test } from '@jest/globals'
import { executeOperation, log, store } from '../index.js'

test('An operation with a throwing onLog callback will raise an error.', async () => {
  const operation = function * (input, output) {
    yield log('a message')
  }

  const options = {
    onLog: () => { throw new Error('unable to log') }
  }

  await expect(executeOperation(operation, options)).rejects.toThrow(Error)
  await expect(executeOperation(operation, options)).rejects.toThrow(/unable to log/)
})

test('An operation with a throwing onSave callback will raise an error.', async () => {
  const operation = function * (input, output) {
    yield store('A', { foo: 'bar' })
  }

  const options = {
    onSave: () => { throw new Error('unable to save') }
  }

  await expect(executeOperation(operation, options)).rejects.toThrow(Error)
  await expect(executeOperation(operation, options)).rejects.toThrow(/unable to save/)
})
