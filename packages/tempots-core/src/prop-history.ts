import { Prop, Signal, strictEquals } from './signal'
import { getCurrentScope, untracked } from './scope-stack'

/**
 * Options for configuring a PropHistory controller.
 *
 * @typeParam T - The type of values being tracked.
 * @public
 */
export type PropHistoryOptions<T> = {
  /**
   * Maximum number of history entries to keep.
   * Defaults to 100. Set to 0 for unlimited history.
   */
  maxSize?: number
  /**
   * Filter function to decide whether a change should be recorded.
   * Return `true` to record the change, `false` to skip it.
   */
  filter?: (value: T, previousValue: T) => boolean
}

/**
 * A history controller that provides undo/redo navigation for a signal.
 *
 * @typeParam T - The type of values being tracked.
 * @public
 */
export type PropHistory<T> = {
  /** The source signal (read access). */
  readonly signal: Signal<T>
  /** Set a new value (goes through history). */
  readonly set: (value: T) => void
  /** Undo the last change. No-op if at the beginning. */
  readonly undo: () => void
  /** Redo the last undone change. No-op if at the end. */
  readonly redo: () => void
  /** Jump to a specific index in the history. No-op for out-of-bounds indices. */
  readonly go: (index: number) => void
  /** Whether there are entries to undo. */
  readonly canUndo: Signal<boolean>
  /** Whether there are entries to redo. */
  readonly canRedo: Signal<boolean>
  /** The full history of entries. */
  readonly entries: Signal<readonly T[]>
  /** The current position in the history. */
  readonly index: Signal<number>
  /** Clear the history. Optionally reset to a new value. */
  readonly clear: (resetValue?: T) => void
  /** Pause recording. Returns a resume function. */
  readonly pause: () => () => void
  /** Group multiple changes into a single undo step. */
  readonly transaction: (fn: () => void) => void
  /** Dispose the controller (does NOT dispose the source signal). */
  readonly dispose: () => void
}

/**
 * Creates a history controller for a Prop, enabling undo/redo navigation.
 *
 * @example
 * ```typescript
 * const counter = prop(0)
 * const history = propHistory(counter)
 *
 * counter.set(1); counter.set(2); counter.set(3)
 * history.undo()  // counter.value === 2
 * history.redo()  // counter.value === 3
 * history.go(0)   // counter.value === 0
 * ```
 *
 * @typeParam T - The type of values being tracked.
 * @param prop - The Prop to track.
 * @param options - Optional configuration.
 * @returns A PropHistory controller.
 * @public
 */
export function propHistory<T>(
  prop: Prop<T>,
  options?: PropHistoryOptions<T>
): PropHistory<T>

/**
 * Creates a history controller for a Signal with an external setter, enabling undo/redo navigation.
 *
 * @example
 * ```typescript
 * const mySignal = signal(0)
 * const mySet = (v: number) => mySignal._setAndNotify(v)
 * const history = propHistory(mySignal, mySet)
 * history.set(5)
 * history.undo()  // calls mySet(0)
 * ```
 *
 * @typeParam T - The type of values being tracked.
 * @param signal - The Signal to track.
 * @param set - The setter function.
 * @param options - Optional configuration.
 * @returns A PropHistory controller.
 * @public
 */
export function propHistory<T>(
  signal: Signal<T>,
  set: (value: T) => void,
  options?: PropHistoryOptions<T>
): PropHistory<T>

