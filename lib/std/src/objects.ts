import { TupleToUnion } from './types/tuples'
import { Merge } from './types/objects'
import { AnyKey } from './types/utility'

export function keys<T extends object>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[]
}

export function sameKeys<T extends object>(a: T, b: T) {
  const ak = keys(a)
  const bk = keys(b)
  if (ak.length !== bk.length) return false
  for (const k of ak) {
    if (!(k in b)) return false
  }
  return true
}

export function isObject(obj: unknown): obj is Record<AnyKey, unknown> {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

export function removeFields<T extends object, F extends (keyof T)[]>(
  ob: T,
  ...fields: F
): Omit<T, TupleToUnion<F>> {
  return keys(ob).reduce((acc: Record<AnyKey, unknown>, key) => {
    if (fields.indexOf(key) < 0) acc[key] = ob[key]
    return acc
  }, {} as Record<keyof T, T[F[number]]>) as Omit<T, TupleToUnion<F>>
}

export function merge<
  A extends Record<AnyKey, unknown>,
  B extends Record<AnyKey, unknown>
>(a: A, b: B): Merge<A, B> {
  return Object.assign({}, a, b) as Merge<A, B>
}

export function isEmpty(obj: object) {
  return (
    obj &&
    Object.keys(obj).length === 0 &&
    Object.getPrototypeOf(obj) === Object.prototype
  )
}
