import { expect, test } from '@jest/globals'
import { pause } from '../src'

test('A pause function waits the requested number of milliseconds before resolving.', async () => {
  const startTime = process.hrtime()
  
  await pause(2000)

  const duration = process.hrtime(startTime)
  const durationInMilliseconds = ((duration[0] * 1000) + Math.trunc(duration[1] / 1000000))

  expect(durationInMilliseconds).toBeGreaterThanOrEqual(2000)
})
