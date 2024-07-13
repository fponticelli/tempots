import { DOMContext } from '../dom/dom-context'
import type { Clear, Renderable } from '../types/domain'

export const OnMount =
  <T extends Element>(
    fn: (element: T) => Clear | undefined | void
  ): Renderable =>
  (ctx: DOMContext) => {
    return fn(ctx.element as T) ?? (() => {})
  }
