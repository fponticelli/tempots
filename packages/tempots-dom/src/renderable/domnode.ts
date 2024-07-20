import { DOMContext } from '../dom/dom-context'
import { removeDOMNode } from '../dom/dom-utils'

/**
 * Creates a renderable DOM node.
 *
 * @param node - The DOM node to render.
 * @param ctx - The DOM context to render the node in.
 * @returns A function that can be called to remove the rendered node from the DOM.
 * @public
 */
export const DOMNode = (node: Node) => (ctx: DOMContext) => {
  ctx.appendOrInsert(node)
  return (removeTree: boolean) => {
    if (removeTree) {
      removeDOMNode(node)
    }
  }
}
