import { DOMContext } from '../dom/dom-context'
import { Renderable, TNode } from '../types/domain'
import { renderableOfTNode } from './element'
import { renderWithContext } from './render'
import { domRenderable } from '../types/domain'

/**
 * Renders the given `node` into a DOM element selected by the provided `selector`.
 * Throws an error if the element cannot be found.
 *
 * @param selector - The CSS selector for the target DOM element.
 * @param node - The node to be rendered.
 * @param ctx - The DOM context.
 * @returns The result of rendering the `node` into the selected DOM element.
 * @public
 */
export const Portal = (
  selector: string | HTMLElement,
  node: TNode
): Renderable =>
  domRenderable((ctx: DOMContext) => {
    const portalCtx = ctx.makePortal(selector)
    const clear = renderWithContext(renderableOfTNode(node), portalCtx)
    return () => clear(true)
  })
