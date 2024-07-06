export type ArgsToSignals<T extends [...unknown[]]> = T extends [] ? [] : T extends [infer U, ...infer V] ? [Signal<U>, ...ArgsToSignals<V>] : []

const $isSignal = Symbol('isSignal')
const $isProp = Symbol('isProp')

export type Value<T> = T | Signal<T>

export class Signal<T> {

  static of<T>(value: T) {
    return new Signal(value)
  }

  static ofValue<T>(value: Value<T> | null | undefined): Signal<T> | undefined {
    return value == null ? undefined : Signal.wrap(value)
  }

  static wrap<T>(value: T | Signal<T>): Signal<T> {
    return Signal.isSignal<T>(value) ? value : new Signal(value)
  }

  static isSignal<T = unknown>(x: unknown): x is Signal<T> {
    const s = x as Signal<T>
    return s != null && typeof s.get === "function" && typeof s.subscribe === "function"
  }

  /**
   * Combines many into one using a merging function
   */
  static combine<Args extends [...unknown[]], Out>(
    others: ArgsToSignals<Args>,
    f: (...args: Args) => Out
  ): Signal<Out> {
    function getValues(others: Prop<unknown>[]) {
      return others.map(other => other.get()) as Args
    }
    const prop = new Prop(f(...getValues(others)))
    others.forEach((other: Prop<unknown>) => {
      other.subscribe(() => {
        prop.set(f(...getValues(others)))
      })
    })
    return prop
  }

  public readonly [$isSignal] = true

  protected readonly _listeners: ((value: T) => void)[] = []
  constructor(protected _value: T) { }
  readonly get = () => {
    return this._value
  }
  readonly subscribe = (listener: (value: T) => void) => {
    this._listeners.push(listener)
    return () => {
      const index = this._listeners.indexOf(listener)
      if (index >= 0)
        this._listeners.splice(index, 1)
    }
  }

  readonly map = <V>(f: (value: T) => V): Signal<V> => {
    const prop = new Prop(f(this._value))
    this.subscribe(value => prop.set(f(value)))
    return prop
  }

  readonly flatMap = <V>(f: (value: T) => Signal<V>): Signal<V> => {
    let signal = f(this._value)
    const prop = new Prop(signal.get())
    this.subscribe(value => {
      signal.clean()
      signal = f(value)
      signal.subscribe(value => prop.set(value))
    })
    return prop
  }

  readonly tap = (f: (value: T) => void) => {
    f(this._value)
    this.subscribe(f)
    return this
  }

  readonly at = <K extends keyof T>(key: K): Signal<T[K]> => {
    return this.map(value => value[key])
  }

  readonly filter = (predicate: (value: T) => boolean) => {
    const prop = new Prop(this._value)
    this.subscribe(value => {
      if (predicate(value)) {
        prop.set(value)
      }
    })
    return prop
  }

  readonly distinct = (equality: (a: T, b: T) => boolean) => {
    let lastValue = this._value
    return this.filter(value => {
      const result = !equality(value, lastValue)
      lastValue = value
      return result
    })
  }

  readonly mapAsync = <V>(f: (value: T) => Promise<V>, alt: V) => {
    let counter = 0
    const prop = new Prop(alt)
    f(this._value).then(value => {
      if (counter === 0) prop.set(value)
    })
    this.subscribe(value => {
      const matchCounter = ++counter
      f(value).then(value => {
        if (matchCounter === counter)
          prop.set(value)
      })
    })
    return prop
  }

  readonly mapMaybe = <V>(f: (value: T) => V | null | undefined, alt: V) => {
    const prop = new Prop(f(this._value) ?? alt)
    this.subscribe(value => {
      const newValue = f(value)
      if (newValue != null) prop.set(newValue)
    })
    return prop
  }

  readonly combine = <V, Z>(other: Signal<V>, f: (a: T, b: V) => Z): Signal<Z> => {
    const prop = new Prop(f(this._value, other.get()))
    this.subscribe(value => prop.set(f(value, other.get())))
    other.subscribe(value => prop.set(f(this._value, value)))
    return prop
  }

  readonly feed = (prop: Prop<T>): Prop<T> => {
    this.subscribe(value => prop.set(value))
    return prop
  }

  readonly deriveProp = (): Prop<T> => {
    return new Prop(this._value)
  }

  readonly clean = () => {
    this._listeners.length = 0
  }
}

export class Prop<T> extends Signal<T>{
  static isProp<T = unknown>(x: unknown): x is Prop<T> {
    const p = x as Prop<T>
    return Signal.isSignal(x) && typeof p.set === "function"
    // return x != null && (x as Prop<T>)[$isProp] === true
  }

  static override of<T>(value: T) {
    return new Prop(value)
  }

  public readonly [$isProp] = true

  readonly set = (value: T) => {
    if (this._value === value) return
    this._value = value
    this._listeners.forEach(listener => listener(value))
  }

  readonly update = (f: (value: T) => T) => {
    this.set(f(this._value))
  }

  readonly atLens = <K extends keyof T>(key: K): Prop<T[K]> => {
    return this.iso(
      value => value[key],
      value => ({ ...this._value, [key]: value })
    )
  }

  readonly reducer = <V>(f: (state: T, action: V) => T) => {
    return (action: V) => {
      this.set(f(this._value, action))
    }
  }

  readonly iso = <V>(map: (value: T) => V, reverse: (value: V) => T) => {
    const prop = new Prop(map(this._value))
    this.subscribe(value => prop.set(map(value)))
    prop.subscribe(value => this.set(reverse(value)))
    return prop
  }
}
