import { expect, jest, test } from '@jest/globals'
import { executeOperation } from '../src'

test('An operation that throws will not complete successfully.', async () => {
  const operation = function * () {
    throw new Error('failure message')
  }

  const options = {
    onLog: jest.fn()
  }

  await expect(executeOperation(operation, null, options)).resolves.toEqual(false)

  expect(JSON.stringify(options.onLog.mock.calls)).toMatch(/failure message/)
})
