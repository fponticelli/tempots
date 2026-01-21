import { describe, expect, test } from 'vitest'
import {
  interpolateNumber,
  interpolateString,
  interpolateDate,
  endInterpolate,
  guessInterpolate,
} from '../src/interpolate'

describe('interpolateNumber', () => {
  test('should interpolate between two numbers at delta 0', () => {
    expect(interpolateNumber(0, 100, 0)).toBe(0)
  })

  test('should interpolate between two numbers at delta 1', () => {
    expect(interpolateNumber(0, 100, 1)).toBe(100)
  })

  test('should interpolate between two numbers at delta 0.5', () => {
    expect(interpolateNumber(0, 100, 0.5)).toBe(50)
  })

  test('should interpolate between two numbers at delta 0.25', () => {
    expect(interpolateNumber(0, 100, 0.25)).toBe(25)
  })

  test('should handle negative numbers', () => {
    expect(interpolateNumber(-100, 100, 0.5)).toBe(0)
    expect(interpolateNumber(-50, -10, 0.5)).toBe(-30)
  })

  test('should handle floating point numbers', () => {
    expect(interpolateNumber(0.5, 1.5, 0.5)).toBeCloseTo(1.0)
    expect(interpolateNumber(1.1, 2.2, 0.5)).toBeCloseTo(1.65)
  })

  test('should handle same start and end', () => {
    expect(interpolateNumber(50, 50, 0.5)).toBe(50)
  })

  test('should handle delta beyond 0-1 range', () => {
    expect(interpolateNumber(0, 100, 1.5)).toBe(150)
    expect(interpolateNumber(0, 100, -0.5)).toBe(-50)
  })
})

describe('interpolateString', () => {
  test('should interpolate between two strings at delta 0', () => {
    expect(interpolateString('aaa', 'zzz', 0)).toBe('aaa')
  })

  test('should interpolate between two strings at delta 1', () => {
    expect(interpolateString('aaa', 'zzz', 1)).toBe('zzz')
  })

  test('should interpolate between two strings at delta 0.5', () => {
    // 'a' (97) to 'z' (122), midpoint is about 109 which is 'm'
    const result = interpolateString('aaa', 'zzz', 0.5)
    expect(result.length).toBe(3)
    // All characters should be approximately in the middle
    expect(result.charCodeAt(0)).toBeCloseTo(109, 0)
  })

  test('should handle different length strings', () => {
    // When strings have different lengths, uses 'a' (97) as fallback
    const result = interpolateString('ab', 'xyz', 0)
    expect(result.length).toBe(3)
    expect(result).toBe('aba') // 'a', 'b', then 'a' (fallback) interpolated to 'x'
  })

  test('should handle empty strings', () => {
    const result = interpolateString('', 'abc', 0.5)
    expect(result.length).toBe(3)
    // All interpolate from 'a' (97) to the target characters
  })

  test('should handle same strings', () => {
    expect(interpolateString('hello', 'hello', 0.5)).toBe('hello')
  })
})

describe('interpolateDate', () => {
  test('should interpolate between two dates at delta 0', () => {
    const start = new Date('2020-01-01')
    const end = new Date('2020-12-31')
    const result = interpolateDate(start, end, 0)
    expect(result.getTime()).toBe(start.getTime())
  })

  test('should interpolate between two dates at delta 1', () => {
    const start = new Date('2020-01-01')
    const end = new Date('2020-12-31')
    const result = interpolateDate(start, end, 1)
    expect(result.getTime()).toBe(end.getTime())
  })

  test('should interpolate between two dates at delta 0.5', () => {
    const start = new Date('2020-01-01T00:00:00Z')
    const end = new Date('2020-01-03T00:00:00Z')
    const result = interpolateDate(start, end, 0.5)
    expect(result.toISOString()).toBe('2020-01-02T00:00:00.000Z')
  })

  test('should handle same start and end dates', () => {
    const date = new Date('2020-06-15')
    const result = interpolateDate(date, date, 0.5)
    expect(result.getTime()).toBe(date.getTime())
  })

  test('should handle dates in reverse order', () => {
    const start = new Date('2020-12-31')
    const end = new Date('2020-01-01')
    const result = interpolateDate(start, end, 0.5)
    // Should be halfway between, going backwards
    const expected = new Date((start.getTime() + end.getTime()) / 2)
    expect(result.getTime()).toBe(expected.getTime())
  })
})

describe('endInterpolate', () => {
  test('should always return end value', () => {
    expect(endInterpolate(0, 100, 0)).toBe(100)
    expect(endInterpolate(0, 100, 0.5)).toBe(100)
    expect(endInterpolate(0, 100, 1)).toBe(100)
  })

  test('should work with any type', () => {
    expect(endInterpolate('start', 'end', 0)).toBe('end')
    expect(endInterpolate({ a: 1 }, { b: 2 }, 0)).toEqual({ b: 2 })
    expect(endInterpolate([1], [2, 3], 0)).toEqual([2, 3])
  })
})

describe('guessInterpolate', () => {
  test('should return interpolateNumber for numbers', () => {
    const interpolate = guessInterpolate(42)
    expect(interpolate(0, 100, 0.5)).toBe(50)
  })

  test('should return interpolateString for strings', () => {
    const interpolate = guessInterpolate('hello')
    const result = interpolate('aaa', 'zzz', 0)
    expect(result).toBe('aaa')
  })

  test('should return interpolateDate for dates', () => {
    const interpolate = guessInterpolate(new Date())
    const start = new Date('2020-01-01')
    const end = new Date('2020-01-03')
    const result = interpolate(start, end, 0.5)
    expect(result instanceof Date).toBe(true)
  })

  test('should return endInterpolate for other types', () => {
    const interpolate = guessInterpolate({ complex: 'object' })
    const result = interpolate({ a: 1 }, { b: 2 }, 0)
    expect(result).toEqual({ b: 2 })
  })

  test('should return endInterpolate for arrays', () => {
    const interpolate = guessInterpolate([1, 2, 3])
    const result = interpolate([1], [2, 3, 4], 0)
    expect(result).toEqual([2, 3, 4])
  })

  test('should return endInterpolate for booleans', () => {
    const interpolate = guessInterpolate(true)
    expect(interpolate(false, true, 0)).toBe(true)
  })

  test('should return endInterpolate for null', () => {
    const interpolate = guessInterpolate(null)
    expect(interpolate('a', 'b', 0)).toBe('b')
  })
})
