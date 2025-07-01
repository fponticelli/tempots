import { describe, expect, test, vi } from "vitest";
import { identity, curryLeft, memoize } from '../src/function'

describe('Function utilities', () => {
  describe('identity', () => {
    test('returns the input value unchanged', () => {
      expect(identity(1)).toBe(1)
      expect(identity('a')).toBe('a')
      expect(identity(true)).toBe(true)
      expect(identity(null)).toBe(null)
      expect(identity(undefined)).toBe(undefined)
    })

    test('works with objects and arrays', () => {
      const obj = { a: 1, b: 2 }
      const arr = [1, 2, 3]

      expect(identity(obj)).toBe(obj)
      expect(identity(arr)).toBe(arr)
    })

    test('works with functions', () => {
      const fn = () => 'test'
      expect(identity(fn)).toBe(fn)
      expect(identity(fn)()).toBe('test')
    })

    test('preserves type information', () => {
      // These tests verify TypeScript type preservation
      const num: number = identity(42)
      const str: string = identity('hello')
      const bool: boolean = identity(true)

      expect(num).toBe(42)
      expect(str).toBe('hello')
      expect(bool).toBe(true)
    })
  })

  describe('curryLeft', () => {
    test('curries a two-argument function', () => {
      const add = (a: number, b: number) => a + b
      const curriedAdd = curryLeft(add)
      const add5 = curriedAdd(5)

      expect(add5(3)).toBe(8)
      expect(add5(10)).toBe(15)
    })

    test('curries a three-argument function', () => {
      const sum3 = (a: number, b: number, c: number) => a + b + c
      const curriedSum = curryLeft(sum3)
      const sumWith10 = curriedSum(10)

      expect(sumWith10(5, 3)).toBe(18)
      expect(sumWith10(1, 2)).toBe(13)
    })

    test('curries a function with mixed argument types', () => {
      const format = (prefix: string, num: number, suffix: string) => `${prefix}${num}${suffix}`
      const curriedFormat = curryLeft(format)
      const formatWithPrefix = curriedFormat('Value: ')

      expect(formatWithPrefix(42, '!')).toBe('Value: 42!')
      expect(formatWithPrefix(100, ' units')).toBe('Value: 100 units')
    })

    test('works with functions that have no additional arguments', () => {
      const greet = (name: string) => `Hello, ${name}!`
      const curriedGreet = curryLeft(greet)
      const greetJohn = curriedGreet('John')

      expect(greetJohn()).toBe('Hello, John!')
    })

    test('preserves function behavior', () => {
      const multiply = (a: number, b: number, c: number) => a * b * c
      const curriedMultiply = curryLeft(multiply)
      const multiplyBy2 = curriedMultiply(2)

      expect(multiplyBy2(3, 4)).toBe(24)
      expect(multiply(2, 3, 4)).toBe(24) // Same result as original
    })

    test('can be chained for multiple currying', () => {
      const sum4 = (a: number, b: number, c: number, d: number) => a + b + c + d
      const curriedSum = curryLeft(sum4)
      const sumWith1 = curriedSum(1)
      const curriedAgain = curryLeft(sumWith1)
      const sumWith1And2 = curriedAgain(2)

      expect(sumWith1And2(3, 4)).toBe(10)
    })
  })

  describe('memoize', () => {
    test('caches the result of a function', () => {
      const expensiveFunction = vi.fn(() => 42)
      const memoized = memoize(expensiveFunction)

      // First call should execute the function
      expect(memoized()).toBe(42)
      expect(expensiveFunction).toHaveBeenCalledTimes(1)

      // Second call should return cached result
      expect(memoized()).toBe(42)
      expect(expensiveFunction).toHaveBeenCalledTimes(1)

      // Third call should still return cached result
      expect(memoized()).toBe(42)
      expect(expensiveFunction).toHaveBeenCalledTimes(1)
    })

    test('works with functions returning different types', () => {
      const stringFunction = vi.fn(() => 'hello')
      const objectFunction = vi.fn(() => ({ value: 42 }))
      const arrayFunction = vi.fn(() => [1, 2, 3])

      const memoizedString = memoize(stringFunction)
      const memoizedObject = memoize(objectFunction)
      const memoizedArray = memoize(arrayFunction)

      expect(memoizedString()).toBe('hello')
      expect(memoizedObject()).toEqual({ value: 42 })
      expect(memoizedArray()).toEqual([1, 2, 3])

      // Verify caching
      expect(stringFunction).toHaveBeenCalledTimes(1)
      expect(objectFunction).toHaveBeenCalledTimes(1)
      expect(arrayFunction).toHaveBeenCalledTimes(1)

      // Call again to verify caching
      expect(memoizedString()).toBe('hello')
      expect(memoizedObject()).toEqual({ value: 42 })
      expect(memoizedArray()).toEqual([1, 2, 3])

      expect(stringFunction).toHaveBeenCalledTimes(1)
      expect(objectFunction).toHaveBeenCalledTimes(1)
      expect(arrayFunction).toHaveBeenCalledTimes(1)
    })

    test('returns the same reference for object results', () => {
      const obj = { value: 42 }
      const objectFunction = vi.fn(() => obj)
      const memoized = memoize(objectFunction)

      const result1 = memoized()
      const result2 = memoized()

      expect(result1).toBe(obj)
      expect(result2).toBe(obj)
      expect(result1).toBe(result2) // Same reference
      expect(objectFunction).toHaveBeenCalledTimes(1)
    })

    test('handles functions with side effects', () => {
      let counter = 0
      const sideEffectFunction = vi.fn(() => {
        counter++
        return counter
      })
      const memoized = memoize(sideEffectFunction)

      // First call executes the function and side effect
      expect(memoized()).toBe(1)
      expect(counter).toBe(1)
      expect(sideEffectFunction).toHaveBeenCalledTimes(1)

      // Second call returns cached result, no side effect
      expect(memoized()).toBe(1)
      expect(counter).toBe(1) // Counter unchanged
      expect(sideEffectFunction).toHaveBeenCalledTimes(1)
    })

    test('works with computationally expensive functions', () => {
      let callCount = 0
      const expensiveFunction = vi.fn(() => {
        callCount++
        // Simulate expensive computation
        let result = 0
        for (let i = 0; i < 1000; i++) {
          result += Math.sqrt(i)
        }
        return result
      })

      const memoized = memoize(expensiveFunction)

      const result1 = memoized()
      const result2 = memoized()

      expect(result1).toBe(result2)
      expect(callCount).toBe(1) // Function should only be called once
      expect(expensiveFunction).toHaveBeenCalledTimes(1)
    })

    test('different memoized functions have separate caches', () => {
      const fn1 = vi.fn(() => 'first')
      const fn2 = vi.fn(() => 'second')

      const memoized1 = memoize(fn1)
      const memoized2 = memoize(fn2)

      expect(memoized1()).toBe('first')
      expect(memoized2()).toBe('second')

      expect(fn1).toHaveBeenCalledTimes(1)
      expect(fn2).toHaveBeenCalledTimes(1)

      // Call again
      expect(memoized1()).toBe('first')
      expect(memoized2()).toBe('second')

      expect(fn1).toHaveBeenCalledTimes(1)
      expect(fn2).toHaveBeenCalledTimes(1)
    })
  })

  describe('Integration and edge cases', () => {
    test('functions can be composed together', () => {
      const add = (a: number, b: number) => a + b
      const curriedAdd = curryLeft(add)
      const add10 = curriedAdd(10)
      const memoizedAdd10 = memoize(() => add10(5))

      expect(memoizedAdd10()).toBe(15)
      expect(memoizedAdd10()).toBe(15) // Cached
    })

    test('identity can be used with curryLeft', () => {
      const applyIdentity = (fn: <T>(x: T) => T, value: string) => fn(value)
      const curriedApply = curryLeft(applyIdentity)
      const applyIdentityToValue = curriedApply(identity)

      expect(applyIdentityToValue('test')).toBe('test')
    })

    test('memoize works with functions returning identity results', () => {
      const getValue = vi.fn(() => identity(42))
      const memoized = memoize(getValue)

      expect(memoized()).toBe(42)
      expect(memoized()).toBe(42)
      expect(getValue).toHaveBeenCalledTimes(1)
    })
  })
})
