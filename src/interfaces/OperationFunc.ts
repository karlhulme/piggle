import { State } from './state'
import { Step } from './step'

/**
 * Describes the signature of a long-running operation that typically
 * contains one or more yield steps.
 * @param input The payload passed to the function as input.
 * @param state The current state of the operation, or null if the
 * operation is being started for the first time.
 */
export type OperationFunc = (input: unknown, state: State | null) => Generator<Step, void, void>
