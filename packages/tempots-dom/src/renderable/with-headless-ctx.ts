import { DOMContext } from '../dom/dom-context'
import { HeadlessContext } from '../dom/headless-context'
import { Clear, Renderable, TNode } from '../types/domain'
import { renderableOfTNode } from './element'
import { domRenderable } from '../types/domain'

/**
 * Returns a renderable object that executes the given function with the current DOMContext as argument.
 *
 * @param fn - The function to be executed with the DOMContext argument.
 * @returns A Clear function that can be used to clean up any resources associated with the execution.
 * @public
 */
export const WithHeadlessCtx = (
  fn: (ctx: HeadlessContext) => TNode | void
): Renderable =>
  domRenderable((ctx: DOMContext): Clear => {
    if (ctx.isHeadlessDOM()) {
      const result = fn(ctx)
      /* c8 ignore next 3 */
      if (result) {
        return renderableOfTNode(result).render(ctx)
      }
    }
    return () => {}
  })
