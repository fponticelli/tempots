import type { Clear, Renderable, RenderContext } from './types'

/**
 * Creates a renderable object from a render function and type symbol.
 *
 * This is a helper function for creating renderables. Most users will use
 * context-specific helpers like `domRenderable()` or `threeRenderable()`
 * instead of calling this directly.
 *
 * @typeParam CTX - The type of context this renderable can be rendered into
 * @typeParam TType - The symbol type used for branding
 *
 * @param type - The symbol type for runtime type checking
 * @param renderFn - The function that renders content into the context
 * @returns A renderable object
 *
 * @example
 * ```typescript
 * const DOM_RENDERABLE_TYPE = Symbol('DOM_RENDERABLE')
 *
 * const myComponent = createRenderable(
 *   DOM_RENDERABLE_TYPE,
 *   (ctx: DOMContext) => {
 *     const divCtx = ctx.makeChildElement('div', undefined)
 *     divCtx.makeChildText('Hello, World!')
 *     return (removeTree) => {
 *       divCtx.clear(removeTree)
 *     }
 *   }
 * )
 * ```
 *
 * @public
 */
export function createRenderable<
  CTX extends RenderContext,
  TType extends symbol,
>(type: TType, renderFn: (ctx: CTX) => Clear): Renderable<CTX, TType> {
  return {
    type,
    render: renderFn,
  }
}
