import type { AnySignal, Computed, ListenerOptions, Prop } from './signal'
import { computed, effect, prop } from './signal'
import type { Scope } from './scope-stack'
import { untracked, withScope } from './scope-stack'
import type { Value } from './value'
import { computedOf, effectOf } from './value'
import { ValueTypes } from './types'

/**
 * A DisposalScope tracks signals created during its lifetime and disposes them when the scope ends.
 * This enables automatic signal disposal without manual OnDispose() calls.
 *
 * @public
 */
export class DisposalScope implements Scope {
  private _signals: AnySignal[] | null = null
  private _callbacks: Array<() => void> | null = null
  private _disposed: boolean = false

  /**
   * Register a signal with this scope for automatic disposal.
   *
   * @param signal - The signal to track
   * @public
   */
  track(signal: AnySignal): void {
    if (this._signals === null) this._signals = []
    this._signals.push(signal)
  }

  /**
   * Register a disposal callback to be called when this scope is disposed.
   * Callbacks are called before signals are disposed.
   * Use this for cleanup that doesn't need the `removeTree` parameter.
   *
   * @param callback - The callback to call on disposal
   * @public
   */
  onDispose(callback: () => void): void {
    if (this._callbacks === null) this._callbacks = []
    this._callbacks.push(callback)
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

    // Call disposal callbacks first (before disposing signals)
    const callbacks = this._callbacks
    this._callbacks = null
    if (callbacks !== null) {
      for (let i = 0; i < callbacks.length; i++) {
        try {
          callbacks[i]()
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error)
          console.error('Error in disposal callback:', message)
        }
      }
    }

    // Then dispose all signals
    const signals = this._signals
    this._signals = null
    if (signals !== null) {
      for (let i = 0; i < signals.length; i++) {
        signals[i].dispose()
      }
    }
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
      fn: (...args: ValueTypes<T>) => O,
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
      fn: (...args: ValueTypes<T>) => void,
      options?: ListenerOptions
    ): (() => void) => {
      // Use withScope to ensure the computed signal created by effectOf() is tracked
      return withScope(this, () => effectOf(...args)(fn, options))
    }
  }
}

/**
 * Execute a function in a new scope and dispose the scope immediately after.
 * Useful for one-off scoped operations.
 *
 * @param fn - The function to execute, receives the scope as parameter
 * @returns The result of the function
 * @public
 */
export const scoped = <T>(fn: (scope: DisposalScope) => T): T => {
  const scope = new DisposalScope()
  try {
    return withScope(scope, () => fn(scope))
  } finally {
    scope.dispose()
  }
}
