import { expect, jest, test } from '@jest/globals'
import { executeOperation } from '../src/index.js'

test('An empty operation completes successfully.', async () => {
  const operation = function * (input, output) {
    yield {}
  }

  const options = {
    onLog: jest.fn()
  }

  await expect(executeOperation(operation, options)).resolves.toEqual(false)

  expect(JSON.stringify(options.onLog.mock.calls)).toMatch(/not have a recognised type property/)
})
