/*
Copyright 2019 Google LLC
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    https://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { describe, expect, test } from 'vitest'
import { strictEqual, deepEqual, looseEqual } from '../src/equals'

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

  test(`looseEqual matches expectations`, () => {
    expect(looseEqual(1, 1)).toBe(true)
    expect(looseEqual(1, 0)).toBe(false)
    expect(looseEqual(null, null)).toBe(true)
    expect(looseEqual(null, undefined)).toBe(true)
    expect(looseEqual(null, '')).toBe(false)
    expect(looseEqual(null, 0)).toBe(false)
    expect(looseEqual('', 0 as unknown as string)).toBe(true)
  })
})
