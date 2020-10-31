
import { CallFunc } from '../funcs'
import { CallStep } from '../steps'
import { CallStepOptions } from '../steps'

/**
 * Creates a call step object that can be yielded during an operation.
 * This is used to pause an operation while a promise is running and
 * ensure that if the promise resolves successfully the response data
 * is persisted.
 * @param key The name of a call step.
 * @param callFunc A parameterless function that returns a promise that
 * resolves to a value to be saved in the state.
 * @param options A set of call step options.
 */
export function call (key: string, callFunc: CallFunc, options?: CallStepOptions): CallStep {
  return new CallStep(key, callFunc, options || {})
}
