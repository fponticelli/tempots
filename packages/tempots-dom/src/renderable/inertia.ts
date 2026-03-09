import type { Renderable } from '../types/domain'
import { WithBrowserCtx } from './with-browser-ctx'
import { OnDispose } from './shared'
import {
  createInertiaHandler,
  type InertiaConfig,
  type InertiaHandler,
} from '../dom/inertia'
import type { RafLoopHandle } from '../dom/raf-loop'

/**
 * A Tempo renderable that attaches inertia-based pointer drag handlers to
 * the parent element. On pointer up, the surface continues scrolling with
 * exponential velocity decay.
 *
 * @param onDelta - Called with `(dx, dy)` deltas each frame during drag and decay.
 * @param config - Optional friction and threshold settings.
 * @returns A renderable.
 * @public
 */
export const Inertia = (
  onDelta: (dx: number, dy: number) => void,
  config?: InertiaConfig
): Renderable =>
  WithBrowserCtx(ctx => {
    const el = ctx.element
    const handler: InertiaHandler = createInertiaHandler(onDelta, config)
    let decayHandle: RafLoopHandle | null = null
    let lastX = 0
    let lastY = 0

    const onPointerDown = (e: PointerEvent) => {
      if (decayHandle !== null) {
        decayHandle.dispose()
        decayHandle = null
      }
      lastX = e.clientX
      lastY = e.clientY
      handler.track(e.clientX, e.clientY)
      el.setPointerCapture(e.pointerId)
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!el.hasPointerCapture(e.pointerId)) return
      const dx = e.clientX - lastX
      const dy = e.clientY - lastY
      lastX = e.clientX
      lastY = e.clientY
      handler.track(e.clientX, e.clientY)
      onDelta(dx, dy)
    }

    const onPointerUp = (e: PointerEvent) => {
      if (!el.hasPointerCapture(e.pointerId)) return
      el.releasePointerCapture(e.pointerId)
      decayHandle = handler.release()
    }

    el.addEventListener('pointerdown', onPointerDown)
    el.addEventListener('pointermove', onPointerMove)
    el.addEventListener('pointerup', onPointerUp)
    el.addEventListener('pointercancel', onPointerUp)

    return OnDispose(() => {
      if (decayHandle !== null) decayHandle.dispose()
      el.removeEventListener('pointerdown', onPointerDown)
      el.removeEventListener('pointermove', onPointerMove)
      el.removeEventListener('pointerup', onPointerUp)
      el.removeEventListener('pointercancel', onPointerUp)
    })
  })
