import { State } from "../state"

/**
 * Describes the signature of a function for saving the current state.
 */
export type SaveFunc = (state: State) => Promise<void>
