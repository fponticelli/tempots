import { DOMContext } from '../dom/dom-context'
import { Child } from '../types/domain'
import { childToMountable } from './element'
import { renderWithContext } from './render'

export const Portal = (selector: string, node: Child) => (ctx: DOMContext) => {
  const element = ctx.document.querySelector(selector)
  if (element === null) {
    throw new Error(`Cannot find element by selector for portal: ${selector}`)
  }
  return renderWithContext(
    childToMountable(node),
    ctx.withElement(element).withFirstLevel()
  )
}
