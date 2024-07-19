import { RemoveSignals, Value } from '../types/domain'
import { guessInterpolate } from './interpolate'
import {
  AnySignal,
  useComputed,
  Computed,
  useProp,
  Prop,
  Signal,
} from './signal'

export class MemoryStore {
  private readonly _store: Map<string, string> = new Map()
  getItem = (key: string): string | null => {
    return this._store.get(key) ?? null
  }
  setItem = (key: string, value: string): void => {
    this._store.set(key, value)
  }
}

export function storedProp<T>({
  key,
  defaultValue,
  store,
  serialize = JSON.stringify,
  deserialize = JSON.parse,
  equals = (a, b) => a === b,
  onLoad = value => value,
}: {
  key: string
  defaultValue: T | (() => T)
  store: {
    getItem: (key: string) => string | null
    setItem: (key: string, value: string) => void
  }
  // istanbul ignore next
  serialize?: (v: T) => string
  // istanbul ignore next
  deserialize?: (v: string) => T
  // istanbul ignore next
  equals?: (a: T, b: T) => boolean
  onLoad?: (value: T) => T
}): Prop<T> {
  const initialValue = store.getItem(key)
  const prop = new Prop<T>(
    initialValue != null
      ? onLoad(deserialize(initialValue))
      : typeof defaultValue === 'function'
        ? (defaultValue as () => T)()
        : defaultValue,
    equals
  )
  prop.on(value => {
    store.setItem(key, serialize(value))
  })
  return prop
}

export function localStorageProp<T>(options: {
  key: string
  defaultValue: T | (() => T)
  // istanbul ignore next
  serialize?: (v: T) => string
  // istanbul ignore next
  deserialize?: (v: string) => T
  // istanbul ignore next
  equals?: (a: T, b: T) => boolean
  onLoad?: (value: T) => T
}): Prop<T> {
  return storedProp({
    ...options,
    store: window?.localStorage ?? new MemoryStore(),
  })
}

export function sessionStorageProp<T>(options: {
  key: string
  defaultValue: T | (() => T)
  // istanbul ignore next
  serialize?: (v: T) => string
  // istanbul ignore next
  deserialize?: (v: string) => T
  // istanbul ignore next
  equals?: (a: T, b: T) => boolean
  onLoad?: (value: T) => T
}): Prop<T> {
  return storedProp({
    ...options,
    store: window?.sessionStorage ?? new MemoryStore(),
  })
}

function raf(fn: FrameRequestCallback) {
  if (typeof requestAnimationFrame === 'function') {
    return requestAnimationFrame(fn)
  } else {
    return setTimeout(fn, 0)
  }
}

export function animateSignals<T>(
  initialValue: T,
  fn: () => T,
  dependencies: Array<AnySignal>,
  options?: {
    interpolate?: (start: T, end: T, delta: number) => T
    duration?: Value<number>
    easing?: (t: number) => number
    equals?: (a: T, b: T) => boolean
  }
) {
  // istanbul ignore next
  const duration = options?.duration ?? 300
  const easing = options?.easing ?? (t => t)
  const equals = options?.equals ?? ((a, b) => a === b)
  let interpolate = options?.interpolate
  let startValue = initialValue
  let endValue = fn()
  let startTime = performance.now()
  let animationFrame: number | null = null
  let done = true
  const computed = new Computed(fn, equals)
  const animated = useProp(initialValue, equals)
  animated.onDispose(() => {
    if (animationFrame !== null) cancelAnimationFrame(animationFrame)
  })
  animated.onDispose(computed.dispose)
  dependencies.forEach(signal => {
    signal.setDerivative(computed)
    signal.onDispose(animated.dispose)
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
    const delta = (now - startTime) / Signal.unwrap(duration)
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

export function animateSignal<T>(
  signal: Signal<T>,
  options?: {
    initialValue?: T
    interpolate?: (start: T, end: T, delta: number) => T
    duration?: number
    easing?: (t: number) => number
    equals?: (a: T, b: T) => boolean
  }
) {
  // istanbul ignore next
  const { initialValue, ...rest } = options ?? {}
  // istanbul ignore next
  return animateSignals(
    initialValue ?? signal.get(),
    signal.get,
    [signal],
    rest
  )
}

export function computedRecord<T extends Record<string, Value<unknown>>, U>(
  record: T,
  fn: (value: RemoveSignals<T>) => U
) {
  type RSignal = [string | number | symbol, Signal<unknown>]
  type RSignals = RSignal[]
  type RLiterals = RemoveSignals<T>
  type R = { signals: RSignals; literals: RLiterals }
  const { signals, literals } = Object.entries(record).reduce(
    ({ signals, literals }, [key, value]) => {
      if (Signal.is(value)) {
        signals.push([key, value] as RSignal)
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(literals as any)[key] = value
      }
      return { signals, literals }
    },
    { signals: [], literals: {} as RemoveSignals<T> } as R
  )
  const signalsArray = signals.map(([, s]) => s)
  return useComputed(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    signals.forEach(([key, sig]) => ((literals as any)[key] = sig.value))
    return fn(literals)
  }, signalsArray)
}
