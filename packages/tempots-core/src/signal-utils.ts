import { getWindow } from './window'
import { ValueType, RemoveSignals, Values } from './types'
import { guessInterpolate } from './interpolate'
import {
  AnySignal,
  computed,
  Computed,
  prop,
  Prop,
  Signal,
  strictEquals,
} from './signal'
import { computedOf, Value } from './value'
import { getCurrentScope } from './scope-stack'

/**
 * Represents a memory store that stores key-value pairs.
 *
 * @public
 */
export class MemoryStore {
  private readonly _store: Map<string, string> = new Map()

  /**
   * Retrieves the value associated with the specified key from the memory store.
   * @param key - The key to retrieve the value for.
   * @returns The value associated with the key, or `null` if the key is not found.
   */
  readonly getItem = (key: string): string | null => {
    return this._store.get(key) ?? null
  }

  /**
   * Sets the value associated with the specified key in the memory store.
   * @param key - The key to set the value for.
   * @param value - The value to set.
   */
  readonly setItem = (key: string, value: string): void => {
    this._store.set(key, value)
  }
}

// Singleton instances for fallback storage
let memoryLocalStorage: MemoryStore | null = null
let memorySessionStorage: MemoryStore | null = null

const getMemoryLocalStorage = (): MemoryStore => {
  if (!memoryLocalStorage) {
    memoryLocalStorage = new MemoryStore()
  }
  return memoryLocalStorage
}

const getMemorySessionStorage = (): MemoryStore => {
  if (!memorySessionStorage) {
    memorySessionStorage = new MemoryStore()
  }
  return memorySessionStorage
}

/**
 * Represents the properties required for storing and retrieving a value of type `T`.
 *
 * @typeParam T - The type of the value to be stored.
 * @public
 */
export type StoredPropOptions<T> = {
  /**
   * The key to use for storing and retrieving the value.
   * Can be a static string or a reactive signal that changes over time.
   */
  key: Value<string>
  /**
   * The default value to use if the value is not found in the store.
   * This can be a value of type `T` or a function that returns a value of type `T`.
   * If a function is provided, it will be called to get the default value.
   */
  defaultValue: T | (() => T)
  /**
   * The store to use for storing and retrieving the value.
   */
  store: {
    /**
     * Retrieves the value associated with the specified key from the store.
     * @param key - The key to retrieve the value for.
     * @returns The value associated with the key, or `null` if the key is not found.
     */
    getItem: (key: string) => string | null
    /**
     * Sets the value associated with the specified key in the store.
     * @param key - The key to set the value for.
     * @param value - The value to set.
     */
    setItem: (key: string, value: string) => void
  }
  /**
   * A function that serializes a value of type `T` to a string.
   * The default implementation uses `JSON.stringify`.
   */
  // istanbul ignore next
  serialize?: (v: T) => string
  /**
   * A function that deserializes a string to a value of type `T`.
   * The default implementation uses `JSON.parse`.
   */
  // istanbul ignore next
  deserialize?: (v: string) => T
  /**
   * A function that compares two values of type `T` for equality.
   * The default implementation uses strict equality (`===`).
   */
  // istanbul ignore next
  equals?: (a: T, b: T) => boolean
  /**
   * A function that is called when a value is loaded from the store.
   * The default implementation returns the value as is.
   */
  onLoad?: (value: T) => T
  /**
   * Whether to sync the value across tabs. Defaults to `true`.
   */
  syncTabs?: boolean
  /**
   * Strategy for handling key changes when using a reactive key.
   * - 'load' (default): Load value from new key, the current state is already stored at this point
   * - 'migrate': Move current value to new key and continue with current value
   * - 'keep': Keep current value without loading from new key
   */
  onKeyChange?: 'load' | 'migrate' | 'keep'
}

/**
 * Creates a stored property that persists its value in a storage mechanism.
 *
 * @typeParam T - The type of the property value.
 * @param options - The options for creating the stored property.
 * @returns - The created stored property.
 * @public
 */
