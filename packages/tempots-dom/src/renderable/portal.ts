import { DOMContext } from '../dom/dom-context'
import { TNode } from '../types/domain'
import { renderableOfTNode } from './element'
import { renderWithContext } from './render'

export const Portal = (selector: string, node: TNode) => (ctx: DOMContext) => {
  const element = ctx.document.querySelector(selector)
  if (element === null) {
    throw new Error(`Cannot find element by selector for portal: ${selector}`)
  }
  return renderWithContext(
    renderableOfTNode(node),
    ctx.withElement(element).withFirstLevel()
  )
}
