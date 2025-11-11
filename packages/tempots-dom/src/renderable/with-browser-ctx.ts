import { BrowserContext } from '../dom/browser-context'
import { DOMContext } from '../dom/dom-context'
import { Clear, Renderable, TNode } from '../types/domain'
import { renderableOfTNode } from './element'
import { domRenderable } from '../types/domain'

/**
 * Returns a renderable object that executes the given function with the
 * current DOMContext as argument.
 * The given function can return a TNode or void. If you need to perform some
 * actions when the Renderable is disposed, you can use `OnDispose` as the
 * return value.
 *
 * @param fn - The function to be executed with the DOMContext argument.
 * @returns A Clear function that can be used to clean up any resources associated with the execution.
 * @public
 */
export const WithBrowserCtx = (
  fn: (ctx: BrowserContext) => TNode | void
): Renderable =>
  domRenderable((ctx: DOMContext): Clear => {
    if (ctx.isBrowser()) {
      const result = fn(ctx)
      /* c8 ignore next 3 */
      if (result != null) {
        return renderableOfTNode(result).render(ctx)
      }
    }
    return () => {}
  })
