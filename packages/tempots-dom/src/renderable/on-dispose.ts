import type { Renderable } from '../types/domain'
import { DOMContext } from '../dom/dom-context'

/**
 * Creates a renderable function that will be called when the component is unmounted.
 * @param fn - The function to be called when the component is unmounted.
 * @returns A renderable function that takes a DOMContext and returns a function that takes a boolean indicating whether to remove the tree.
 * @public
 */
export const OnDispose =
  (fn: (removeTree: boolean, ctx: DOMContext) => void): Renderable =>
  (ctx: DOMContext) => {
    return (removeTree: boolean) => fn(removeTree, ctx)
  }
