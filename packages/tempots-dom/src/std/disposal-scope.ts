import type { AnySignal } from './signal'

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
}
