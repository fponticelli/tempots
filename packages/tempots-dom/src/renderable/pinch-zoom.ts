import type { Prop } from '@tempots/core'
import type { Renderable } from '../types/domain'
import { WithBrowserCtx } from './with-browser-ctx'
import { OnDispose } from './shared'
import {
  createPinchZoomHandler,
  type PinchZoomState,
  type PinchZoomConfig,
} from '../dom/pinch-zoom'

/**
 * A Tempo renderable that attaches pinch-to-zoom touch handlers to the
 * parent element. The handlers are automatically removed on disposal.
 *
 * @param state - A `Prop` holding the current zoom/pan state.
 * @param config - Optional scale limits.
 * @returns A renderable.
 * @public
 */
export const PinchZoom = (
  state: Prop<PinchZoomState>,
  config?: PinchZoomConfig
): Renderable =>
  WithBrowserCtx((ctx) => {
    const el = ctx.element
    const handler = createPinchZoomHandler(
      state,
      () => el.getBoundingClientRect(),
      config
    )
    el.addEventListener('touchstart', handler.onTouchStart, { passive: false })
    el.addEventListener('touchmove', handler.onTouchMove, { passive: false })
    el.addEventListener('touchend', handler.onTouchEnd)
    return OnDispose(() => {
      el.removeEventListener('touchstart', handler.onTouchStart)
      el.removeEventListener('touchmove', handler.onTouchMove)
      el.removeEventListener('touchend', handler.onTouchEnd)
    })
  })
