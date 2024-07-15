import { DOMContext } from '../dom/dom-context'
import { Clear } from '../types/domain'

export const OnCtx = (fn: (ctx: DOMContext) => Clear) => (ctx: DOMContext) =>
  fn(ctx)
