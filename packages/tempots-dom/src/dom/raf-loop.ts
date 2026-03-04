import type { Renderable } from '../types/domain'
import { domRenderable } from '../types/domain'

/**
 * Handle returned by {@link createRafLoop} to stop the animation loop.
 * @public
 */
export interface RafLoopHandle {
  /** Cancel the loop and stop future callbacks. */
  dispose: () => void
}

/**
 * Creates a `requestAnimationFrame` loop that calls `callback` on every frame
 * with the elapsed time in milliseconds since the previous frame.
 *
 * The first frame always receives `dt = 0`.
 *
 * @param callback - Called each frame with delta time in milliseconds.
 * @returns A handle with a `dispose()` method to stop the loop.
 * @public
 */
export function createRafLoop(callback: (dt: number) => void): RafLoopHandle {
  let lastTime: number | null = null
  let frameId: number | null = null
  let disposed = false

  const tick = (now: number) => {
    if (disposed) return
    const dt = lastTime === null ? 0 : now - lastTime
    lastTime = now
    callback(dt)
    frameId = requestAnimationFrame(tick)
  }

  frameId = requestAnimationFrame(tick)

  return {
    dispose: () => {
      disposed = true
      if (frameId !== null) cancelAnimationFrame(frameId)
    },
  }
}

/**
 * A Tempo renderable that runs a `requestAnimationFrame` loop for the
 * lifetime of the component. The loop is automatically stopped when the
 * renderable is disposed.
 *
 * @param callback - Called each frame with delta time in milliseconds.
 * @returns A renderable.
 * @public
 */
export const RafLoop = (callback: (dt: number) => void): Renderable =>
  domRenderable((ctx) => {
    const handle = createRafLoop(callback)
    return (removeTree) => {
      handle.dispose()
      ctx.clear(removeTree)
    }
  })
