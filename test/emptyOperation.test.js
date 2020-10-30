import { expect, test } from '@jest/globals'
import { executeOperation } from '../src/index.js'

test('An empty operation completes successfully.', async () => {
  const operation = function * (input, output) {}

  await expect(executeOperation(operation)).resolves.toEqual(true)
})
