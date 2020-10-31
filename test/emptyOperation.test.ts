import { expect, test } from '@jest/globals'
import { executeOperation } from '../src'

test('An empty operation completes successfully.', async () => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const emptyOperation = function * () {}

  await expect(executeOperation(emptyOperation)).resolves.toEqual(true)
})
