/**
 * Utility functions to manipulate `Array` values.
 */

import type { Compare, Maybe, Nothing, Primitive } from './domain'
import { keys } from './object'

export function map<A, B>(arr: A[], f: (a: A, index: number) => B): B[] {
  return Array.from({ length: arr.length }, (_, i) => f(arr[i], i))
}

export function mapNotNull<A, B>(
  arr: A[],
  f: (a: A, index: number) => B | Nothing
): B[] {
  const buff = [] as B[]
  for (let i = 0; i < arr.length; i++) {
    const v = f(arr[i], i)
    if (v != null) {
      buff.push(v)
    }
  }
  return buff
}

export function flatMap<A, B>(arr: A[], f: (a: A) => B[]): B[] {
  const buff: B[] = []
  for (const el of arr) {
    buff.push(...f(el))
  }
  return buff
}

export function head<A>(arr: A[]): Maybe<A> {
  return arr.length > 0 ? arr[0] : undefined
}

export function tail<A>(arr: A[]): A[] {
  return arr.slice(1)
}

export function equals<T>(
  a: T[],
  b: T[],
  equality: (a: T, b: T) => boolean
): boolean {
  if (a.length !== b.length) return false
  else {
    for (let i = 0; i < a.length; i++) {
      if (!equality(a[i], b[i])) return false
    }
    return true
  }
}

export function makeEquals<T>(equality: (a: T, b: T) => boolean) {
  return function (a: T[], b: T[]) {
    return equals(a, b, equality)
  }
}

export function isEmpty<T>(arr: T[]): arr is [] {
  return arr.length === 0
}

export function hasValues<T>(arr: T[]): arr is [T, ...T[]] {
  return arr.length > 0
}

export function filter<T>(arr: T[], predicate: (v: T) => boolean): T[] {
  const buff = [] as T[]
  for (const a of arr) if (predicate(a)) buff.push(a)
  return buff
}

export function filterMap<A, B>(
  arr: A[],
  f: (a: A, index: number) => Maybe<B>
): B[] {
  const buff = [] as B[]
  for (let i = 0; i < arr.length; i++) {
    const v = f(arr[i], i)
    if (v != null) {
      buff.push(v)
    }
  }
  return buff
}

export function filterNulls<T>(arr: Array<T | Nothing>): T[] {
  return filter(arr, v => v != null) as T[]
}

export function flatten<T>(arr: T[][]): T[] {
  return ([] as T[]).concat(...arr)
}

export function foldLeft<T, B>(arr: T[], f: (acc: B, curr: T) => B, b: B): B {
  for (const a of arr) {
    b = f(b, a)
  }
  return b
}

export function all<T>(arr: T[], predicate: (v: T) => boolean): boolean {
  for (const a of arr) {
    if (!predicate(a)) {
      return false
    }
  }
  return true
}

export function any<T>(arr: T[], predicate: (v: T) => boolean): boolean {
  for (const a of arr) {
    if (predicate(a)) {
      return true
    }
  }
  return false
}

export function each<T>(arr: T[], f: (v: T) => void): void {
  for (const a of arr) f(a)
}

export function concat<A>(...arrs: A[][]): A[] {
  return ([] as A[]).concat(...arrs)
}

export function makeCompare<A>(comparef: Compare<A>, shorterFirst = true) {
  return function (a: A[], b: A[]) {
    if (a.length < b.length) {
      return -1 * (shorterFirst ? 1 : -1)
    } else if (a.length > b.length) {
      return 1 * (shorterFirst ? 1 : -1)
    }
    for (let i = 0; i < a.length; i++) {
      const ord = comparef(a[i], b[i])
      if (ord !== 0) return ord
    }
    return 0
  }
}

export function sort<A>(compare: Compare<A>, arr: A[]): A[] {
  return arr.slice().sort(compare)
}

export function range<A>(length: number, f: (index: number) => A): A[] {
  return Array.from({ length }, (_, i) => f(i))
}

export function numbersRange(length: number, startAt = 0): number[] {
  return range(length, i => startAt + i)
}

export function fill<A>(length: number, value: A): A[] {
  return range(length, () => value)
}

export function distinctPrimitive<T extends Primitive>(values: T[]): T[] {
  return Array.from(new Set(values))
}

export function distinctByPredicate<T>(
  values: T[],
  predicate: (a: T) => string
): T[] {
  const map: Record<string, T> = {}
  values.forEach(v => {
    map[predicate(v)] = v
  })
  return keys(map).map(k => map[k])
}

