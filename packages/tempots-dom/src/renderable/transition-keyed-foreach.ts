import type { Signal } from '@tempots/core'
import { prop, Prop, KeyedPosition } from '@tempots/core'
import type { Renderable, TNode } from '../types/domain'
import { KeyedForEach, WithScope } from './shared'

/**
 * Configuration for enter/exit transitions.
 * @public
 */
export type TransitionConfig = {
  /** CSS class added to items during their exit animation. */
  readonly exitClass?: string
  /** Duration in milliseconds before an exiting item is removed from the DOM. */
  readonly exitDuration?: number
  /** CSS class added to items during their enter animation. */
  readonly enterClass?: string
  /** Duration in milliseconds before the enter class is removed. */
  readonly enterDuration?: number
  /**
   * When `true`, listens for `animationend` / `transitionend` events to
   * determine when to remove exiting items, instead of using `exitDuration`.
   */
  readonly useAnimationEvents?: boolean
}

type TrackedItem<T> = {
  readonly value: T
  readonly key: string | number
  readonly isExiting: Prop<boolean>
}

/**
 * A drop-in replacement for `KeyedForEach` that supports enter and exit
 * animations by delaying DOM removal. Items that leave the list are kept in
 * the DOM with an `isExiting` signal set to `true`, allowing CSS transitions
 * or class-based animations to play before removal.
 *
 * @typeParam T - The type of items in the list.
 * @param items - A signal of the current item array.
 * @param key - A function that returns a unique key for each item.
 * @param renderFn - Renders each item. Receives the item signal, keyed position,
 *   and an `isExiting` signal.
 * @param config - Transition configuration (classes, durations).
 * @returns A renderable.
 * @public
 */
export function TransitionKeyedForEach<T>(
  items: Signal<T[]>,
  key: (item: T) => string | number,
  renderFn: (
    item: Signal<T>,
    position: KeyedPosition,
    isExiting: Signal<boolean>
  ) => TNode,
  config: TransitionConfig
): Renderable {
  return WithScope(scope => {
    const tracked = prop<TrackedItem<T>[]>([])
    const exitTimers = new Map<string | number, ReturnType<typeof setTimeout>>()

    scope.onDispose(() => {
      for (const timer of exitTimers.values()) clearTimeout(timer)
      exitTimers.clear()
    })

    // Track the current set of live keys and exiting keys
    const exitingKeys = new Set<string | number>()

    items.on(
      currentItems => {
        const currentKeys = new Set(currentItems.map(key))
        const prevTracked = tracked.get()

        // Identify items that need to start exiting
        const newlyExiting: TrackedItem<T>[] = []
        for (const t of prevTracked) {
          if (!currentKeys.has(t.key) && !exitingKeys.has(t.key)) {
            // Item just removed — start exit
            exitingKeys.add(t.key)
            t.isExiting.set(true)
            newlyExiting.push(t)

            // Schedule removal
            if (config.exitDuration != null && config.exitDuration > 0) {
              const timer = setTimeout(() => {
                exitTimers.delete(t.key)
                exitingKeys.delete(t.key)
                tracked.set(tracked.get().filter(x => x.key !== t.key))
              }, config.exitDuration)
              exitTimers.set(t.key, timer)
            } else if (!config.useAnimationEvents) {
              // No duration and no animation events — remove immediately
              exitingKeys.delete(t.key)
              // Will be filtered out below
            }
          }
        }

        // Build active items (preserving order of current items)
        const activeItems: TrackedItem<T>[] = currentItems.map(item => {
          const k = key(item)
          // Reuse existing tracked item if it exists and is not exiting
          const existing = prevTracked.find(
            t => t.key === k && !exitingKeys.has(k)
          )
          if (existing != null) {
            return existing
          }
          return {
            value: item,
            key: k,
            isExiting: prop(false),
          }
        })

        // Still-exiting items (from previous rounds, not yet timed out)
        const stillExiting = prevTracked.filter(
          t => exitingKeys.has(t.key) && !currentKeys.has(t.key)
        )

        tracked.set([...activeItems, ...stillExiting])
      },
      { skipInitial: false }
    )

    return KeyedForEach(
      tracked,
      (t: TrackedItem<T>) => t.key,
      (trackedSignal: Signal<TrackedItem<T>>, position: KeyedPosition) => {
        const itemValue = trackedSignal.map(t => t.value)
        const isExiting = trackedSignal.get().isExiting

        return renderFn(itemValue, position, isExiting)
      }
    )
  })
}
