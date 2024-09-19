import { BrowserContext } from '../dom/browser-context'
import { DOMContext } from '../dom/dom-context'
import { Clear, Renderable } from '../types/domain'

/**
 * Returns a renderable function that executes the given function with the current DOMContext as argument.
 *
 * @param fn - The function to be executed with the DOMContext argument.
 * @returns A Clear function that can be used to clean up any resources associated with the execution.
 * @public
 */
export const OnBrowserCtx =
  (fn: (ctx: BrowserContext) => Clear): Renderable =>
  (ctx: DOMContext): Clear => {
    if (ctx.isBrowserDOM()) {
      return fn(ctx) ?? (() => {})
    }
    return () => {}
  }
