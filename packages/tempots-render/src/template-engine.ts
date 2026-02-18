import type { Clear, Renderable } from '@tempots/core'
import type { BaseRenderContext } from './context'

/**
 * Platform-specific template engine for optimizing repeated renderable creation.
 *
 * The template engine enables `cloneNode(true)` optimization in loops
 * (KeyedForEach, ForEach, Repeat) by building a template from the first
 * item's renderable tree and cloning it for subsequent items.
 *
 * @typeParam CTX - The context type
 * @typeParam TType - The renderable type symbol
 * @public
 */
export interface TemplateEngine<
  CTX extends BaseRenderContext,
  TType extends symbol,
> {
  /**
   * Build a reusable template from a renderable tree.
   * Returns null if the renderable is not template-capable (e.g., headless context).
   */
  build(renderable: Renderable<CTX, TType>, ctx: CTX): unknown | null

  /**
   * Clone a compiled template and wire up dynamic bindings from the provided slots.
   */
  cloneAndHydrate(
    template: unknown,
    ctx: CTX,
    slots: Renderable<CTX, TType>[]
  ): Clear

  /**
   * Compute a structural fingerprint for runtime guard checking.
   * Two renderable trees with the same fingerprint produce identical DOM structures.
   * Returns null if the tree cannot be fingerprinted.
   */
  fingerprint(renderable: Renderable<CTX, TType>): string | null

  /**
   * Extract dynamic renderables (slots) from a renderable tree, in template build order.
   */
  extractSlots(renderable: Renderable<CTX, TType>): Renderable<CTX, TType>[]
}
