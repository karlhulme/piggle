
interface PromiseFunc {
  (): Promise<void>
}

interface OnLogFunc {
  (message: string): Promise<void>
}

interface CallStep {
  type: string,
  name: string,
  promiseFunc: PromiseFunc,
  config: object
}

interface CallStepConfig {
  onLog?: OnLogFunc
}

/**
 * Creates a call step object that can be yielded during an operation.
 * This is used to pause an operation while a promise is running and
 * ensure that if the promise resolves successfully the response data
 * is persisted.
 * @param {String} name The name of a call step.
 * @param {PromiseFunction} promiseFunc A parameterless function that returns a promise.
 * @param {CallStepConfig} [config] Configuration options for a call step.
 * @returns {CallStep}
 */
export function call (name: string, promiseFunc: PromiseFunc, config: CallStepConfig) {
  return {
    type: 'CALL_STEP',
    name,
    promiseFunc,
    config
  }
}
