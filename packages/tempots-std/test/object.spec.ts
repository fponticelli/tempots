import { describe, expect, test } from "vitest";

import { sameKeys, isObject } from '../src/object'

describe('objects helpers', () => {
  test('sameKeys works as expected', () => {
    expect(sameKeys({}, {})).toBe(true)
    expect(sameKeys({ a: 1 }, { a: 2 })).toBe(true)
    expect(sameKeys({ a: 1, b: 'c' }, { a: 2, b: true })).toBe(true)
    expect(sameKeys({ a: 1 }, { a: 2, b: true })).toBe(false)
    expect(sameKeys({ a: 1 }, { b: true })).toBe(false)
  })

  test('isObject behaves as expected', () => {
    expect(isObject({})).toBe(true)
    expect(isObject({ 1: 2 })).toBe(true)
    expect(isObject({ a: 2 })).toBe(true)
    expect(isObject(null)).toBe(false)
    expect(isObject(undefined)).toBe(false)
    expect(isObject(Array.from([1, 2]))).toBe(false)
    expect(isObject('v')).toBe(false)
    expect(isObject(new Date())).toBe(false)
  })
})
