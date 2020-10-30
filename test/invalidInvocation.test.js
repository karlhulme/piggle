import { expect, test } from '@jest/globals'
import { executeOperation } from '../src/index.js'

test('An invalid invocation should throw.', async () => {
  await expect(executeOperation(123)).rejects.toThrow(TypeError)
})
