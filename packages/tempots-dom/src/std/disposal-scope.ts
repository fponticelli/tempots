import type { AnySignal, Computed, ListenerOptions, Prop } from './signal'
import { computed, effect, prop } from './signal'
import { untracked, withScope } from './scope-stack'
import type { Value } from './value'
import { computedOf, effectOf } from './value'

/**
 * A DisposalScope tracks signals created during its lifetime and disposes them when the scope ends.
 * This enables automatic signal disposal without manual OnDispose() calls.
 *
 * @public
 */
export class DisposalScope {
  private _signals: Set<AnySignal> = new Set()
  private _disposed: boolean = false

  /**
   * Register a signal with this scope for automatic disposal.
   *
   * @param signal - The signal to track
   * @throws Error if the scope has already been disposed
   * @throws Error if the signal has already been disposed
   * @public
   */
  track(signal: AnySignal): void {
    if (this._disposed) {
      throw new Error('Cannot track signal in disposed scope')
    }
    if (signal.isDisposed()) {
      throw new Error('Cannot track already disposed signal')
    }
    this._signals.add(signal)
  }

  /**
   * Dispose all signals tracked by this scope.
   * This method is idempotent - calling it multiple times is safe.
   *
   * @public
   */
  dispose(): void {
    if (this._disposed) return
    this._disposed = true

    for (const signal of this._signals) {
      signal.dispose()
    }
    this._signals.clear()
  }

  /**
   * Check if this scope has been disposed.
   *
   * @returns true if the scope has been disposed
   * @public
   */
  get disposed(): boolean {
    return this._disposed
  }

  /**
   * Creates a prop signal and tracks it in this scope.
   * Use this method in async contexts where automatic tracking doesn't work.
   *
   * @param value - The initial value
   * @param equals - Optional equality function
   * @returns A tracked Prop signal
   * @public
   */
  prop<T>(value: T, equals?: (a: T, b: T) => boolean): Prop<T> {
    const signal = untracked(() => prop(value, equals))
    this.track(signal)
    return signal
  }

  /**
   * Creates a computed signal and tracks it in this scope.
   * Use this method in async contexts where automatic tracking doesn't work.
   *
   * @param fn - The computation function
   * @param dependencies - Array of signals this computed depends on
   * @param equals - Optional equality function
   * @returns A tracked Computed signal
   * @public
   */
  computed<T>(
    fn: () => T,
    dependencies: Array<AnySignal>,
    equals?: (a: T, b: T) => boolean
  ): Computed<T> {
    const signal = untracked(() => computed(fn, dependencies, equals))
    this.track(signal)
    return signal
  }

  /**
   * Creates an effect and tracks it in this scope.
   * Use this method in async contexts where automatic tracking doesn't work.
   *
   * @param fn - The effect function
   * @param signals - Array of signals to listen to
   * @param options - Optional listener options
   * @returns A clear function (the effect itself is tracked in the scope)
   * @public
   */
  effect(
    fn: () => void,
    signals: Array<AnySignal>,
    options?: ListenerOptions
  ): () => void {
    // Use withScope to ensure the computed signal created by effect() is tracked
    return withScope(this, () => effect(fn, signals, options))
  }

  /**
   * Creates a computed signal with curried signature and tracks it in this scope.
   * Use this method in async contexts where automatic tracking doesn't work.
   *
   * @param args - Values or signals to compute from
   * @returns A function that takes the computation function and returns a tracked Computed signal
   * @public
   */
  computedOf<T extends Value<unknown>[]>(...args: T) {
    return <O>(
      fn: (...args: any[]) => O,
      equals?: (a: O, b: O) => boolean
    ): Computed<O> => {
      const signal = untracked(() => computedOf(...args)(fn, equals))
      this.track(signal)
      return signal
    }
  }

  /**
   * Creates an effect with curried signature and tracks it in this scope.
   * Use this method in async contexts where automatic tracking doesn't work.
   *
   * @param args - Values or signals to listen to
   * @returns A function that takes the effect function and returns a clear function
   * @public
   */
  effectOf<T extends Value<unknown>[]>(...args: T) {
    return (
      fn: (...args: any[]) => void,
      options?: ListenerOptions
    ): (() => void) => {
      // Use withScope to ensure the computed signal created by effectOf() is tracked
      return withScope(this, () => effectOf(...args)(fn, options))
    }
  }
}
