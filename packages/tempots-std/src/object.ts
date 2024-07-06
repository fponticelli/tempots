import { IndexKey, Merge, TupleToUnion } from './domain'

export function keys<T extends object>(obj: T): Array<keyof T> {
  return Object.keys(obj) as Array<keyof T>
}

export function sameKeys<T extends object>(a: T, b: T): boolean {
  const ak = keys(a)
  const bk = keys(b)
  if (ak.length !== bk.length) return false
  for (const k of ak) {
    if (!(k in b)) return false
  }
  return true
}

export function isObject(obj: unknown): obj is Record<IndexKey, unknown> {
  return obj != null && Object.getPrototypeOf(obj) === Object.prototype
}

export function removeFields<T extends object, F extends Array<keyof T>>(
  ob: T,
  ...fields: F
): Omit<T, TupleToUnion<F>> {
  const ks = keys(ob)
  return ks.reduce((acc: Record<IndexKey, unknown>, key) => {
    if (!fields.includes(key)) acc[key] = ob[key]
    return acc
  }, {}) as Omit<T, TupleToUnion<F>>
}

export function merge<
  A extends Record<IndexKey, unknown>,
  B extends Record<IndexKey, unknown>,
>(a: A, b: B): Merge<A, B> {
  return Object.assign({}, a, b) as Merge<A, B>
}

export function isEmpty(obj: object): boolean {
  return obj == null || (isObject(obj) && Object.keys(obj).length === 0)
}
