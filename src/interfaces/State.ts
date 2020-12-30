/**
 * Represents the value of a state property. 
 */
interface StatePropertyValue {
  value: unknown
}

/**
 * Represents the state of an operation at a point in time.
 */
export type State = Record<string, StatePropertyValue>
