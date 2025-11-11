import type { TNode, Renderable } from '../types/domain'
import { DOMContext } from '../dom/dom-context'
import { renderableOfTNode } from './element'
import { domRenderable } from '../types/domain'

/**
 * Creates a fragment renderable that represents a collection of child renderables.
 *
 * The Fragment itself does not render any DOM elements. Instead, it renders the child renderables in the given DOM context.
 *
 * It can be used any time a single Renderable/TNode is expected, but multiple renderables are needed.
 *
 * @param children - The child renderables to include in the fragment.
 * @returns A renderable object that renders the child renderables in the given DOM context.
 * @public
 */
export const Fragment = <T extends DOMContext>(
  ...children: TNode<T>[]
): Renderable<T> =>
  domRenderable((ctx: T) => {
    const clears = children.map(child => renderableOfTNode(child).render(ctx))
    return (removeTree: boolean) => {
      clears.forEach(clear => clear(removeTree))
    }
  }) as Renderable<T>
