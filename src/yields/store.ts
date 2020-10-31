import { StoreStep } from '../steps'

/**
 * Creates a store step object that can be yielded during an operation.
 * This is used to store data in the state under a named key.
 * @param key The name of a store step.
 * @param value Any serializable value.
 */
export function store (key: string, value: any) {
  return new StoreStep(key, value)
}
