import type { TNode, Renderable } from '../types/domain'
import { DOMContext } from '../dom/dom-context'
import { renderableOfTNode } from './element'

export const Fragment =
  (...children: TNode[]): Renderable =>
  (ctx: DOMContext) => {
    const clears = children.map(child => renderableOfTNode(child)(ctx))
    return (removeTree: boolean) => {
      clears.forEach(clear => clear(removeTree))
    }
  }