export const storedProp = <T>({
  key,
  defaultValue,
  store,
  serialize = JSON.stringify,
  deserialize = JSON.parse,
  equals = strictEquals as (a: T, b: T) => boolean,
  onLoad = value => value,
  syncTabs = true,
  onKeyChange = 'load',
}: StoredPropOptions<T>): Prop<T> => {
  let currentKey = Value.get(key)
  const initialValue = store.getItem(currentKey)
  const prop = new Prop<T>(
    initialValue != null
      ? onLoad(deserialize(initialValue))
      : typeof defaultValue === 'function'
        ? (defaultValue as () => T)()
        : defaultValue,
    equals
  )

  const windowRef = getWindow() as Window & {
    BroadcastChannel?: typeof BroadcastChannel
  }
  const shouldSyncTabs =
    syncTabs && typeof windowRef?.BroadcastChannel === 'function'
  let syncingFromChannel = false
  let channel: BroadcastChannel | null = null
  let instanceId: string | null = null

  const createChannel = (channelKey: string) => {
    if (!shouldSyncTabs) return null

    const channelName = `tempo:storedProp:${channelKey}`
    const newChannel = new windowRef!.BroadcastChannel!(channelName)
    const newInstanceId = `${Date.now().toString(36)}-${Math.random()
      .toString(36)
      .slice(2)}`

    const handleMessage = (
      event: MessageEvent<{
        key: string
        value: string
        sourceId?: string
      }>
    ) => {
      const data = event.data
      if (
        data == null ||
        typeof data !== 'object' ||
        data.key !== channelKey ||
        typeof data.value !== 'string' ||
        (data.sourceId != null && data.sourceId === newInstanceId)
      ) {
        return
      }

      try {
        syncingFromChannel = true
        const nextValue = onLoad(deserialize(data.value))
        prop.set(nextValue)
      } catch (error) {
        console.warn(
          `Failed to sync storedProp for key "${channelKey}" via BroadcastChannel`,
          error
        )
      } finally {
        syncingFromChannel = false
      }
    }

    newChannel.addEventListener('message', handleMessage)
    prop.onDispose(() => {
      newChannel?.removeEventListener('message', handleMessage)
      newChannel?.close()
    })

    return { channel: newChannel, instanceId: newInstanceId, handleMessage }
  }

  const channelData = createChannel(currentKey)
  if (channelData) {
    channel = channelData.channel
    instanceId = channelData.instanceId
  }

  const handleKeyChange = (newKey: string) => {
    const oldKey = currentKey
    if (oldKey === newKey) return

    // Store current value at old key before switching
    const currentValue = prop.get()
    const serialized = serialize(currentValue)
    store.setItem(oldKey, serialized)

    // Close old channel
    if (channel != null) {
      channel.close()
      channel = null
      instanceId = null
    }

    // Update current key
    currentKey = newKey

    // Handle key change strategy
    if (onKeyChange === 'load') {
      // Load value from new key
      const storedValue = store.getItem(newKey)
      if (storedValue != null) {
        try {
          const loadedValue = onLoad(deserialize(storedValue))
          prop.set(loadedValue)
        } catch (error) {
          console.warn(
            `Failed to load storedProp from new key "${newKey}"`,
            error
          )
        }
      } else {
        // No value at new key, store current value there
        store.setItem(newKey, serialized)
      }
    } else if (onKeyChange === 'migrate') {
      // Move current value to new key
      store.setItem(newKey, serialized)
    }
    // 'keep' does nothing - current value stays, no load from new key

    // Create new channel for new key
    const newChannelData = createChannel(newKey)
    if (newChannelData) {
      channel = newChannelData.channel
      instanceId = newChannelData.instanceId
    }
  }

  // Watch for key changes if key is a signal
  if (Signal.is(key)) {
    prop.onDispose(key.on(handleKeyChange))
  }

  prop.on((value, previousValue) => {
    const serialized = serialize(value)
    store.setItem(currentKey, serialized)
    if (
      channel != null &&
      !syncingFromChannel &&
      previousValue !== undefined &&
      instanceId != null
    ) {
      channel.postMessage({
        key: currentKey,
        value: serialized,
        sourceId: instanceId,
      })
    }
  })

  return prop
}

