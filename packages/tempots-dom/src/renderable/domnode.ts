import { _removeDOMNode } from '../dom/dom-utils'
import { HTMLDOMContext } from '../dom/html-dom-context'
import { Renderable } from '../types/domain'

/**
 * Creates a renderable DOM node.
 *
 * @param node - The DOM node to render.
 * @param ctx - The DOM context to render the node in.
 * @returns A function that can be called to remove the rendered node from the DOM.
 * @public
 */
export const DOMNode =
  (node: Node): Renderable<HTMLDOMContext> =>
  (ctx: HTMLDOMContext) => {
    ctx.appendOrInsert(node)
    return (removeTree: boolean) => {
      if (removeTree) {
        _removeDOMNode(node)
      }
    }
  }
