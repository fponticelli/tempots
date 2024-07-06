import type { Mountable } from '../types/domain'
import { DOMContext } from '../dom/dom-context'

export const OnDispose =
  (fn: (removeTree: boolean, ctx: DOMContext) => void): Mountable =>
  (ctx: DOMContext) => {
    return (removeTree: boolean) => fn(removeTree, ctx)
  }
