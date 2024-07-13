import type { Renderable } from '../types/domain'
import { DOMContext } from '../dom/dom-context'

export const OnDispose =
  (fn: (removeTree: boolean, ctx: DOMContext) => void): Renderable =>
  (ctx: DOMContext) => {
    return (removeTree: boolean) => fn(removeTree, ctx)
  }
