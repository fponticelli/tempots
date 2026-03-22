import { describe, test, expect } from 'vitest'
import { colorDistanceSimple, colorDistance } from '../src/color-distance'
import { rgb8a } from '../src/color'

describe('colorDistanceSimple', () => {
  test('should return 0 for identical colors', () => {
    const red = rgb8a(255, 0, 0)
    expect(colorDistanceSimple(red, red)).toBe(0)
  })

  test('should return a positive value for different colors', () => {
    expect(colorDistanceSimple(rgb8a(255, 0, 0), rgb8a(0, 0, 0))).toBeGreaterThan(0)
  })

  test('should be symmetric', () => {
    const a = rgb8a(255, 0, 0)
    const b = rgb8a(0, 128, 255)
    expect(colorDistanceSimple(a, b)).toBeCloseTo(colorDistanceSimple(b, a), 10)
  })
})

describe('colorDistance', () => {
  test('should return 0 for identical colors', () => {
    const green = rgb8a(0, 255, 0)
    expect(colorDistance(green, green)).toBe(0)
  })

  test('should return a positive value for different colors', () => {
    expect(colorDistance(rgb8a(255, 0, 0), rgb8a(0, 255, 0))).toBeGreaterThan(0)
  })

  test('should return approximately 100 for black vs white', () => {
    const black = rgb8a(0, 0, 0)
    const white = rgb8a(255, 255, 255)
    const distance = colorDistance(black, white)
    expect(distance).toBeGreaterThan(95)
    expect(distance).toBeLessThan(105)
  })

  test('should be symmetric', () => {
    const a = rgb8a(255, 0, 0)
    const b = rgb8a(0, 255, 0)
    expect(colorDistance(a, b)).toBeCloseTo(colorDistance(b, a), 10)
  })
})
