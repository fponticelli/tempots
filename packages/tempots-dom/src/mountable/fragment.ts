import type { TNode, Renderable } from '../types/domain'
import { DOMContext } from '../dom/dom-context'
import { childToRenderable } from './element'

export const Fragment =
  (...children: TNode[]): Renderable =>
  (ctx: DOMContext) => {
    const clears = children.map(child => childToRenderable(child)(ctx))
    return (removeTree: boolean) => {
      clears.forEach(clear => clear(removeTree))
    }
  }
