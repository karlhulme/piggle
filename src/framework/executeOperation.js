import { executeCall } from './executeCall.js'
import { invokeOnLog } from './invokeOnLog.js'
import { invokeOnSave } from './invokeOnSave.js'
import { CALL_STEP, WAIT_STEP, STORE_STEP, LOG_STEP } from '../yields'
import { pause } from './pause.js'

/**
 * @callback OperationFunction
 * @param {Object} input The payload provided to launch the operation.
 * @param {Object} output The current output of the operation.
 * @returns {Generator}
 */

/**
 * @typedef OperationOptions
 * @property {Object} [input] An object that will be passed as the first parameter to the operation generator function.
 * @property {Object} [output] An object that will be passed as the second parameter to the operation generator function.
 * @property {import('./invokeOnSave.js').OnSaveCallback} [onSave] Raised whenever a non-repeatable step has been completed so that the current progress
 * can be saved. Implementors should use this event to save the updated output object to persistent storage.
 * @property {import('./invokeOnSave.js').OnLogCallback} [onLog] Raised whenever a log message is generated, either by the framework or by an operation log step.
 * Implementors should typically cache this information and wait for the next save event.
 */

/**
 * Executes the operation and returns a status code to indicate the result.
 * The operation should be a generator function that yields steps.
 * A step can be a `call` to another service, a `store` of information required by later steps, or
 * an instruction to `log` a message.
 * The return value of a promise provided to a `call` step will be written to the output object as data.
 * For this reason operations should not expect to capture anything from the return value of a yield expression.
 * @param {OperationFunction} operationFunc A generator function. function * (input, output)
 * @param {OperationOptions} [options] The options for executing the operation.
 * @returns {Promise<Boolean>}
 */
export async function executeOperation (operationFunc, options = {}) {
  const input = options.input || {}
  const output = options.output || {}

  const operation = operationFunc(input, output)

  await invokeOnLog(options.onLog, 'Operation started.')

  try {
    for (const step of operation) {
      if (step.type === CALL_STEP) {
        const stepName = step.name

        if (typeof output[stepName] === 'undefined') {
          await invokeOnLog(options.onLog, `Started call step '${stepName}'.`)

          const stepOutput = await executeCall(step)

          if (stepOutput.complete) {
            await invokeOnLog(options.onLog, `Finished call step '${stepName}'.`)
            const stepValue = { type: CALL_STEP, data: stepOutput.data }
            output[step.name] = stepValue
            await invokeOnSave(options.onSave, { [step.name]: stepValue }, output)
          } else {
            await invokeOnLog(options.onLog, `Error within call step '${stepName}'.\n${stepOutput.errorMessage}`)
            await invokeOnLog(options.onLog, 'Operation stalled.')
            return false
          }
        } else {
          await invokeOnLog(options.onLog, `Skipping call step '${stepName}'.`)
        }
      } else if (step.type === STORE_STEP) {
        if (typeof output[step.name] === 'undefined') {
          await invokeOnLog(options.onLog, `Performing store step '${step.name}'.`)
          const stepValue = { type: STORE_STEP, data: step.data }
          output[step.name] = stepValue
          await invokeOnSave(options.onSave, { [step.name]: stepValue }, output)
        } else {
          await invokeOnLog(options.onLog, `Skipping store step '${step.name}'.`)
        }
      } else if (step.type === LOG_STEP) {
        await invokeOnLog(options.onLog, step.message)
      } else if (step.type === WAIT_STEP) {
        await pause(step.milliseconds)
      } else {
        throw new Error('Unrecognised object yielded from operation.')
      }
    }

    await invokeOnLog(options.onLog, 'Operation completed.')
    await invokeOnSave(options.onSave, {}, output)
    return true
  } catch (err) {
    await invokeOnLog(options.onLog, `Error within operation.\n${err.toString()}`)
    await invokeOnSave(options.onSave, {}, output)
    return false
  }
}
