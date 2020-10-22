import { invokeOnLog, resolveRetryablePromise } from '../utils/index.js'

/**
 * Executes a call step.
 * @param {import('../yields/call.js').CallStep} step A call step.
 * @param {Object} output The output object.
 * @param {import('./executeOperation.js').OperationOptions} options The operation options.
 */
export async function executeCallStep (step, output, options) {
  const stepName = step.name

  if (typeof output[stepName] === 'undefined') {
    await invokeOnLog(options.onLog, `Started call step '${stepName}'.`)

    const stepConfig = step.config || {}

    const data = await resolveRetryablePromise(
      step.promiseFunc,
      stepConfig.transientErrorTypes,
      stepConfig.retryIntervals
    )

    await invokeOnLog(options.onLog, `Finished call step '${stepName}'.`)

    return {
      ...output,
      [step.name]: {
        type: step.type,
        data
      }
    }
  } else {
    await invokeOnLog(options.onLog, `Skipping call step '${stepName}'.`)
    return output
  }
}
