import { invokeOnLog, invokeOnSave } from '../utils/index.js'
import { getExecutorForStepType } from './getExecutorForStepType.js'

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
  let output = options.output || {}

  try {
    await invokeOnLog(options.onLog, 'Operation started.')
    const operation = operationFunc(input, output)

    for (const step of operation) {
      const stepExecutor = getExecutorForStepType(step)
      const newOutput = await stepExecutor(step, output, options)

      // if the output has changed then we must save now before any other processing
      //  including the operation code that appears between the yields or after the
      //  final yield but before the end of the operation.
      if (newOutput !== output) {
        await invokeOnSave(options.onSave, newOutput, true)
        output = newOutput
      }
    }

    await invokeOnLog(options.onLog, 'Operation completed.')
    return true
  } catch (err) {
    await invokeOnLog(options.onLog, `Operation failed.\n${err.toString()}`)
    return false
  }
}
