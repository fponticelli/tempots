import { _removeDOMNode } from '../dom/dom-utils'
import { BrowserContext } from '../dom/browser-context'
import { Renderable, domRenderable } from '../types/domain'

/**
 * Creates a renderable DOM node.
 *
 * @param node - The DOM node to render.
 * @param ctx - The DOM context to render the node in.
 * @returns A renderable object that can be used to remove the rendered node from the DOM.
 * @public
 */
export const DOMNode = (node: Node): Renderable<BrowserContext> =>
  domRenderable((ctx: BrowserContext) => {
    ctx.appendOrInsert(node)
    return (removeTree: boolean) => {
      if (removeTree) {
        _removeDOMNode(node)
      }
    }
  }) as Renderable<BrowserContext>
