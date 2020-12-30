import { Step } from './Step'
import { OperationManager } from './OperationManager'

/**
 * Describes the signature of a long-running operation that typically
 * contains one or more yield steps.
 * @param props The properties passed to the function.
 * @param manager An object for managing the running operation.
 */
export type OperationFunc<OperationPropsType> = (props: OperationPropsType, manager: OperationManager) => Generator<Step, void, void>
