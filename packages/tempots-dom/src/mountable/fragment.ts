import type { Child, Mountable } from '../types/domain'
import { DOMContext } from '../dom/dom-context'
import { childToMountable } from './element'

export const Fragment =
  (...children: Child[]): Mountable =>
  (ctx: DOMContext) => {
    const clears = children.map(child => childToMountable(child)(ctx))
    return (removeTree: boolean) => {
      clears.forEach(clear => clear(removeTree))
    }
  }
