import { Renderable } from '../types/domain'

/**
 * Represents an empty renderable function.
 * @returns A renderable function that does nothing.
 * @public
 */
export const Empty: Renderable = () => () => {}