/**
 * Represents the properties required for storing and retrieving a value of type `T`.
 *
 * @typeParam T - The type of the value to be stored.
 * @public
 */
export type StorageOptions<T> = {
  /**
   * The key to use for storing and retrieving the value.
   * Can be a static string or a reactive signal that changes over time.
   */
  key: Value<string>
  /**
   * The default value to use if the value is not found in the store.
   * This can be a value of type `T` or a function that returns a value of type `T`.
   * If a function is provided, it will be called to get the default value.
   */
  defaultValue: T | (() => T)
  /**
   * A function that serializes a value of type `T` to a string.
   * The default implementation uses `JSON.stringify`.
   */
  // istanbul ignore next
  serialize?: (v: T) => string
  /**
   * A function that deserializes a string to a value of type `T`.
   * The default implementation uses `JSON.parse`.
   */
  // istanbul ignore next
  deserialize?: (v: string) => T
  /**
   * A function that compares two values of type `T` for equality.
   * The default implementation uses strict equality (`===`).
   */
  // istanbul ignore next
  equals?: (a: T, b: T) => boolean
  /**
   * A function that is called when a value is loaded from the store.
   * The default implementation returns the value as is.
   */
  onLoad?: (value: T) => T
  /**
   * Whether to sync the value across tabs. Defaults to `true`.
   */
  syncTabs?: boolean
  /**
   * Strategy for handling key changes when using a reactive key.
   * - 'load' (default): Load value from new key, the current state is already stored at this point
   * - 'migrate': Move current value to new key and continue with current value
   * - 'keep': Keep current value without loading from new key
   */
  onKeyChange?: 'load' | 'migrate' | 'keep'
}

/**
 * Creates a prop that is backed by the localStorage or a MemoryStore.
 *
 * @param options - The options for creating the prop.
 * @returns The created prop.
 * @public
 */
export const localStorageProp = <T>(options: StorageOptions<T>): Prop<T> => {
  const win = getWindow()
  const storage = win?.localStorage
  // Ensure we have a valid storage object with getItem/setItem methods
  const store =
    storage && typeof storage.getItem === 'function'
      ? storage
      : getMemoryLocalStorage()
  return storedProp({
    ...options,
    store,
  })
}

/**
 * Creates a prop that stores its value in the session storage.
 *
 * @param options - The options for the storage prop.
 * @returns A prop that stores its value in the session storage.
 * @public
 */
export const sessionStorageProp = <T>(options: StorageOptions<T>): Prop<T> => {
  const win = getWindow()
  const storage = win?.sessionStorage
  // Ensure we have a valid storage object with getItem/setItem methods
  const store =
    storage && typeof storage.getItem === 'function'
      ? storage
      : getMemorySessionStorage()
  return storedProp({
    ...options,
    store,
  })
}

function raf(fn: FrameRequestCallback) {
  if (typeof requestAnimationFrame === 'function') {
    return requestAnimationFrame(fn)
    /* c8 ignore next */
  } else {
    /* c8 ignore next 2 */
    return setTimeout(fn, 0)
  }
}

/**
 * Options for animating signals.
 *
 * @typeParam T - The type of the signal values.
 * @public
 */
export type AnimateSignalsOptions<T> = {
  /**
   * The function that interpolates between two values.
   */
  interpolate?: (start: T, end: T, delta: number) => T
  /**
   * The duration of the animation in milliseconds.
   */
  duration?: Value<number>
  /**
   * The easing function for the animation.
   */
  easing?: (t: number) => number
  /**
   * The function that compares two values for equality.
   */
  equals?: (a: T, b: T) => boolean
}

