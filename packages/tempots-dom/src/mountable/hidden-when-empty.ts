import { DOMContext } from '../dom/dom-context'
import { Renderable } from '../types/domain'

export const HiddenWhenEmpty: Renderable = (ctx: DOMContext) => {
  const el = ctx.element as HTMLElement
  const initial = el.style.getPropertyValue(':empty')
  el.style.setProperty(':empty', 'display:none')
  return (removeTree: boolean) => {
    if (removeTree) el.style.setProperty(':empty', initial)
  }
}
