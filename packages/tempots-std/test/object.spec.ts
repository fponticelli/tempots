import { describe, expect, test } from "vitest";
import { isObject, sameObjectKeys } from "../src/object";

describe('objects helpers', () => {
  test('sameObjectKeys works as expected', () => {
    expect(sameObjectKeys({}, {})).toBe(true)
    expect(sameObjectKeys({ a: 1 }, { a: 2 })).toBe(true)
    expect(sameObjectKeys({ a: 1, b: 'c' }, { a: 2, b: true })).toBe(true)
    expect(sameObjectKeys({ a: 1 }, { a: 2, b: true })).toBe(false)
    expect(sameObjectKeys({ a: 1 }, { b: true })).toBe(false)
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