/**
 * Animates signals based on the provided options.
 *
 * @typeParam T - The type of the animated value.
 * @param initialValue - The initial value of the animation.
 * @param fn - A function that returns the end value of the animation.
 * @param dependencies - An array of signals that the animation depends on.
 * @param options - Optional options for the animation.
 * @returns - The animated value as Prop<T>
 * @public
 */
export const animateSignals = <T>(
  initialValue: T,
  fn: () => T,
  dependencies: Array<AnySignal>,
  options?: AnimateSignalsOptions<T>
): Prop<T> => {
  /* c8 ignore next */
  const duration = options?.duration ?? 300
  const easing = options?.easing ?? (t => t)
  const equals = options?.equals ?? strictEquals
  let interpolate = options?.interpolate
  let startValue = initialValue
  let endValue = fn()
  let startTime = performance.now()
  let animationFrame: number | null = null
  let done = true
  const computed = new Computed(fn, equals)
  const animated = prop(initialValue, equals)
  animated.onDispose(() => {
    if (animationFrame !== null) cancelAnimationFrame(animationFrame)
  })
  animated.onDispose(() => computed.dispose())
  dependencies.forEach(signal => {
    signal.setDerivative(computed)
    signal.onDispose(() => animated.dispose())
  })
  const changeEndValue = (value: T) => {
    endValue = value
    startTime = performance.now()
    startValue = animated.value
    if (done) {
      done = false
      animationFrame = raf(update)
    }
  }
  const update = () => {
    const now = performance.now()
    const delta = (now - startTime) / Value.get(duration)
    const t = easing(delta)
    if (interpolate == null) {
      interpolate = guessInterpolate(startValue) as (
        start: T,
        end: T,
        delta: number
      ) => T
    }
    let currentValue = interpolate(startValue, endValue, t)
    if (delta >= 1) {
      done = true
      currentValue = endValue
    } else {
      animationFrame = raf(update)
    }
    animated.set(currentValue)
  }
  computed.on(changeEndValue)
  return animated
}

/**
 * Represents the configuration options for animating a signal.
 *
 * @typeParam T - The type of the signal value.
 * @public
 */
export type AnimateSignal<T> = {
  /**
   * The initial value for the animation. If not provided, the current value of the input signal will be used.
   */
  initialValue?: T
  /**
   * The interpolation function to use for calculating intermediate values during the animation.
   */
  interpolate?: (start: T, end: T, delta: number) => T
  /**
   * The duration of the animation in milliseconds.
   */
  duration?: number
  /**
   * The easing function to use for controlling the animation progress.
   */
  easing?: (t: number) => number
  /**
   * The equality function to use for comparing signal values.
   */
  equals?: (a: T, b: T) => boolean
}

/**
 * Animates a signal by creating a new signal that transitions from an initial value to the current value of the input signal.
 *
 * @typeParam T - The type of the signal value.
 * @param signal - The input signal to animate.
 * @param options - The animation options.
 * @returns - The animated signal.
 * @public
 */
export const animateSignal = <T>(
  signal: Signal<T>,
  options?: AnimateSignal<T>
): Prop<T> => {
  /* c8 ignore next */
  const { initialValue, ...rest } = options ?? {}
  /* c8 ignore next */
  return animateSignals(
    /* c8 ignore next 2 */
    initialValue ?? signal.get(),
    () => signal.get(),
    [signal],
    rest
  )
}

/**
 * Computes a value based on a record of signals and literals.
 *
 * @typeParam T - The type of the record containing signals and literals.
 * @typeParam O - The type of the computed value.
 * @param record - The record containing signals and literals.
 * @param fn - The function to compute the value based on the literals.
 * @returns - The computed value as a signal.
 * @public
 */
