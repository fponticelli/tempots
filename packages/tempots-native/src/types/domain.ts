import { createRenderable } from '@tempots/core'
import type {
  Clear,
  ProviderMark,
  Renderable as CoreRenderable,
} from '@tempots/core'
import type { NativeContext } from '../context/native-context'

// Re-export core types used in native-specific types
export type { Clear, ProviderMark }

/**
 * Symbol to brand native renderables and prevent mixing with other contexts.
 * @public
 */
export const NATIVE_RENDERABLE_TYPE = Symbol('NATIVE_RENDERABLE')

/**
 * A renderable object that can render content into the native view tree.
 * @public
 */
export type NativeRenderable<CTX extends NativeContext = NativeContext> =
  CoreRenderable<CTX, typeof NATIVE_RENDERABLE_TYPE>

/**
 * Helper to create native renderables.
 * @internal
 */
export const nativeRenderable = <CTX extends NativeContext = NativeContext>(
  renderFn: (ctx: CTX) => Clear
): NativeRenderable<CTX> =>
  createRenderable(NATIVE_RENDERABLE_TYPE, renderFn) as NativeRenderable<CTX>