export function propHistory<T>(
  source: Signal<T> | Prop<T>,
  setOrOptions?: ((value: T) => void) | PropHistoryOptions<T>,
  maybeOptions?: PropHistoryOptions<T>
): PropHistory<T> {
  let setter: (value: T) => void
  let options: PropHistoryOptions<T> | undefined

  if (
    Prop.is(source) &&
    (setOrOptions === undefined || typeof setOrOptions === 'object')
  ) {
    setter = (v: T) => source.set(v)
    options = setOrOptions as PropHistoryOptions<T> | undefined
  } else {
    setter = setOrOptions as (value: T) => void
    options = maybeOptions
  }

  const maxSize = options?.maxSize ?? 100
  const filter = options?.filter

  // Internal state
  const history: T[] = [source.value]
  let currentIndex = 0
  let isNavigating = false
  let isPaused = false
  let isInTransaction = false
  let transactionStartIndex = 0

  // Reactive state — created outside any scope so they don't get auto-disposed
  const _canUndo = untracked(() => new Prop(false, strictEquals))
  const _canRedo = untracked(() => new Prop(false, strictEquals))
  const _entries = untracked(
    () => new Prop<readonly T[]>(history.slice(), strictEquals)
  )
  const _index = untracked(() => new Prop(0, strictEquals))

  const updateReactiveState = () => {
    _canUndo.set(currentIndex > 0)
    _canRedo.set(currentIndex < history.length - 1)
    _entries.set(history.slice())
    _index.set(currentIndex)
  }

  // Listen for changes on the source signal
  const removeListener = source.on(
    (value: T, previousValue: T | undefined) => {
      if (isNavigating || isPaused || isInTransaction) return
      if (previousValue === undefined) return

      if (filter != null && !filter(value, previousValue)) return

      // Trim any forward history
      history.length = currentIndex + 1
      history.push(value)
      currentIndex = history.length - 1

      // Enforce maxSize
      if (maxSize > 0 && history.length > maxSize) {
        const excess = history.length - maxSize
        history.splice(0, excess)
        currentIndex -= excess
      }

      updateReactiveState()
    },
    { skipInitial: true, noAutoDispose: true }
  )

  const navigateTo = (index: number) => {
    if (index < 0 || index >= history.length || index === currentIndex) return
    isNavigating = true
    currentIndex = index
    setter(history[currentIndex])
    isNavigating = false
    updateReactiveState()
  }

  const undo = () => {
    if (currentIndex <= 0) return
    navigateTo(currentIndex - 1)
  }

  const redo = () => {
    if (currentIndex >= history.length - 1) return
    navigateTo(currentIndex + 1)
  }

  const go = (index: number) => {
    navigateTo(index)
  }

  const set = (value: T) => {
    setter(value)
  }

  const clear = (resetValue?: T) => {
    const value = resetValue !== undefined ? resetValue : source.value
    if (resetValue !== undefined) {
      isNavigating = true
      setter(value)
      isNavigating = false
    }
    history.length = 0
    history.push(value)
    currentIndex = 0
    updateReactiveState()
  }

  const pause = () => {
    isPaused = true
    return () => {
      isPaused = false
    }
  }

  const transaction = (fn: () => void) => {
    isInTransaction = true
    transactionStartIndex = currentIndex
    const startValue = history[currentIndex]
    fn()
    isInTransaction = false

    // Check if the value actually changed during the transaction
    const endValue = source.value
    if (!source.equals(startValue, endValue)) {
      // Apply the filter if present
      if (filter != null && !filter(endValue, startValue)) return

      // Trim any forward history from where we started
      history.length = transactionStartIndex + 1
      history.push(endValue)
      currentIndex = history.length - 1

      // Enforce maxSize
      if (maxSize > 0 && history.length > maxSize) {
        const excess = history.length - maxSize
        history.splice(0, excess)
        currentIndex -= excess
      }

      updateReactiveState()
    }
  }

  const dispose = () => {
    removeListener()
    _canUndo.dispose()
    _canRedo.dispose()
    _entries.dispose()
    _index.dispose()
  }

  // Auto-register with current scope if one exists
  const currentScope = getCurrentScope()
  if (currentScope != null) {
    currentScope.onDispose(dispose)
  }

  return {
    signal: source,
    set,
    undo,
    redo,
    go,
    canUndo: _canUndo,
    canRedo: _canRedo,
    entries: _entries,
    index: _index,
    clear,
    pause,
    transaction,
    dispose,
  }
}
