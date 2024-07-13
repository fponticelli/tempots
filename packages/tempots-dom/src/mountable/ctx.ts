import { DOMContext, Renderable } from '..'

export const Ctx = (fn: (ctx: DOMContext) => Renderable) => (ctx: DOMContext) =>
  fn(ctx)(ctx)
