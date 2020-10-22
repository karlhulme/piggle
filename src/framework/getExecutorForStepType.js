import { CALL_STEP, WAIT_STEP, STORE_STEP, LOG_STEP } from '../yields'
import { executeCallStep, executeLogStep, executeStoreStep, executeWaitStep } from '../steps/index.js'

/**
 * Returns a function that can execute the given step.
 * @param {Object} step A step object yielded during an operation.
 * @returns {function(step: object, output: object, options: object): Promise<object>}
 */
export function getExecutorForStepType (step) {
  switch (step.type) {
    case CALL_STEP: return executeCallStep
    case STORE_STEP: return executeStoreStep
    case LOG_STEP: return executeLogStep
    case WAIT_STEP: return executeWaitStep
    default: throw new Error(`Object yielded from operation did not have a recognised type property.\n${JSON.stringify(step)}`)
  }
}
