import { DOMContext } from '../dom/dom-context'
import { HeadlessContext } from '../dom/headless-context'
import { Clear, Renderable, TNode } from '../types/domain'
import { renderableOfTNode } from './element'

/**
 * Returns a renderable function that executes the given function with the current DOMContext as argument.
 *
 * @param fn - The function to be executed with the DOMContext argument.
 * @returns A Clear function that can be used to clean up any resources associated with the execution.
 * @public
 */
export const WithHeadlessCtx =
  (fn: (ctx: HeadlessContext) => TNode | void): Renderable =>
  (ctx: DOMContext): Clear => {
    if (ctx.isHeadlessDOM()) {
      const result = fn(ctx)
      if (result) {
        return renderableOfTNode(result)(ctx)
      }
    }
    return () => {}
  }
