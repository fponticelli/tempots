import type { Renderable } from '../types/domain'
import { DOMContext } from '../dom/dom-context'

export type DisposeCallback = (removeTree: boolean, ctx: DOMContext) => void

/**
 * Creates a renderable function that will be called when the component is unmounted.
 * @param fns - The function(s) to be called when the component is unmounted.
 * @returns A renderable function that takes a DOMContext and returns a function that takes a boolean indicating whether to remove the tree.
 * @public
 */
export const OnDispose =
  (...fns: DisposeCallback[]): Renderable =>
  (ctx: DOMContext) =>
  (removeTree: boolean) =>
    fns.forEach(fn => fn(removeTree, ctx))
