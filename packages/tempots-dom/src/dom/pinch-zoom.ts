import type { Prop } from '@tempots/core'

/**
 * State for a pinch-zoom interaction.
 * @public
 */
export type PinchZoomState = {
  readonly scale: number
  readonly panX: number
  readonly panY: number
}

/**
 * Configuration for the pinch-zoom handler.
 * @public
 */
export type PinchZoomConfig = {
  /** Minimum allowed scale. Default: 0.1. */
  readonly minScale?: number
  /** Maximum allowed scale. Default: 5. */
  readonly maxScale?: number
}

/**
 * Event handlers returned by {@link createPinchZoomHandler}.
 * @public
 */
export type PinchZoomHandler = {
  readonly onTouchStart: (e: TouchEvent) => void
  readonly onTouchMove: (e: TouchEvent) => void
  readonly onTouchEnd: (e: TouchEvent) => void
}

function dist(t1: Touch, t2: Touch): number {
  const dx = t1.clientX - t2.clientX
  const dy = t1.clientY - t2.clientY
  return Math.hypot(dx, dy)
}

function mid(t1: Touch, t2: Touch): { x: number; y: number } {
  return {
    x: (t1.clientX + t2.clientX) / 2,
    y: (t1.clientY + t2.clientY) / 2,
  }
}

/**
 * Creates event handlers for two-finger pinch-to-zoom with simultaneous pan.
 *
 * @param state - A `Prop` holding the current zoom/pan state. Updated on each touch move.
 * @param getContainerRect - Returns the bounding rect of the zoomable container.
 * @param config - Optional scale limits.
 * @returns Touch event handlers to attach to the target element.
 * @public
 */
export function createPinchZoomHandler(
  state: Prop<PinchZoomState>,
  getContainerRect: () => DOMRect,
  config?: PinchZoomConfig
): PinchZoomHandler {
  const minScale = config?.minScale ?? 0.1
  const maxScale = config?.maxScale ?? 5

  let startDist = 0
  let startMid = { x: 0, y: 0 }
  let startState: PinchZoomState = { scale: 1, panX: 0, panY: 0 }

  const clampScale = (s: number) => Math.min(maxScale, Math.max(minScale, s))

  const onTouchStart = (e: TouchEvent) => {
    if (e.touches.length !== 2) return
    e.preventDefault()
    const t0 = e.touches[0]
    const t1 = e.touches[1]
    startDist = dist(t0, t1)
    startMid = mid(t0, t1)
    startState = state.get()
  }

  const onTouchMove = (e: TouchEvent) => {
    if (e.touches.length !== 2) return
    e.preventDefault()
    const t0 = e.touches[0]
    const t1 = e.touches[1]
    const currentDist = dist(t0, t1)
    const currentMid = mid(t0, t1)
    const rect = getContainerRect()

    const zoomRatio = currentDist / startDist
    const newScale = clampScale(startState.scale * zoomRatio)

    // Zoom origin relative to container
    const originX = startMid.x - rect.left
    const originY = startMid.y - rect.top

    // Pan delta
    const panDx = currentMid.x - startMid.x
    const panDy = currentMid.y - startMid.y

    // Compute new pan: adjust for zoom change around origin + pan delta
    const scaleRatio = newScale / startState.scale
    const newPanX = originX - (originX - startState.panX) * scaleRatio + panDx
    const newPanY = originY - (originY - startState.panY) * scaleRatio + panDy

    state.set({ scale: newScale, panX: newPanX, panY: newPanY })
  }

  const onTouchEnd = (_e: TouchEvent) => {
    // Reset when fewer than 2 touches remain — next start will re-initialize
  }

  return { onTouchStart, onTouchMove, onTouchEnd }
}
