import { Renderable, domRenderable } from '../types/domain'

/**
 * Represents an empty renderable object.
 * @returns A renderable object that does nothing.
 * @public
 */
export const Empty: Renderable = domRenderable(() => () => {})