export const computedRecord = <T extends Record<string, Value<unknown>>, O>(
  record: T,
  fn: (value: RemoveSignals<T>) => O
) => {
  const signals = Object.values(record).filter(Signal.is) as Signal<unknown>[]
  const keys = Object.keys(record) as (keyof T)[]
  return computed(() => {
    const literals = {} as RemoveSignals<T>
    for (const key of keys) {
      literals[key] = Value.get(record[key]) as ValueType<T[typeof key]>
    }
    return fn(literals)
  }, signals)
}

/**
 * Merges a record of signals and literals into a single signal.
 *
 * @typeParam T - The type of the record containing signals and literals.
 * @param options - The record containing signals and literals.
 * @returns - The merged signal.
 * @public
 */
export const merge = <T extends Record<string, Value<unknown>>>(
  options: T
): Signal<{ [K in keyof T]: ValueType<T[K]> }> =>
  computedRecord(options, v => v as { [K in keyof T]: ValueType<T[K]> })

/**
 * Delays the value of a signal by a specified amount of time.
 *
 * @typeParam T - The type of the signal value.
 * @param signal - The signal to delay.
 * @param ms - The amount of time to delay the signal in milliseconds.
 * @returns - The delayed signal.
 * @public
 */
export const delaySignal = <T>(
  signal: Signal<T>,
  ms: number | ((value: T) => number)
): Signal<T> => {
  const newSignal = prop(signal.get())
  let timeout: ReturnType<typeof setTimeout> | null = null
  // Use noAutoDispose because we're explicitly managing the lifecycle via newSignal.onDispose
  const dispose = signal.on(
    value => {
      if (timeout != null) clearTimeout(timeout)
      timeout = setTimeout(
        () => {
          timeout = null
          newSignal.set(value)
        },
        typeof ms === 'function' ? ms(value) : ms
      )
    },
    { noAutoDispose: true }
  )
  newSignal.onDispose(() => {
    dispose()
    /* c8 ignore next 2 */
    if (timeout != null) clearTimeout(timeout)
  })
  return newSignal
}

/**
 * Creates a signal that emits the previous value of the input signal.
 *
 * @typeParam T - The type of the signal value.
 * @param signal - The input signal.
 * @returns - The signal that emits the previous value of the input signal.
 * @public
 */
export const previousSignal = <T>(signal: Signal<T>): Signal<T | undefined> => {
  let previous: T | undefined = undefined
  return signal.map(v => {
    const current = previous
    previous = v
    return current
  })
}

/**
 * Creates a signal that emits a sliding window of values from the input signal.
 *
 * @typeParam T - The type of the signal value.
 * @param options - The options for the sliding window.
 * @returns - The signal that emits the sliding window of values.
 * @public
 */
export const slidingWindowSignal = <T>({
  size = undefined,
  signal,
}: {
  size: number | undefined
  signal: Signal<T>
}) => {
  const values = [] as T[]
  return signal.map(v => {
    values.push(v)
    if (size != null && values.length > size) {
      values.shift()
    }
    return values.slice()
  })
}

/**
 * Binds a function or signal of a function to a set of signals and literals.
 *
 * @typeParam FN - The type of the function to bind.
 * @typeParam R - The return type of the function.
 * @param fn - The function to bind.
 * @returns - A function that takes a set of signals and literals and returns a computed signal.
 * @public
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const bind = <FN extends (...args: any[]) => R, R = ReturnType<FN>>(
  fn: Value<FN>
) => {
  return (...args: Values<Parameters<FN>>): Computed<R> => {
    return computedOf(
      fn as Value<FN>,
      ...args
    )((f, ...rest): R => (f as FN)(...rest))
  }
}

export function coalesce<L>(
  ...args: readonly [...unknown[], L]
): Computed<ValueType<L>> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return computedOf(...(args as any))((...xs: any[]) => {
    for (const x of xs) if (x != null) return x
    return undefined
  }) as Computed<ValueType<L>>
}

/**
 * Options for synchronizing a prop across browser tabs.
 *
 * @typeParam T - The type of the prop value.
 * @public
 */
