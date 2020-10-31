import { OperationFunc } from '../funcs'
import { createSafeOnLog, createSafeOnSave } from '../utils'
import { OperationOptions } from './OperationOptions'

/**
 * Executes the operation and returns a status code to indicate the result.
 * The operation should be a generator function that yields steps.
 * A step can be a `call` to another service, a `store` of information required by later steps, or
 * an instruction to `log` a message.
 * The return value of a promise provided to a `call` step will be written to the output object as data.
 * For this reason operations should not expect to capture anything from the return value of a yield expression.
 * @param operationFunc A generator function.
 * @param input The payload to be passed to the generator function as input
 * @param options The options for executing the operation.
 */
export async function executeOperation (operationFunc: OperationFunc, input?: unknown, options?: OperationOptions): Promise<boolean> {
  let state = options ? options.state || {} : {}
  const onLog = createSafeOnLog(options ? options.onLog : undefined)
  const onSave = createSafeOnSave(options ? options.onSave : undefined)

  try {
    onLog('Operation started.')
    const operation = operationFunc(input, state)

    for (const step of operation) {
      const newState = await step.execute(state, onLog)

      // if the output has changed then we must save now before any other processing
      //  including the operation code that appears between the yields or after the
      //  final yield but before the end of the operation.
      if (newState && newState !== state) {
        await onSave(newState)
        state = newState
      }
    }

    onLog('Operation completed.')
    return true
  } catch (err) {
    onLog(`Operation failed.\n${err.toString()}`)
    return false
  }
}
