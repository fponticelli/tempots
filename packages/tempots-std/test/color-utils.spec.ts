import { describe, test, expect } from 'vitest'
import {
  equalColors,
  randomColor,
  closestNamedColor,
} from '../src/color-utils'
import { rgb8a } from '../src/color'

describe('equalColors', () => {
  test('should return true for identical colors', () => {
    expect(equalColors(rgb8a(255, 0, 0), rgb8a(255, 0, 0))).toBe(true)
  })

  test('should return false for different colors', () => {
    expect(equalColors(rgb8a(255, 0, 0), rgb8a(0, 255, 0))).toBe(false)
  })

  test('should return true for colors within tolerance', () => {
    expect(equalColors(rgb8a(255, 0, 0), rgb8a(254, 1, 1), 5)).toBe(true)
  })

  test('should return false for colors outside default tolerance', () => {
    expect(equalColors(rgb8a(255, 0, 0), rgb8a(200, 0, 0))).toBe(false)
  })
})

describe('randomColor', () => {
  test('should return a color with space rgb8 by default', () => {
    const c = randomColor()
    expect(c.space).toBe('rgb8')
  })

  test('should return a color with the specified space', () => {
    const c = randomColor('hsl')
    expect(c.space).toBe('hsl')
  })

  test('should always have alpha equal to 1', () => {
    for (let i = 0; i < 10; i++) {
      const c = randomColor()
      expect(c.alpha).toBe(1)
    }
  })
})

describe('closestNamedColor', () => {
  test('should return red for pure red', () => {
    expect(closestNamedColor(rgb8a(255, 0, 0))).toBe('red')
  })

  test('should return green for rgb(0, 128, 0)', () => {
    expect(closestNamedColor(rgb8a(0, 128, 0))).toBe('green')
  })

  test('should return cornflowerblue for rgb(100, 149, 237)', () => {
    expect(closestNamedColor(rgb8a(100, 149, 237))).toBe('cornflowerblue')
  })
})
