import { expect, test } from '@jest/globals'
import { executeOperation } from '../src'

test('An empty operation completes successfully.', async () => {
  const emptyOperation = function * () {}

  await expect(executeOperation(emptyOperation)).resolves.toEqual(true)
})