export type SyncPropOptions<T> = {
  /**
   * The channel name to use for synchronization.
   * Props with the same channel name will be synchronized across tabs.
   */
  channel: string
  /**
   * A function that serializes a value of type `T` to a string.
   * The default implementation uses `JSON.stringify`.
   */
  serialize?: (v: T) => string
  /**
   * A function that deserializes a string to a value of type `T`.
   * The default implementation uses `JSON.parse`.
   */
  deserialize?: (v: string) => T
  /**
   * A function that compares two values of type `T` for equality.
   * The default implementation uses strict equality (`===`).
   */
  equals?: (a: T, b: T) => boolean
}

/**
 * Synchronizes a prop across browser tabs using BroadcastChannel.
 * When the prop value changes in one tab, all other tabs with the same channel will be updated.
 *
 * @typeParam T - The type of the prop value.
 * @param propToSync - The prop to synchronize across tabs.
 * @param options - The synchronization options.
 * @returns A disposal function to stop synchronization.
 * @public
 *
 * @example
 * ```ts
 * const counter = prop(0)
 * const dispose = syncProp(counter, { channel: 'my-counter' })
 * // Now when counter changes in this tab, it will update in all other tabs
 * // and vice versa
 * ```
 */
export const syncProp = <T>(
  propToSync: Prop<T>,
  {
    channel: channelName,
    serialize = JSON.stringify,
    deserialize = JSON.parse,
    equals = strictEquals as (a: T, b: T) => boolean,
  }: SyncPropOptions<T>
): (() => void) => {
  const windowRef = getWindow() as Window & {
    BroadcastChannel?: typeof BroadcastChannel
  }

  // If BroadcastChannel is not available, return a no-op disposal function
  if (typeof windowRef?.BroadcastChannel !== 'function') {
    return () => {}
  }

  const channel = new windowRef.BroadcastChannel!(
    `tempo:syncProp:${channelName}`
  )
  const instanceId = `${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2)}`

  let syncingFromChannel = false

  // Listen for messages from other tabs
  const handleMessage = (
    event: MessageEvent<{
      value: string
      sourceId?: string
    }>
  ) => {
    const data = event.data
    if (
      data == null ||
      typeof data !== 'object' ||
      typeof data.value !== 'string' ||
      (data.sourceId != null && data.sourceId === instanceId)
    ) {
      return
    }

    try {
      syncingFromChannel = true
      const nextValue = deserialize(data.value)
      if (!equals(propToSync.get(), nextValue)) {
        propToSync.set(nextValue)
      }
    } catch (error) {
      console.warn(
        `Failed to sync prop for channel "${channelName}" via BroadcastChannel`,
        error
      )
    } finally {
      syncingFromChannel = false
    }
  }

  channel.addEventListener('message', handleMessage)

  // Broadcast changes to other tabs
  const disposeListener = propToSync.on((value, previousValue) => {
    if (
      !syncingFromChannel &&
      previousValue !== undefined &&
      !equals(value, previousValue)
    ) {
      try {
        const serialized = serialize(value)
        channel.postMessage({
          value: serialized,
          sourceId: instanceId,
        })
      } catch (error) {
        console.warn(
          `Failed to serialize prop for channel "${channelName}" via BroadcastChannel`,
          error
        )
      }
    }
  })

  // Return disposal function
  const dispose = () => {
    disposeListener()
    channel.removeEventListener('message', handleMessage)
    channel.close()
  }

  propToSync.onDispose(dispose)

  return dispose
}

/**
 * Creates a computed signal that emits true if all input signals are true.
 *
 * @param args - The input signals.
 * @returns - The computed signal.
 * @public
 */
export function and(...args: Value<boolean>[]) {
  return computedOf(...args)((...values) => values.every(v => v))
}

