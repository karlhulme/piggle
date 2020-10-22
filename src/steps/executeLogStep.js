import { invokeOnLog } from '../utils/index.js'

export async function executeLogStep (step, output, options) {
  await invokeOnLog(options.onLog, step.message)
}
