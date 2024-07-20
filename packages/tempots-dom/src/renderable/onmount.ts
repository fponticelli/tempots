import { DOMContext } from '../dom/dom-context'
import type { Clear, Renderable } from '../types/domain'

/**
 * Executes a callback function when the parent element is mounted in the DOM.
 *
 * @typeParam T - The type of the element.
 * @param fn - The callback function to be executed.
 * @returns - The renderable function.
 * @public
 */
export const OnMount =
  <T extends Element>(
    fn: (element: T) => Clear | undefined | void
  ): Renderable =>
  (ctx: DOMContext) => {
    return fn(ctx.element as T) ?? (() => {})
  }