export function remove<A>(arr: A[], item: A): boolean {
  const index = arr.indexOf(item)
  if (index < 0) {
    return false
  } else {
    arr.splice(index, 1)
    return true
  }
}

export function removeByPredicate<A>(
  arr: A[],
  predicate: (a: A) => boolean
): boolean {
  const index = arr.findIndex(predicate)
  if (index < 0) {
    return false
  } else {
    arr.splice(index, 1)
    return true
  }
}

export function ofIterableIterator<A>(it: IterableIterator<A>): A[] {
  const buff = [] as A[]
  for (let r = it.next(); !(r.done ?? false); r = it.next()) {
    buff.push(r.value)
  }
  return buff
}

export interface DiffOperations<T> {
  removals: Array<{ at: number; qt: number }>
  swaps: Array<{ from: number; to: number }>
  inserts: Array<{ at: number; values: T[] }>
}

export function diffOperations<T, K>(
  from: T[],
  to: T[],
  getKey: (v: T) => K
): DiffOperations<T> {
  const ops: DiffOperations<T> = {
    removals: [],
    swaps: [],
    inserts: [],
  }
  const { removals, inserts, swaps } = ops
  const mapB = new Map<K, number>()
  to.forEach((v, i) => mapB.set(getKey(v), i))

  const indexesOfAThatDoNotExistInB = from
    .map((v, i) => [v, i] as const)
    .filter(([v]) => !mapB.has(getKey(v)))
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .map(([_, i]) => i)
  for (let i = indexesOfAThatDoNotExistInB.length - 1; i >= 0; i--) {
    const p = indexesOfAThatDoNotExistInB[i]
    const last = removals.length > 0 ? removals[removals.length - 1] : undefined
    if (last != null && last.at === p + 1) {
      last.at--
      last.qt++
    } else {
      removals.push({ at: p, qt: 1 })
    }
  }

  const mapA = new Map<K, number>()
  from.forEach((v, i) => mapA.set(getKey(v), i))

  const indexesOfBThatDoNotExistInA = to
    .map((v, i) => [v, i] as const)
    .filter(([v]) => !mapA.has(getKey(v)))
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .map(([_, i]) => i)
  for (const p of indexesOfBThatDoNotExistInA) {
    const last = inserts.length > 0 ? inserts[inserts.length - 1] : undefined
    if (last != null && last.at + last.values.length === p) {
      last.values.push(to[p])
    } else {
      inserts.push({ at: p, values: [to[p]] })
    }
  }

  const ra = from.filter((_, i) => !indexesOfAThatDoNotExistInB.includes(i))
  const mapRA = new Map<K, number>()
  for (let i = 0; i < ra.length; i++) {
    mapRA.set(getKey(ra[i]), i)
  }

  const rb = to.filter((_, i) => !indexesOfBThatDoNotExistInA.includes(i))
  for (let i = 0; i < rb.length; i++) {
    const bk = getKey(rb[i])

    const ai = mapRA.get(bk)!
    if (ai == null || i === ai) continue
    const ak = getKey(ra[i])
    mapRA.delete(ak)
    swaps.push({ from: i, to: ai })
  }
  return ops
}

export function applyOperations<T>(
  operations: DiffOperations<T>,
  start: T[]
): T[] {
  const buff = [...start]
  for (const { at, qt } of operations.removals) {
    buff.splice(at, qt)
  }
  for (const { from, to } of operations.swaps) {
    const t = buff[to]
    buff[to] = buff[from]
    buff[from] = t
  }
  for (const op of operations.inserts) {
    buff.splice(op.at, 0, ...op.values)
  }
  return buff
}

export function joinWithConjunction<A>(
  arr: A[],
  conjunction = ' and ',
  separator = ', '
): string {
  if (arr.length === 0) return ''
  if (arr.length === 1) return String(arr[0])
  return `${arr.slice(0, -1).join(separator)}${conjunction}${String(arr[arr.length - 1])}`
}

export function rank<T>(
  array: T[],
  compare: (a: T, b: T) => number,
  incrementDuplicates = true
): number[] {
  const arr = array.map((v, i): [T, number] => [v, i])
  arr.sort((a, b) => compare(a[0], b[0]))
  const ranks = new Array<number>(arr.length)
  let rank = 0
  let last = arr[0][0]
  for (let i = 0; i < arr.length; i++) {
    const [v, index] = arr[i]
    if (compare(v, last) !== 0) {
      rank = i
      last = v
    }
    ranks[index] = rank
    if (incrementDuplicates) rank++
  }
  return ranks
}
