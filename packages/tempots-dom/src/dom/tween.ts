import type { Signal } from '@tempots/core'
import { prop, guessInterpolate } from '@tempots/core'
import type { EasingFn, Interpolate } from '@tempots/core'
import { easeOutQuad } from '@tempots/core'
import { createRafLoop, type RafLoopHandle } from './raf-loop'

/**
 * Configuration for a tween animation.
 * @typeParam T - The type of the tweened value.
 * @public
 */
export type TweenConfig<T> = {
  /** Duration in milliseconds. Default: 300. */
  readonly duration?: number
  /** Easing function. Default: easeOutQuad. */
  readonly easing?: EasingFn
  /** Custom interpolation function. Default: auto-detected via guessInterpolate. */
  readonly interpolate?: Interpolate<T>
  /** When true, tweenTo() sets the value immediately (skips animation). */
  readonly reducedMotion?: Signal<boolean>
}

/**
 * Handle returned by {@link createTween}.
 * @typeParam T - The type of the tweened value.
 * @public
 */
export type TweenHandle<T> = {
  /** The reactive signal holding the current tweened value. */
  readonly value: Signal<T>
  /** Animate from the current value to `target`. Cancels any in-flight tween. */
  tweenTo: (target: T) => void
  /** Cancel any in-flight animation. The value stays at its current interpolated position. */
  cancel: () => void
  /** Dispose the tween and its internal signal. */
  dispose: () => void
}

/**
 * Creates an imperative tween that drives a reactive signal from its current
 * value to a target using an easing function over a fixed duration.
 *
 * Complements `animateSignal` (declarative) with explicit `tweenTo()` control.
 *
 * @typeParam T - The type of the tweened value.
 * @param initial - The initial value.
 * @param config - Optional tween configuration.
 * @returns A tween handle.
 * @public
 */
export function createTween<T>(
  initial: T,
  config?: TweenConfig<T>
): TweenHandle<T> {
  const duration = config?.duration ?? 300
  const easing = config?.easing ?? easeOutQuad
  const reducedMotion = config?.reducedMotion
  let interpolate = config?.interpolate as Interpolate<T> | undefined
  const value = prop(initial)

  let loopHandle: RafLoopHandle | null = null
  let startValue: T = initial
  let endValue: T = initial
  let elapsed = 0

  const cancel = () => {
    if (loopHandle !== null) {
      loopHandle.dispose()
      loopHandle = null
    }
  }

  const tweenTo = (target: T) => {
    cancel()

    if (
      duration <= 0 ||
      (reducedMotion != null && reducedMotion.get() === true)
    ) {
      value.set(target)
      return
    }

    startValue = value.get()
    endValue = target
    elapsed = 0

    if (interpolate == null) {
      interpolate = guessInterpolate(startValue) as Interpolate<T>
    }

    loopHandle = createRafLoop(dt => {
      elapsed += dt
      const t = Math.min(elapsed / duration, 1)
      const easedT = easing(t)
      value.set(interpolate!(startValue, endValue, easedT))
      if (t >= 1) {
        cancel()
      }
    })
  }

  const dispose = () => {
    cancel()
    value.dispose()
  }

  return { value, tweenTo, cancel, dispose }
}
