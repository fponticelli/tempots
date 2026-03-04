import { createRafLoop, type RafLoopHandle } from './raf-loop'

/**
 * Configuration for inertia scroll behavior.
 * @public
 */
export type InertiaConfig = {
  /** Velocity multiplier per frame (0–1). Default: 0.95. */
  readonly friction?: number
  /** Minimum velocity in px/s to keep animating. Default: 0.5. */
  readonly minVelocity?: number
}

/**
 * Handle returned by {@link createInertiaHandler}.
 * @public
 */
export type InertiaHandler = {
  /**
   * Call on each pointer/touch move during drag to track velocity.
   * @param x - Current pointer X position.
   * @param y - Current pointer Y position.
   */
  track: (x: number, y: number) => void
  /**
   * Call on pointer up to start the inertia decay animation.
   * @returns A handle to cancel the inertia animation.
   */
  release: () => RafLoopHandle
}

/**
 * Creates an inertia handler for pan/scroll interactions. During a drag,
 * call `track(x, y)` on each pointer move to build up velocity. On release,
 * call `release()` to start an exponential decay animation.
 *
 * @param onDelta - Called with `(dx, dy)` deltas each frame during the decay.
 * @param config - Optional friction and threshold settings.
 * @returns An inertia handler.
 * @public
 */
export function createInertiaHandler(
  onDelta: (dx: number, dy: number) => void,
  config?: InertiaConfig
): InertiaHandler {
  const friction = config?.friction ?? 0.95
  const minVelocity = config?.minVelocity ?? 0.5

  let lastX = 0
  let lastY = 0
  let lastTime: number | null = null
  let vx = 0
  let vy = 0

  const track = (x: number, y: number) => {
    const now = performance.now()
    if (lastTime !== null) {
      const dt = (now - lastTime) / 1000 // seconds
      if (dt > 0) {
        vx = (x - lastX) / dt
        vy = (y - lastY) / dt
      }
    }
    lastX = x
    lastY = y
    lastTime = now
  }

  const release = (): RafLoopHandle => {
    let currentVx = vx
    let currentVy = vy
    // Reset tracking for next gesture
    lastTime = null
    vx = 0
    vy = 0

    const handle = createRafLoop((dt) => {
      const dtSec = dt / 1000
      currentVx *= friction
      currentVy *= friction

      if (Math.hypot(currentVx, currentVy) < minVelocity) {
        handle.dispose()
        return
      }

      onDelta(currentVx * dtSec, currentVy * dtSec)
    })

    return handle
  }

  return { track, release }
}
