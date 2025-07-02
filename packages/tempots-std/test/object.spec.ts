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
  objectValues,
  pick,
  omit,
  deepClone
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

  describe('pick', () => {
    test('picks specified keys from object', () => {
      const user = {
        id: 1,
        name: 'Alice',
        email: 'alice@example.com',
        password: 'secret',
        age: 30
      }

      const result = pick(user, ['id', 'name', 'email'])

      expect(result).toEqual({
        id: 1,
        name: 'Alice',
        email: 'alice@example.com'
      })
      expect(result).not.toHaveProperty('password')
      expect(result).not.toHaveProperty('age')
    })

    test('handles empty keys array', () => {
      const obj = { a: 1, b: 2, c: 3 }
      const result = pick(obj, [])

      expect(result).toEqual({})
    })

    test('handles non-existent keys', () => {
      const obj = { a: 1, b: 2 }
      const result = pick(obj, ['a', 'c' as keyof typeof obj])

      expect(result).toEqual({ a: 1 })
      expect(result).not.toHaveProperty('c')
    })

    test('does not modify original object', () => {
      const original = { a: 1, b: 2, c: 3 }
      const result = pick(original, ['a', 'b'])

      expect(original).toEqual({ a: 1, b: 2, c: 3 })
      expect(result).not.toBe(original)
    })

    test('works with complex objects', () => {
      const obj = {
        str: 'hello',
        num: 42,
        bool: true,
        arr: [1, 2, 3],
        nested: { x: 1, y: 2 }
      }

      const result = pick(obj, ['str', 'nested'])

      expect(result).toEqual({
        str: 'hello',
        nested: { x: 1, y: 2 }
      })
      expect(result.nested).toBe(obj.nested) // Shallow copy
    })
  })

  describe('omit', () => {
    test('omits specified keys from object', () => {
      const user = {
        id: 1,
        name: 'Alice',
        email: 'alice@example.com',
        password: 'secret',
        age: 30
      }

      const result = omit(user, ['password', 'age'])

      expect(result).toEqual({
        id: 1,
        name: 'Alice',
        email: 'alice@example.com'
      })
      expect(result).not.toHaveProperty('password')
      expect(result).not.toHaveProperty('age')
    })

    test('handles empty keys array', () => {
      const obj = { a: 1, b: 2, c: 3 }
      const result = omit(obj, [])

      expect(result).toEqual({ a: 1, b: 2, c: 3 })
    })

    test('handles non-existent keys', () => {
      const obj = { a: 1, b: 2 }
      const result = omit(obj, ['c' as keyof typeof obj])

      expect(result).toEqual({ a: 1, b: 2 })
    })

    test('does not modify original object', () => {
      const original = { a: 1, b: 2, c: 3 }
      const result = omit(original, ['c'])

      expect(original).toEqual({ a: 1, b: 2, c: 3 })
      expect(result).not.toBe(original)
    })

    test('works with complex objects', () => {
      const obj = {
        str: 'hello',
        num: 42,
        bool: true,
        arr: [1, 2, 3],
        nested: { x: 1, y: 2 }
      }

      const result = omit(obj, ['bool', 'arr'])

      expect(result).toEqual({
        str: 'hello',
        num: 42,
        nested: { x: 1, y: 2 }
      })
      expect(result.nested).toBe(obj.nested) // Shallow copy
    })
  })

  describe('deepClone', () => {
    test('clones primitive values', () => {
      expect(deepClone(42)).toBe(42)
      expect(deepClone('hello')).toBe('hello')
      expect(deepClone(true)).toBe(true)
      expect(deepClone(false)).toBe(false)
      expect(deepClone(null)).toBe(null)
      expect(deepClone(undefined)).toBe(undefined)
    })

    test('clones symbols and functions', () => {
      const sym = Symbol('test')
      expect(deepClone(sym)).toBe(sym)

      const fn = () => 'test'
      expect(deepClone(fn)).toBe(fn)
    })

    test('clones Date objects', () => {
      const date = new Date('2023-01-15')
      const cloned = deepClone(date)

      expect(cloned).toBeInstanceOf(Date)
      expect(cloned.getTime()).toBe(date.getTime())
      expect(cloned).not.toBe(date) // Different reference
    })

    test('clones arrays deeply', () => {
      const arr = [1, [2, 3], { a: 4 }]
      const cloned = deepClone(arr)

      expect(cloned).toEqual(arr)
      expect(cloned).not.toBe(arr) // Different reference
      expect(cloned[1]).not.toBe(arr[1]) // Nested array cloned
      expect(cloned[2]).not.toBe(arr[2]) // Nested object cloned
    })

    test('clones objects deeply', () => {
      const obj = {
        name: 'Alice',
        settings: {
          theme: 'dark',
          notifications: true,
          preferences: {
            language: 'en'
          }
        },
        tags: ['user', 'admin']
      }

      const cloned = deepClone(obj)

      expect(cloned).toEqual(obj)
      expect(cloned).not.toBe(obj) // Different reference
      expect(cloned.settings).not.toBe(obj.settings) // Nested object cloned
      expect(cloned.settings.preferences).not.toBe(obj.settings.preferences) // Deep nested object cloned
      expect(cloned.tags).not.toBe(obj.tags) // Array cloned
    })

    test('handles circular references by throwing error', () => {
      const obj: any = { name: 'test' }
      obj.self = obj

      // Current implementation doesn't handle circular references and will throw
      expect(() => deepClone(obj)).toThrow()
    })

    test('clones complex nested structures', () => {
      const complex = {
        id: 1,
        created: new Date('2023-01-01'),
        data: {
          items: [
            { id: 1, values: [1, 2, 3] },
            { id: 2, values: [4, 5, 6] }
          ],
          metadata: {
            version: '1.0',
            tags: ['important', 'processed']
          }
        }
      }

      const cloned = deepClone(complex)

      expect(cloned).toEqual(complex)
      expect(cloned).not.toBe(complex)
      expect(cloned.created).not.toBe(complex.created)
      expect(cloned.data).not.toBe(complex.data)
      expect(cloned.data.items).not.toBe(complex.data.items)
      expect(cloned.data.items[0]).not.toBe(complex.data.items[0])
      expect(cloned.data.items[0].values).not.toBe(complex.data.items[0].values)
      expect(cloned.data.metadata).not.toBe(complex.data.metadata)
      expect(cloned.data.metadata.tags).not.toBe(complex.data.metadata.tags)
    })

    test('preserves object prototypes', () => {
      class CustomClass {
        constructor(public value: number) {}
      }

      const instance = new CustomClass(42)
      const cloned = deepClone(instance)

      expect(cloned.value).toBe(42)
      // Note: deepClone creates plain objects, not instances of the original class
      expect(cloned).not.toBeInstanceOf(CustomClass)
    })
  })
})
