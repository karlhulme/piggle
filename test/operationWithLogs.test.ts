import { expect, jest, test } from '@jest/globals'
import { executeOperation, log } from '../src'

test('An operation emits logs via the onLog callback.', async () => {
  const operation = function * () {
    yield log('message 1')
    yield log('message 2')
  }

  const options = {
    onLog: jest.fn()
  }

  await expect(executeOperation(operation, null, options)).resolves.toEqual(true)
  expect(options.onLog).toHaveBeenCalledTimes(4)
  expect(options.onLog).toHaveBeenNthCalledWith(1, 'Operation started.')
  expect(options.onLog).toHaveBeenNthCalledWith(2, 'message 1')
  expect(options.onLog).toHaveBeenNthCalledWith(3, 'message 2')
  expect(options.onLog).toHaveBeenNthCalledWith(4, 'Operation completed.')
})
