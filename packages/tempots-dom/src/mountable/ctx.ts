import { DOMContext, Mountable } from '..'

export const Ctx = (fn: (ctx: DOMContext) => Mountable) => (ctx: DOMContext) =>
  fn(ctx)(ctx)
