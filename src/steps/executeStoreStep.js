import { invokeOnLog } from '../utils/index.js'

export async function executeStoreStep (step, output, options) {
  if (typeof output[step.name] === 'undefined') {
    await invokeOnLog(options.onLog, `Performing store step '${step.name}'.`)

    return {
      ...output,
      [step.name]: {
        type: step.type,
        data: step.data
      }
    }
  } else {
    await invokeOnLog(options.onLog, `Skipping store step '${step.name}'.`)
    return output
  }
}
