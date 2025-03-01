import { DOMContext } from '../dom/dom-context'
import { Clear, Renderable, TNode } from '../types/domain'
import { renderableOfTNode } from './element'

/**
 * Returns a renderable function that executes the given function with the
 * current DOMContext as argument.
 * The given function can return a TNode or void. If you need to perform some
 * actions when the Renderable is disposed, you can use `OnDispose` as the
 * return value.
 *
 * @param fn - The function to be executed with the DOMContext argument.
 * @returns A Clear function that can be used to clean up any resources associated with the execution.
 * @public
 */
export const WithCtx =
  (fn: (ctx: DOMContext) => TNode | void): Renderable =>
  (ctx: DOMContext): Clear => {
    const result = fn(ctx)
    if (result == null) {
      return () => {}
    }
    return renderableOfTNode(result)(ctx)
  }
