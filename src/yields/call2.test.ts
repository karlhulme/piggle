import { expect, test } from '@jest/globals'
import { call } from './call2'

test('A typescript function can be tested.', async () => {
  const promiseFunc = (): Promise<void> => {
    return new Promise((resolve) => {
      resolve()
    })
  }

  expect(call('hello', promiseFunc, {})).toBeDefined()
})
