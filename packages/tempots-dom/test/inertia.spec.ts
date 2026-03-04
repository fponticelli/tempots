import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest'
import { createInertiaHandler } from '../src'

describe('createInertiaHandler', () => {
  let rafCallbacks: Array<(time: number) => void>
  let originalRaf: typeof requestAnimationFrame
  let originalCaf: typeof cancelAnimationFrame
  let frameId: number

  beforeEach(() => {
    rafCallbacks = []
    frameId = 0
    originalRaf = globalThis.requestAnimationFrame
    originalCaf = globalThis.cancelAnimationFrame
    globalThis.requestAnimationFrame = vi.fn((cb) => {
      rafCallbacks.push(cb)
      return ++frameId
    })
    globalThis.cancelAnimationFrame = vi.fn()
    vi.spyOn(performance, 'now').mockReturnValue(0)
  })

  afterEach(() => {
    globalThis.requestAnimationFrame = originalRaf
    globalThis.cancelAnimationFrame = originalCaf
    vi.restoreAllMocks()
  })

  test('track builds up velocity and release produces deltas', () => {
    const deltas: [number, number][] = []
    const handler = createInertiaHandler(
      (dx, dy) => deltas.push([dx, dy]),
      { friction: 0.95, minVelocity: 0.5 }
    )

    vi.spyOn(performance, 'now').mockReturnValue(0)
    handler.track(0, 0)
    vi.spyOn(performance, 'now').mockReturnValue(100)
    handler.track(100, 50) // 100px in 0.1s = 1000px/s x, 500px/s y

    const handle = handler.release()

    // Frame 1 (dt=0): onDelta called with 0,0
    rafCallbacks[0](1000)
    expect(deltas.length).toBe(1)
    expect(deltas[0]).toEqual([0, 0])

    // Frame 2 (dt=16ms): velocity decayed, produces real deltas
    rafCallbacks[1](1016)
    expect(deltas.length).toBe(2)
    expect(deltas[1][0]).toBeGreaterThan(0)
    expect(deltas[1][1]).toBeGreaterThan(0)

    handle.dispose()
  })

  test('release returns disposable handle', () => {
    const onDelta = vi.fn()
    const handler = createInertiaHandler(onDelta)

    vi.spyOn(performance, 'now').mockReturnValue(0)
    handler.track(0, 0)
    vi.spyOn(performance, 'now').mockReturnValue(100)
    handler.track(100, 0)

    const handle = handler.release()
    expect(handle.dispose).toBeInstanceOf(Function)
    handle.dispose()
    expect(globalThis.cancelAnimationFrame).toHaveBeenCalled()
  })

  test('velocity decays with friction', () => {
    const deltas: number[] = []
    const handler = createInertiaHandler(
      (dx) => deltas.push(dx),
      { friction: 0.5, minVelocity: 1 }
    )

    vi.spyOn(performance, 'now').mockReturnValue(0)
    handler.track(0, 0)
    vi.spyOn(performance, 'now').mockReturnValue(100)
    handler.track(100, 0) // 1000 px/s

    const handle = handler.release()

    // Frame 0 (dt=0): delta is 0
    rafCallbacks[0](1000)
    // Frame 1 (dt=16ms): real delta
    rafCallbacks[1](1016)
    // Frame 2 (dt=16ms): decayed delta
    rafCallbacks[2](1032)

    // Skip first delta (dt=0), compare frame 1 vs frame 2
    expect(deltas.length).toBeGreaterThanOrEqual(3)
    expect(Math.abs(deltas[2])).toBeLessThan(Math.abs(deltas[1]))

    handle.dispose()
  })
})
