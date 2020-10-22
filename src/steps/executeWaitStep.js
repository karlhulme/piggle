import { pause } from '../utils/index.js'

export async function executeWaitStep (step, output, options) {
  await pause(step.milliseconds)
}
