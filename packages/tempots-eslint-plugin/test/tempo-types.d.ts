// Type definitions for Tempo framework (for testing purposes only)

export interface Signal<T> {
  value: T
  map<U>(fn: (value: T) => U): Signal<U>
  filter(fn: (value: T) => boolean): Signal<T>
  dispose(): void
}

export interface Prop<T> extends Signal<T> {
  value: T
}

export interface Computed<T> extends Signal<T> {
  readonly value: T
}

export interface ReadonlySignal<T> {
  readonly value: T
  map<U>(fn: (value: T) => U): ReadonlySignal<U>
  filter(fn: (value: T) => boolean): ReadonlySignal<T>
}

export type Renderable = any
export type Value<T> = T | Signal<T>

export declare function prop<T>(value: T): Prop<T>
export declare function computed<T>(fn: () => T, deps: Signal<any>[]): Computed<T>
export declare function computedOf<T extends any[], R>(
  ...signals: [...{ [K in keyof T]: Signal<T[K]> }]
): (fn: (...values: T) => R) => Computed<R>
export declare function effect(fn: () => void, deps: Signal<any>[]): void
export declare function effectOf<T extends any[]>(
  ...signals: [...{ [K in keyof T]: Signal<T[K]> }]
): (fn: (...values: T) => void) => void

export declare const html: {
  div: (...children: Value<any>[]) => Renderable
  span: (...children: Value<any>[]) => Renderable
}

export declare const svg: {
  circle: (...children: Value<any>[]) => Renderable
}

export declare function Fragment(...children: Value<any>[]): Renderable
export declare const Empty: Renderable

declare global {
  const Signal: {
    is(value: any): value is Signal<any>
  }
  const Value: {
    map<T, U>(value: T | Signal<T>, fn: (value: T) => U): U | Signal<U>
  }
}
