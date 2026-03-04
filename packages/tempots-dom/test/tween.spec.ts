import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest'
import { createTween, linear, prop } from '../src'

describe('createTween', () => {
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
  })

  afterEach(() => {
    globalThis.requestAnimationFrame = originalRaf
    globalThis.cancelAnimationFrame = originalCaf
  })

  test('starts at initial value', () => {
    const tween = createTween(0)
    expect(tween.value.get()).toBe(0)
    tween.dispose()
  })

  test('tweenTo sets value immediately when duration is 0', () => {
    const tween = createTween(0, { duration: 0 })
    tween.tweenTo(100)
    expect(tween.value.get()).toBe(100)
    tween.dispose()
  })

  test('tweenTo animates value over time with linear easing', () => {
    const tween = createTween(0, { duration: 100, easing: linear })
    tween.tweenTo(100)

    // First RAF frame (dt=0 for createRafLoop first frame)
    rafCallbacks[0](1000)
    // Second frame: dt=50ms => t=0.5
    rafCallbacks[1](1050)
    expect(tween.value.get()).toBeCloseTo(50, 0)

    tween.dispose()
  })

  test('tweenTo reaches target at end of duration', () => {
    const tween = createTween(0, { duration: 100, easing: linear })
    tween.tweenTo(100)

    // First frame dt=0
    rafCallbacks[0](1000)
    // Frame at exactly duration
    rafCallbacks[1](1100)
    expect(tween.value.get()).toBe(100)

    tween.dispose()
  })

  test('cancel stops animation', () => {
    const tween = createTween(0, { duration: 1000, easing: linear })
    tween.tweenTo(100)

    // First frame
    rafCallbacks[0](1000)
    // Mid animation
    rafCallbacks[1](1500)
    const midValue = tween.value.get()
    expect(midValue).toBeGreaterThan(0)
    expect(midValue).toBeLessThan(100)

    tween.cancel()
    expect(globalThis.cancelAnimationFrame).toHaveBeenCalled()

    tween.dispose()
  })

  test('tweenTo cancels previous animation', () => {
    const tween = createTween(0, { duration: 100, easing: linear })
    tween.tweenTo(100)

    // First frame
    rafCallbacks[0](1000)

    // Start new tween before first completes
    tween.tweenTo(200)
    expect(globalThis.cancelAnimationFrame).toHaveBeenCalled()

    tween.dispose()
  })

  test('respects reducedMotion signal', () => {
    const reducedMotion = prop(true)
    const tween = createTween(0, {
      duration: 300,
      reducedMotion,
    })

    tween.tweenTo(100)
    // Should snap immediately
    expect(tween.value.get()).toBe(100)
    // No RAF should have been scheduled
    expect(rafCallbacks).toHaveLength(0)

    reducedMotion.dispose()
    tween.dispose()
  })

  test('works with object values and custom interpolation', () => {
    const tween = createTween(
      { x: 0, y: 0 },
      {
        duration: 100,
        easing: linear,
        interpolate: (a, b, t) => ({
          x: a.x + (b.x - a.x) * t,
          y: a.y + (b.y - a.y) * t,
        }),
      }
    )
    tween.tweenTo({ x: 100, y: 200 })

    rafCallbacks[0](1000) // first frame dt=0
    rafCallbacks[1](1050) // dt=50ms => t=0.5
    const val = tween.value.get()
    expect(val.x).toBeCloseTo(50, 0)
    expect(val.y).toBeCloseTo(100, 0)

    tween.dispose()
  })
})
