import { describe, expect, test, vi } from "vitest";
import { identity, curryLeft, memoize, compose, pipe, partial, flip, once, negate } from '../src/function'

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

  describe('compose', () => {
    test('composes functions right to left', () => {
      const add = (a: number, b: number) => a + b
      const double = (x: number) => x * 2
      const square = (x: number) => x * x

      const composed = compose(square, double, add)
      const result = composed(2, 3) // square(double(add(2, 3))) = square(double(5)) = square(10) = 100

      expect(result).toBe(100)
    })

    test('works with single function', () => {
      const double = (x: number) => x * 2
      const composed = compose(double)

      expect(composed(5)).toBe(10)
    })

    test('returns identity for no functions', () => {
      const composed = compose()
      expect(composed(42)).toBe(42)
    })
  })

  describe('pipe', () => {
    test('pipes value through functions left to right', () => {
      const add5 = (x: number) => x + 5
      const double = (x: number) => x * 2
      const square = (x: number) => x * x

      const result = pipe(3, add5, double, square) // square(double(add5(3))) = square(double(8)) = square(16) = 256

      expect(result).toBe(256)
    })

    test('works with single function', () => {
      const double = (x: number) => x * 2
      const result = pipe(5, double)

      expect(result).toBe(10)
    })

    test('returns original value for no functions', () => {
      const result = pipe(42)
      expect(result).toBe(42)
    })
  })

  describe('partial', () => {
    test('partially applies function arguments', () => {
      const add = (a: number, b: number, c: number) => a + b + c
      const add5And10 = partial(add, 5, 10)
      const result = add5And10(3)

      expect(result).toBe(18) // 5 + 10 + 3
    })

    test('works with single partial argument', () => {
      const multiply = (a: number, b: number) => a * b
      const double = partial(multiply, 2)

      expect(double(5)).toBe(10)
    })

    test('works with no partial arguments', () => {
      const add = (a: number, b: number) => a + b
      const same = partial(add)

      expect(same(3, 4)).toBe(7)
    })
  })

  describe('flip', () => {
    test('reverses all arguments for two-argument function', () => {
      const divide = (a: number, b: number) => a / b
      const flippedDivide = flip(divide)

      expect(divide(10, 2)).toBe(5)
      expect(flippedDivide(2, 10)).toBe(5) // Same result, but arguments reversed
    })

    test('reverses all arguments for three-argument function', () => {
      const subtract = (a: number, b: number, c: number) => a - b - c
      const flippedSubtract = flip(subtract)

      expect(subtract(10, 3, 2)).toBe(5) // 10 - 3 - 2 = 5
      expect(flippedSubtract(2, 3, 10)).toBe(5) // 10 - 3 - 2 = 5 (arguments reversed)
    })

    test('reverses all arguments for four-argument function', () => {
      const calculate = (a: number, b: number, c: number, d: number) => a + b - c * d
      const flippedCalculate = flip(calculate)

      expect(calculate(10, 5, 3, 2)).toBe(9) // 10 + 5 - 3 * 2 = 9
      expect(flippedCalculate(2, 3, 5, 10)).toBe(9) // 10 + 5 - 3 * 2 = 9 (arguments reversed)
    })

    test('works with string operations', () => {
      const concat = (a: string, b: string, c: string) => a + b + c
      const flippedConcat = flip(concat)

      expect(concat('hello', ' ', 'world')).toBe('hello world')
      expect(flippedConcat('world', ' ', 'hello')).toBe('hello world') // Arguments reversed
    })

    test('works with single argument function', () => {
      const double = (x: number) => x * 2
      const flippedDouble = flip(double)

      expect(double(5)).toBe(10)
      expect(flippedDouble(5)).toBe(10) // No change for single argument
    })

    test('works with no arguments function', () => {
      const getValue = () => 42
      const flippedGetValue = flip(getValue)

      expect(getValue()).toBe(42)
      expect(flippedGetValue()).toBe(42) // No change for no arguments
    })

    test('preserves function behavior with complex operations', () => {
      // Test with array operations where order matters
      const arrayOp = (arr: number[], index: number, value: number) => {
        const result = [...arr]
        result[index] = value
        return result
      }
      const flippedArrayOp = flip(arrayOp)

      const original = [1, 2, 3]
      expect(arrayOp(original, 1, 99)).toEqual([1, 99, 3])
      expect(flippedArrayOp(99, 1, original)).toEqual([1, 99, 3]) // Arguments reversed
    })
  })

  describe('once', () => {
    test('ensures function is called at most once', () => {
      let counter = 0
      const increment = once(() => ++counter)

      expect(increment()).toBe(1)
      expect(increment()).toBe(1) // Same result, function not called again
      expect(increment()).toBe(1)
      expect(counter).toBe(1) // Function only called once
    })

    test('works with functions that take arguments', () => {
      let lastArgs: any[] = []
      const recordArgs = once((...args: any[]) => {
        lastArgs = args
        return args.join(',')
      })

      expect(recordArgs('a', 'b', 'c')).toBe('a,b,c')
      expect(recordArgs('x', 'y', 'z')).toBe('a,b,c') // Same result
      expect(lastArgs).toEqual(['a', 'b', 'c']) // Only first call recorded
    })
  })

  describe('negate', () => {
    test('creates negated predicate', () => {
      const isEven = (n: number) => n % 2 === 0
      const isOdd = negate(isEven)

      expect(isEven(4)).toBe(true)
      expect(isOdd(4)).toBe(false)
      expect(isOdd(3)).toBe(true)
      expect(isEven(3)).toBe(false)
    })

    test('works with multiple arguments', () => {
      const isInRange = (value: number, min: number, max: number) => value >= min && value <= max
      const isOutOfRange = negate(isInRange)

      expect(isInRange(5, 1, 10)).toBe(true)
      expect(isOutOfRange(5, 1, 10)).toBe(false)
      expect(isOutOfRange(15, 1, 10)).toBe(true)
    })
  })
})
