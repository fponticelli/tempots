import { DOMContext } from '../dom/dom-context'
import type { Clear, Mountable } from '../types/domain'

export const OnMount =
  <T extends Element>(
    fn: (element: T) => Clear | undefined | void
  ): Mountable =>
  (ctx: DOMContext) => {
    return fn(ctx.element as T) ?? (() => {})
  }
