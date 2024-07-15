import { DOMContext } from '../dom/dom-context'
import { removeDOMNode } from '../dom/dom-utils'

export const DOMEl = (element: Element) => (ctx: DOMContext) => {
  ctx.appendOrInsert(element)
  return (removeTree: boolean) => {
    if (removeTree) {
      removeDOMNode(element)
    }
  }
}
