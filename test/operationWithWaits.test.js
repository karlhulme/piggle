import { expect, test } from '@jest/globals'
import { executeOperation, wait } from '../index.js'

test('An operation with waits will complete successfully.', async () => {
  const operation = function * (input, output) {
    yield wait(1100)
  }

  const start = process.hrtime()
  await expect(executeOperation(operation)).resolves.toEqual(true)
  const duration = process.hrtime(start)
  expect(duration[0]).toBeGreaterThanOrEqual(1)
})
