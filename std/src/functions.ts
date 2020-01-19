import { Fun1, FirstArgument } from './types'

export function compose<A>(): (a: A) => A
export function compose<A, B>(f1: (a: A) => B): (a: A) => B
export function compose<A, B, C>(f1: (a: A) => B, f2: (b: B) => C): (a: A) => C
export function compose<A, B, C, D>(f1: (a: A) => B, f2: (b: B) => C, f3: (c: C) => D): (a: A) => D
export function compose<A, B, C, D, E>(f1: (a: A) => B, f2: (b: B) => C, f3: (c: C) => D, f4: (d: D) => E): (a: A) => E
export function compose<A, B, C, D, E, F>(f1: (a: A) => B, f2: (b: B) => C, f3: (c: C) => D, f4: (d: D) => E, f5: (e: E) => F): (a: A) => F
export function compose<A, B, C, D, E, F, G>
  (f1: (a: A) => B, f2: (b: B) => C, f3: (c: C) => D, f4: (d: D) => E, f5: (e: E) => F, f6: (f: F) => G): (a: A) => G
export function compose<Args extends Fun1<any, any>[]>(...args: Args) {
  return (a: FirstArgument<Args[0]>) => args.reduce((acc, f) => f(acc), a)
}

export const identity = <T>(v: T) => v

export const curryLeft = <A, Rest extends any[], Ret>(f: (a: A, ...rest: Rest) => Ret) =>
  (a: A) => (...rest: Rest): Ret => f(a, ...rest)

export function curryRight<A, B, C, D>
  (f: (a: A, b: B, c: C) => D): (a: A, b: B) => (c: C) => D
export function curryRight<A, B, C, D, E>
  (f: (a: A, b: B, c: C, d: D) => E): (a: A, b: B, c: C) => (d: D) => E
export function curryRight<A, B, C, D, E, F>
  (f: (a: A, b: B, c: C, d: D, e: E) => F): (a: A, b: B, c: C, d: D) => (e: E) => F
export function curryRight<A, B, C, D, E, F, G>
  (f: (a: A, b: B, c: C, d: D, e: E, f: F) => G): (a: A, b: B, c: C, d: D, e: E) => (f: F) => G
export function curryRight<Ret>(f: (...rest: any[]) => Ret) {
  return (...args: any[]) => (a: any): Ret => f(...(args.concat([a])))
}

export function flip<A, B, C>
  (f: (a: A, b: B) => C): (b: B, a: A) => C
export function flip<A, B, C, D>
  (f: (a: A, b: B, c: C) => D): (c: C, b: B, a: A) => D
export function flip<A, B, C, D, E>
  (f: (a: A, b: B, c: C, d: D) => E): (d: D, c: C, b: B, a: A) => E
export function flip<A, B, C, D, E>
  (f: (a: A, b: B, c: C, d: D) => E): (d: D, c: C, b: B, a: A) => E
export function flip<A, B, C, D, E, F>
  (f: (a: A, b: B, c: C, d: D, e: E) => F): (e: E, d: D, c: C, b: B, a: A) => F
export function flip<A, B, C, D, E, F, G>
  (f: (a: A, b: B, c: C, d: D, e: E, f: F) => G): (f: F, e: E, d: D, c: C, b: B, a: A) => G
export function flip<Ret>(f: (...rest: any[]) => Ret) {
  return (...args: any[]) => f(...args.reverse())
}