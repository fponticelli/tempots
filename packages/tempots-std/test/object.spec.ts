import { describe, expect, test } from "vitest";
import {
  isObject,
  sameObjectKeys,
  removeObjectFields,
  mergeObjects,
  isEmptyObject,
  objectEntries,
  objectFromEntries,
  objectKeys,
  objectValues
} from "../src/object";

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

  test('objectKeys extracts keys correctly', () => {
    expect(objectKeys({})).toEqual([])
    expect(objectKeys({ a: 1, b: 2 })).toEqual(['a', 'b'])
    expect(objectKeys({ 1: 'one', 2: 'two' })).toEqual(['1', '2'])
    expect(objectKeys({ x: true, y: false, z: null })).toEqual(['x', 'y', 'z'])
  })

  test('objectValues extracts values correctly', () => {
    expect(objectValues({})).toEqual([])
    expect(objectValues({ a: 1, b: 2 })).toEqual([1, 2])
    expect(objectValues({ x: 'hello', y: 'world' })).toEqual(['hello', 'world'])
    expect(objectValues({ a: true, b: false, c: null })).toEqual([true, false, null])
  })

  test('objectEntries extracts entries correctly', () => {
    expect(objectEntries({})).toEqual([])
    expect(objectEntries({ a: 1, b: 2 })).toEqual([['a', 1], ['b', 2]])
    expect(objectEntries({ x: 'hello', y: 'world' })).toEqual([['x', 'hello'], ['y', 'world']])
    expect(objectEntries({ a: true, b: null })).toEqual([['a', true], ['b', null]])
  })

  test('objectFromEntries creates object from entries', () => {
    expect(objectFromEntries([])).toEqual({})
    expect(objectFromEntries([['a', 1], ['b', 2]])).toEqual({ a: 1, b: 2 })
    expect(objectFromEntries([['x', 'hello'], ['y', 'world']])).toEqual({ x: 'hello', y: 'world' })
    expect(objectFromEntries([['a', true], ['b', false]])).toEqual({ a: true, b: false })
  })

  test('removeObjectFields removes specified fields', () => {
    const obj = { a: 1, b: 2, c: 3, d: 4 }

    expect(removeObjectFields(obj, 'a')).toEqual({ b: 2, c: 3, d: 4 })
    expect(removeObjectFields(obj, 'a', 'c')).toEqual({ b: 2, d: 4 })
    expect(removeObjectFields(obj, 'b', 'd')).toEqual({ a: 1, c: 3 })
    expect(removeObjectFields(obj)).toEqual({ a: 1, b: 2, c: 3, d: 4 })

    // Original object should not be modified
    expect(obj).toEqual({ a: 1, b: 2, c: 3, d: 4 })
  })

  test('removeObjectFields with empty object', () => {
    expect(removeObjectFields({}, 'a' as never)).toEqual({})
    expect(removeObjectFields({})).toEqual({})
  })

  test('removeObjectFields with non-existent fields', () => {
    const obj = { a: 1, b: 2 }
    expect(removeObjectFields(obj, 'c' as any)).toEqual({ a: 1, b: 2 })
    expect(removeObjectFields(obj, 'a', 'c' as any)).toEqual({ b: 2 })
  })

  test('mergeObjects combines two objects', () => {
    expect(mergeObjects({}, {})).toEqual({})
    expect(mergeObjects({ a: 1 }, { b: 2 })).toEqual({ a: 1, b: 2 })
    expect(mergeObjects({ a: 1, b: 2 }, { c: 3, d: 4 })).toEqual({ a: 1, b: 2, c: 3, d: 4 })

    // Second object should override first object's properties
    expect(mergeObjects({ a: 1, b: 2 }, { b: 3, c: 4 })).toEqual({ a: 1, b: 3, c: 4 })
    expect(mergeObjects({ x: 'old' }, { x: 'new', y: 'added' })).toEqual({ x: 'new', y: 'added' })
  })

  test('mergeObjects does not modify original objects', () => {
    const obj1 = { a: 1, b: 2 }
    const obj2 = { c: 3, d: 4 }
    const merged = mergeObjects(obj1, obj2)

    expect(merged).toEqual({ a: 1, b: 2, c: 3, d: 4 })
    expect(obj1).toEqual({ a: 1, b: 2 })
    expect(obj2).toEqual({ c: 3, d: 4 })
  })

  test('isEmptyObject detects empty objects', () => {
    expect(isEmptyObject({})).toBe(true)
    expect(isEmptyObject({ a: 1 })).toBe(false)
    expect(isEmptyObject({ a: 1, b: 2 })).toBe(false)
    expect(isEmptyObject({ x: undefined })).toBe(false)
    expect(isEmptyObject({ y: null })).toBe(false)
    expect(isEmptyObject({ z: false })).toBe(false)
  })

  test('object functions work with complex types', () => {
    const complexObj = {
      str: 'hello',
      num: 42,
      bool: true,
      arr: [1, 2, 3],
      nested: { x: 1, y: 2 },
      fn: () => 'test',
      nullVal: null,
      undefinedVal: undefined
    }

    const keys = objectKeys(complexObj)
    expect(keys).toContain('str')
    expect(keys).toContain('nested')
    expect(keys).toContain('fn')

    const values = objectValues(complexObj)
    expect(values).toContain('hello')
    expect(values).toContain(42)
    expect(values).toContain(true)

    const entries = objectEntries(complexObj)
    expect(entries).toContainEqual(['str', 'hello'])
    expect(entries).toContainEqual(['num', 42])
    expect(entries).toContainEqual(['bool', true])

    expect(isEmptyObject(complexObj)).toBe(false)
    expect(sameObjectKeys(complexObj, complexObj)).toBe(true)
  })
})