/**
 * Creates a computed signal that emits true if any input signal is true.
 *
 * @param args - The input signals.
 * @returns - The computed signal.
 * @public
 */
export function or(...args: Value<boolean>[]) {
  return computedOf(...args)((...values) => values.some(v => v))
}

/**
 * Creates a signal or value that is the boolean negation of the input.
 * If the input is a Signal, returns a mapped Signal. If it is a literal, returns the negated value.
 *
 * @param arg - A boolean value or signal.
 * @returns The negated value or signal.
 * @public
 */
export function not(arg: Value<boolean>) {
  return Value.map(arg, v => !v)
}

/**
 * Creates a signal or value that is `true` when the input is not `null` or `undefined`.
 * If the input is a Signal, returns a mapped Signal. If it is a literal, returns the boolean result.
 *
 * @typeParam T - The type of the input value.
 * @param arg - A value or signal to check.
 * @returns A value or signal that emits `true` when the input is not nil.
 * @public
 */
export function notNil<T>(arg: Value<T>) {
  return Value.map(arg, v => v != null)
}

/**
 * Creates a signal or value that is `true` when the input is not empty.
 * If the input is a Signal, returns a mapped Signal. If it is a literal, returns the boolean result.
 *
 * @typeParam T - The type of the input value.
 * @param arg - A value or signal to check.
 * @returns A value or signal that emits `true` when the input is not empty.
 * @public
 */
export function notEmpty<T extends { length: number }>(arg: Value<T>) {
  return Value.map(arg, v => v.length > 0)
}

/**
 * Creates a signal or value that is `true` when the input is not `0`.
 * If the input is a Signal, returns a mapped Signal. If it is a literal, returns the boolean result.
 *
 * @param arg - A number value or signal.
 * @returns A value or signal that emits `true` when the input is not `0`.
 * @public
 */
export function notZero(arg: Value<number>) {
  return Value.map(arg, v => v !== 0)
}

/**
 * Creates a signal that throttles the input signal, emitting at most once per interval.
 * The first change is emitted immediately, then subsequent changes within the interval
 * are batched — the most recent value is emitted when the interval expires.
 *
 * @typeParam T - The type of the signal value.
 * @param signal - The input signal to throttle.
 * @param ms - The minimum interval between emissions in milliseconds.
 * @returns A new signal that emits throttled values.
 * @public
 */
export const throttleSignal = <T>(signal: Signal<T>, ms: number): Signal<T> => {
  const newSignal = prop(signal.get())
  let timeout: ReturnType<typeof setTimeout> | null = null
  let lastEmit = 0
  let pending: { value: T } | null = null

  const dispose = signal.on(
    value => {
      const now = Date.now()
      const elapsed = now - lastEmit

      if (elapsed >= ms) {
        lastEmit = now
        newSignal.set(value)
      } else {
        pending = { value }
        if (timeout == null) {
          timeout = setTimeout(() => {
            timeout = null
            if (pending != null) {
              lastEmit = Date.now()
              newSignal.set(pending.value)
              pending = null
            }
          }, ms - elapsed)
        }
      }
    },
    { skipInitial: true, noAutoDispose: true }
  )

  newSignal.onDispose(() => {
    dispose()
    if (timeout != null) clearTimeout(timeout)
  })

  return newSignal
}

/**
 * Creates a signal that only emits when the value changes according to the
 * provided equality function. Useful downstream of `.map()` chains where
 * a transformation may produce the same output for different inputs.
 *
 * @typeParam T - The type of the signal value.
 * @param signal - The input signal.
 * @param equals - Equality function to compare consecutive values. Defaults to `===`.
 * @returns A new signal that skips consecutive equal values.
 * @public
 */
