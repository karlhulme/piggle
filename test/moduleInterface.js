import { expect, test } from '@jest/globals'
import { executeOperation, log, call, store, wait } from '../src/index.js'

test('Key functions are exported from the module.', async () => {
  expect(typeof executeOperation).toEqual('function')
  expect(typeof log).toEqual('function')
  expect(typeof call).toEqual('function')
  expect(typeof store).toEqual('function')
  expect(typeof wait).toEqual('function')
})
