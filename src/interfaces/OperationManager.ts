/**
 * Provides methods for managing the running operation.
 */
export interface OperationManager {
  /**
   * Returns the value held for named step.
   */
  getValue: (stepName: string) => unknown
}
