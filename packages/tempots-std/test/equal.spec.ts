import { describe, expect, test } from "vitest";
import { strictEqual, deepEqual, looseEqual } from '../src/equal'

describe('equals', () => {
  test('strictEqual with number', () => {
    expect(strictEqual(1, 1)).toBe(true)
    expect(strictEqual(0, 0)).toBe(true)
    expect(strictEqual(-1, -1)).toBe(true)

    expect(strictEqual(Math.E, Math.E)).toBe(true)
    expect(strictEqual(Math.LN10, Math.LN10)).toBe(true)
    expect(strictEqual(Math.LN2, Math.LN2)).toBe(true)
    expect(strictEqual(Math.LOG10E, Math.LOG10E)).toBe(true)
    expect(strictEqual(Math.PI, Math.PI)).toBe(true)
    expect(strictEqual(Math.SQRT1_2, Math.SQRT1_2)).toBe(true)
    expect(strictEqual(Math.SQRT2, Math.SQRT2)).toBe(true)

    expect(strictEqual(Infinity, Infinity)).toBe(true)
    expect(strictEqual(-Infinity, -Infinity)).toBe(true)
    expect(strictEqual(NaN, NaN)).toBe(true)

    expect(strictEqual(-Infinity, Infinity)).toBe(false)
    expect(strictEqual(-1, 1)).toBe(false)
  })

  test('strictEqual with string', () => {
    expect(strictEqual('', '')).toBe(true)
    expect(strictEqual('a', 'a')).toBe(true)

    expect(strictEqual('A', 'a')).toBe(false)
  })

  test('strictEqual with date', () => {
    const a = new Date('2020-01-02')
    const b = new Date('2020-01-02')
    expect(strictEqual(a, a)).toBe(true)
    expect(strictEqual(a, b)).toBe(false)
  })

  test('deepEqual with number', () => {
    expect(deepEqual(1, 1)).toBe(true)
    expect(deepEqual(0, 0)).toBe(true)
    expect(deepEqual(-1, -1)).toBe(true)

    expect(deepEqual(Math.E, Math.E)).toBe(true)
    expect(deepEqual(Math.LN10, Math.LN10)).toBe(true)
    expect(deepEqual(Math.LN2, Math.LN2)).toBe(true)
    expect(deepEqual(Math.LOG10E, Math.LOG10E)).toBe(true)
    expect(deepEqual(Math.PI, Math.PI)).toBe(true)
    expect(deepEqual(Math.SQRT1_2, Math.SQRT1_2)).toBe(true)
    expect(deepEqual(Math.SQRT2, Math.SQRT2)).toBe(true)

    expect(deepEqual(Infinity, Infinity)).toBe(true)
    expect(deepEqual(-Infinity, -Infinity)).toBe(true)
    expect(deepEqual(NaN, NaN)).toBe(true)

    expect(deepEqual(-Infinity, Infinity)).toBe(false)
    expect(deepEqual(-1, 1)).toBe(false)
  })

  test('deepEqual with string', () => {
    expect(deepEqual('', '')).toBe(true)
    expect(deepEqual('a', 'a')).toBe(true)

    expect(deepEqual('A', 'a')).toBe(false)
  })

  test('deepEqual with date', () => {
    const a = new Date('2020-01-01')
    const b = new Date('2020-01-01')
    const c = new Date('2020-01-02')
    expect(deepEqual(a, a)).toBe(true)
    expect(deepEqual(a, b)).toBe(true)
    expect(deepEqual(a, c)).toBe(false)
  })

  test('deepEqual with arrays', () => {
    const a = [1, 'a']
    const b = [1, 'a']
    const c = [1, 2]
    expect(deepEqual(a, a)).toBe(true)
    expect(deepEqual(a, b)).toBe(true)
    expect(deepEqual(a, c)).toBe(false)
  })

  test('deepEqual with objects', () => {
    const a = { a: 1, b: 'b' }
    const b = { a: 1, b: 'b' }
    const c = { a: 1, b: 2 } as never
    const d = { a: 1, b: 'b', c: undefined }
    const e = { a: 1, b: 'b', c: undefined }
    const f = { a: 1, b: 'b', c: null } as Record<string, unknown>
    expect(deepEqual(a, a)).toBe(true)
    expect(deepEqual(a, b)).toBe(true)
    expect(deepEqual(a, c)).toBe(false)
    expect(deepEqual(a, d)).toBe(false)
    expect(deepEqual(f, e)).toBe(false)
    expect(deepEqual(f, { ...f } as never)).toBe(true)
  })

  test('deepEqual with deep structures', () => {
    const get = () => ({
      a: 1,
      b: {
        c: undefined,
        d: '1',
        e: new Date('2020-01-01'),
        f: [1, { g: true }]
      }
    })

    expect(deepEqual(get(), get())).toBe(true)
  })

  test('deepEqual with Set', () => {
    const get = () => new Set([1, 2, 3])
    const get2 = () => new Set([1, 2, 4])

    expect(deepEqual(get(), get())).toBe(true)
    expect(deepEqual(get(), get2())).toBe(false)
  })

  test('deepEqual with Map', () => {
    const get = () => {
      const map = new Map()
      map.set(1, 'a')
      map.set(2, 'b')
      map.set(3, 'c')
      return map
    }
    const get2 = () => {
      const map = new Map()
      map.set(1, 'a')
      map.set(2, 'b')
      map.set(3, 'd')
      return map
    }

    expect(deepEqual(get(), get())).toBe(true)
    expect(deepEqual(get(), get2())).toBe(false)
  })

  test('looseEqual matches expectations', () => {
    expect(looseEqual(1, 1)).toBe(true)
    expect(looseEqual(1, 0)).toBe(false)
    expect(looseEqual(null, null)).toBe(true)
    expect(looseEqual(null, undefined)).toBe(true)
    expect(looseEqual(null, '')).toBe(false)
    expect(looseEqual(null, 0)).toBe(false)
    expect(looseEqual('', 0 as unknown as string)).toBe(true)
  })

  describe('Edge cases and special values', () => {
    test('strictEqual handles special number values', () => {
      expect(strictEqual(0, -0)).toBe(true)
      expect(strictEqual(-0, 0)).toBe(true)
      expect(strictEqual(NaN, NaN)).toBe(true)
      expect(strictEqual(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY)).toBe(true)
      expect(strictEqual(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY)).toBe(true)
      expect(strictEqual(Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY)).toBe(false)
    })

    test('strictEqual with null and undefined', () => {
      expect(strictEqual(null, null)).toBe(true)
      expect(strictEqual(undefined, undefined)).toBe(true)
      expect(strictEqual(null, undefined)).toBe(false)
      expect(strictEqual(undefined, null)).toBe(false)
    })

    test('strictEqual with boolean values', () => {
      expect(strictEqual(true, true)).toBe(true)
      expect(strictEqual(false, false)).toBe(true)
      expect(strictEqual(true, false)).toBe(false)
      expect(strictEqual(false, true)).toBe(false)
    })

    test('deepEqual handles null and undefined correctly', () => {
      expect(deepEqual(null, null)).toBe(true)
      expect(deepEqual(undefined, undefined)).toBe(true)
      expect(deepEqual(null, undefined)).toBe(false)
      expect(deepEqual(undefined, null)).toBe(false)

      // Objects with null/undefined values
      expect(deepEqual({ a: null }, { a: null })).toBe(true)
      expect(deepEqual({ a: undefined }, { a: undefined })).toBe(true)
      expect(deepEqual({ a: null }, { a: undefined })).toBe(false)
    })

    test('deepEqual with empty structures', () => {
      expect(deepEqual([], [])).toBe(true)
      expect(deepEqual({}, {})).toBe(true)
      expect(deepEqual(new Set(), new Set())).toBe(true)
      expect(deepEqual(new Map(), new Map())).toBe(true)

      // Empty vs non-empty
      expect(deepEqual([], [1])).toBe(false)
      expect(deepEqual({}, { a: 1 })).toBe(false)
      expect(deepEqual(new Set(), new Set([1]))).toBe(false)
      expect(deepEqual(new Map(), new Map([['a', 1]]))).toBe(false)
    })

    test('deepEqual with nested null/undefined', () => {
      const obj1 = { a: { b: null, c: undefined } }
      const obj2 = { a: { b: null, c: undefined } }
      const obj3 = { a: { b: undefined, c: null } }

      expect(deepEqual(obj1, obj2)).toBe(true)
      expect(deepEqual(obj1, obj3)).toBe(false)
    })

    test('deepEqual with circular references limitation', () => {
      // The current implementation doesn't handle circular references
      // and will cause a stack overflow. This test documents this limitation.
      const obj1: any = { a: 1 }
      obj1.self = obj1

      const obj2: any = { a: 1 }
      obj2.self = obj2

      // This will throw a RangeError due to maximum call stack size exceeded
      expect(() => deepEqual(obj1, obj2)).toThrow('Maximum call stack size exceeded')
    })

    test('deepEqual with different object types', () => {
      expect(deepEqual([], {})).toBe(false)
      expect(deepEqual({}, [])).toBe(false)
      expect(deepEqual(new Date(), {})).toBe(false)
      expect(deepEqual(new Set(), new Map())).toBe(false)
      expect(deepEqual(new Map(), new Set())).toBe(false)
      expect(deepEqual('string', {})).toBe(false)
      expect(deepEqual(42, {})).toBe(false)
    })

    test('deepEqual with complex nested structures', () => {
      const complex1 = {
        array: [1, 2, { nested: true }],
        date: new Date('2023-01-01'),
        set: new Set([1, 2, 3]),
        map: new Map([['key', 'value']]),
        nested: {
          deep: {
            value: 'test'
          }
        }
      }

      const complex2 = {
        array: [1, 2, { nested: true }],
        date: new Date('2023-01-01'),
        set: new Set([1, 2, 3]),
        map: new Map([['key', 'value']]),
        nested: {
          deep: {
            value: 'test'
          }
        }
      }

      const complex3 = {
        array: [1, 2, { nested: false }], // Different nested value
        date: new Date('2023-01-01'),
        set: new Set([1, 2, 3]),
        map: new Map([['key', 'value']]),
        nested: {
          deep: {
            value: 'test'
          }
        }
      }

      expect(deepEqual(complex1, complex2)).toBe(true)
      expect(deepEqual(complex1, complex3)).toBe(false)
    })

    test('looseEqual with type coercion', () => {
      expect(looseEqual('1', 1 as unknown as string)).toBe(true)
      expect(looseEqual('0', 0 as unknown as string)).toBe(true)
      expect(looseEqual('', 0 as unknown as string)).toBe(true)
      expect(looseEqual(false, 0 as unknown as boolean)).toBe(true)
      expect(looseEqual(true, 1 as unknown as boolean)).toBe(true)
      expect(looseEqual(null, undefined)).toBe(true)
      expect(looseEqual(undefined, null)).toBe(true)

      // Cases where loose equality returns false
      expect(looseEqual('1', 2 as unknown as string)).toBe(false)
      expect(looseEqual('hello', 0 as unknown as string)).toBe(false)
      expect(looseEqual(null, 0)).toBe(false)
      expect(looseEqual(undefined, 0)).toBe(false)
      expect(looseEqual(null, '')).toBe(false)
      expect(looseEqual(undefined, '')).toBe(false)
    })
  })

  describe('Performance and edge cases', () => {
    test('deepEqual with large arrays', () => {
      const large1 = new Array(1000).fill(0).map((_, i) => i)
      const large2 = new Array(1000).fill(0).map((_, i) => i)
      const large3 = new Array(1000).fill(0).map((_, i) => i === 999 ? i + 1 : i)

      expect(deepEqual(large1, large2)).toBe(true)
      expect(deepEqual(large1, large3)).toBe(false)
    })

    test('deepEqual with large objects', () => {
      const large1: Record<string, number> = {}
      const large2: Record<string, number> = {}
      const large3: Record<string, number> = {}

      for (let i = 0; i < 100; i++) {
        large1[`key${i}`] = i
        large2[`key${i}`] = i
        large3[`key${i}`] = i === 99 ? i + 1 : i
      }

      expect(deepEqual(large1, large2)).toBe(true)
      expect(deepEqual(large1, large3)).toBe(false)
    })

    test('deepEqual with Sets containing objects', () => {
      const set1 = new Set([{ a: 1 }, { b: 2 }])
      const set2 = new Set([{ a: 1 }, { b: 2 }])
      const set3 = new Set([{ a: 1 }, { b: 3 }])

      // Note: Current implementation uses Set.has() which uses SameValueZero
      // so objects with same content but different references won't be equal
      expect(deepEqual(set1, set2)).toBe(false) // Different object references
      expect(deepEqual(set1, set3)).toBe(false)

      // Same references should work
      const obj = { a: 1 }
      const set4 = new Set([obj])
      const set5 = new Set([obj])
      expect(deepEqual(set4, set5)).toBe(true)
    })

    test('deepEqual with Maps containing objects', () => {
      const map1 = new Map([['key1', { a: 1 }], ['key2', { b: 2 }]])
      const map2 = new Map([['key1', { a: 1 }], ['key2', { b: 2 }]])
      const map3 = new Map([['key1', { a: 1 }], ['key2', { b: 3 }]])

      expect(deepEqual(map1, map2)).toBe(true) // Values are compared with deepEqual
      expect(deepEqual(map1, map3)).toBe(false)
    })

    test('functions are compared by reference', () => {
      const fn1 = () => 'test'
      const fn2 = () => 'test'
      const fn3 = fn1

      expect(strictEqual(fn1, fn1)).toBe(true)
      expect(strictEqual(fn1, fn2)).toBe(false) // Different function objects
      expect(strictEqual(fn1, fn3)).toBe(true) // Same reference

      expect(deepEqual(fn1, fn1)).toBe(true)
      expect(deepEqual(fn1, fn2)).toBe(false)
      expect(deepEqual(fn1, fn3)).toBe(true)
    })
  })
})
