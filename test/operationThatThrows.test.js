import { expect, jest, test } from '@jest/globals'
import { executeOperation } from '../index.js'

test('An operation that throws will not complete successfully.', async () => {
  const operation = function * (input, output) {
    throw new Error('failure message')
  }

  const options = {
    onLog: jest.fn()
  }

  await expect(executeOperation(operation, options)).resolves.toEqual(false)

  expect(JSON.stringify(options.onLog.mock.calls)).toMatch(/failure message/)
})
