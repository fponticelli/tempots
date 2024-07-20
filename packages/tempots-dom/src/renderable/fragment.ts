import type { TNode, Renderable } from '../types/domain'
import { DOMContext } from '../dom/dom-context'
import { renderableOfTNode } from './element'

/**
 * Creates a fragment renderable that represents a collection of child renderables.
 *
 * The Fragment itself does not render any DOM elements. Instead, it renders the child renderables in the given DOM context.
 *
 * It can be used any time a single Renderable/TNode is expected, but multiple renderables are needed.
 *
 * @param children - The child renderables to include in the fragment.
 * @returns A renderable function that renders the child renderables in the given DOM context.
 * @public
 */
export const Fragment =
  (...children: TNode[]): Renderable =>
  (ctx: DOMContext) => {
    const clears = children.map(child => renderableOfTNode(child)(ctx))
    return (removeTree: boolean) => {
      clears.forEach(clear => clear(removeTree))
    }
  }
