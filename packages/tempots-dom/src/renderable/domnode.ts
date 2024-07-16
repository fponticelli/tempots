import { DOMContext } from '../dom/dom-context'
import { removeDOMNode } from '../dom/dom-utils'

export const DOMNode = (node: Node) => (ctx: DOMContext) => {
  ctx.appendOrInsert(node)
  return (removeTree: boolean) => {
    if (removeTree) {
      removeDOMNode(node)
    }
  }
}
