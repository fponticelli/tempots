import { DOMContext, Renderable } from '@tempots/dom'

/**
 * Hides the element when it is empty and restores its initial state when necessary.
 *
 * @param ctx - The DOM context.
 * @returns A function that can be used to restore the initial state of the element.
 * @public
 */
export const HiddenWhenEmpty: Renderable = (ctx: DOMContext) => {
  const el = ctx.element as HTMLElement
  const initial = el.style.getPropertyValue(':empty')
  el.style.setProperty(':empty', 'display:none')
  return (removeTree: boolean) => {
    if (removeTree) el.style.setProperty(':empty', initial)
  }
}