export const distinctUntilChanged = <T>(
  signal: Signal<T>,
  equals: (a: T, b: T) => boolean = strictEquals
): Signal<T> => {
  const newSignal = prop(signal.get(), equals)

  const dispose = signal.on(
    value => {
      newSignal.set(value)
    },
    { skipInitial: true, noAutoDispose: true }
  )

  newSignal.onDispose(dispose)

  return newSignal
}

/**
 * Creates a signal that accumulates values over time using a reducer function,
 * similar to `Array.reduce` but reactive. Each time the source signal changes,
 * the reducer is called with the current accumulator and the new value.
 *
 * @example
 * ```typescript
 * const clicks = prop(0)
 * const total = accumulateSignal(clicks, (sum, n) => sum + n, 0)
 * clicks.set(5)  // total.value === 5
 * clicks.set(3)  // total.value === 8
 * ```
 *
 * @typeParam T - The type of the source signal values.
 * @typeParam A - The type of the accumulated value.
 * @param signal - The source signal.
 * @param reducer - Function that takes the accumulator and the new value, returns the next accumulator.
 * @param initial - The initial accumulator value.
 * @param equals - Equality function for the accumulator. Defaults to `===`.
 * @returns A new signal that emits the accumulated value.
 * @public
 */
export const accumulateSignal = <T, A>(
  signal: Signal<T>,
  reducer: (acc: A, value: T) => A,
  initial: A,
  equals: (a: A, b: A) => boolean = strictEquals
): Signal<A> => {
  let acc = reducer(initial, signal.get())
  const newSignal = prop(acc, equals)

  const dispose = signal.on(
    value => {
      acc = reducer(acc, value)
      newSignal.set(acc)
    },
    { skipInitial: true, noAutoDispose: true }
  )

  newSignal.onDispose(dispose)

  return newSignal
}

/**
 * Creates an O(1) selection primitive. Instead of creating a computed per item
 * that ALL re-evaluate when the source changes, only the previously-selected
 * and newly-selected items are notified.
 *
 * @typeParam T - The type of the selection key.
 * @param source - The signal containing the currently selected value.
 * @param equals - Equality function. Defaults to `===`.
 * @returns A function that takes a key and returns a `Signal<boolean>` that is
 *          `true` when that key matches the current source value.
 * @public
 *
 * @example
 * ```typescript
 * const selected = prop(0)
 * const isSelected = createSelector(selected)
 *
 * // Each call returns a Signal<boolean> that only updates
 * // when this specific key becomes or stops being selected
 * const isItem1 = isSelected(1) // Signal<false>
 * const isItem2 = isSelected(2) // Signal<false>
 *
 * selected.set(1) // isItem1 -> true, isItem2 unchanged
 * selected.set(2) // isItem1 -> false, isItem2 -> true
 * ```
 */
export const createSelector = <T>(
  source: Signal<T>,
  equals: (a: T, b: T) => boolean = strictEquals
): ((key: T) => Signal<boolean>) => {
  const subscribers = new Map<T, Set<Prop<boolean>>>()
  let currentValue = source.get()

  source.on(
    next => {
      const prev = currentValue
      currentValue = next

      // Deselect previous
      const prevSubs = subscribers.get(prev)
      if (prevSubs) {
        for (const p of prevSubs) p.set(false)
      }

      // Select new
      const nextSubs = subscribers.get(next)
      if (nextSubs) {
        for (const p of nextSubs) p.set(true)
      }
    },
    { skipInitial: true, noAutoDispose: true }
  )

  return (key: T): Signal<boolean> => {
    const result = prop(equals(key, currentValue))

    // Register with current disposal scope for automatic cleanup
    getCurrentScope()?.onDispose(() => result.dispose())

    let subs = subscribers.get(key)
    if (!subs) {
      subs = new Set()
      subscribers.set(key, subs)
    }
    subs.add(result)

    result.onDispose(() => {
      const s = subscribers.get(key)
      if (s) {
        s.delete(result)
        if (s.size === 0) subscribers.delete(key)
      }
    })

    return result
  }
}
