import type { Renderable } from '../types/domain'
import { DOMContext } from '../dom/dom-context'
import { _getSelfOrParentElement, _isElement } from '../dom/dom-utils'
import { _clearSSR } from '../dom/ssr'
import { BrowserContext } from '../dom/browser-context'

/**
 * Renders the given `renderable` with the provided `ctx` DOM context.
 *
 * @param renderable - The renderable node to be rendered.
 * @param ctx - The DOM context to be used for rendering.
 * @returns A function that can be called to clear the rendered node.
 * @public
 */
export const renderWithContext = (renderable: Renderable, ctx: DOMContext) => {
  const clear = renderable(ctx)
  return () => clear(true)
}

/**
 * Options for rendering.
 * @public
 */
export type RenderOptions = {
  /**
   * The document to render to. It is inferred from the parent element if not provided.
   */
  doc?: Document
  /**
   * Whether to clear the document before rendering. This is useful when the page has been pre-rendered on the server.
   */
  clear?: boolean
}

/**
 * Renders a `Renderable` node into a specified parent element or selector.
 *
 * @param node - The `Renderable` node to render.
 * @param parent - The parent element or selector where the node should be rendered.
 * @param options - Optional rendering options.
 * @returns The result of rendering the `Renderable` node.
 * @throws Throws a `RenderingError` if the parent element cannot be found by the provided selector.
 * @public
 */
export const render = (
  node: Renderable,
  parent: Node | string,
  { doc, clear }: RenderOptions = {}
) => {
  const el =
    typeof parent === 'string'
      ? (doc ?? document).querySelector(parent)
      : parent
  if (el === null) {
    throw new RenderingError(
      `Cannot find element by selector for render: ${parent}`
    )
  }
  if (clear !== false && (doc ?? el.ownerDocument) != null) {
    _clearSSR((doc ?? el.ownerDocument)!)
  }
  const element = _getSelfOrParentElement(el)
  const ref = _isElement(el) ? undefined : el
  const ctx = BrowserContext.of(element, ref)
  return renderWithContext(node, ctx)
}

/**
 * Represents an error that occurs during rendering.
 * @public
 */
export class RenderingError extends Error {
  constructor(message: string) {
    super(message)
  }
}
