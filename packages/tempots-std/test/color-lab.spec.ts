import { describe, test, expect } from 'vitest'
import {
  canParseLab,
  parseLab,
  canParseLch,
  parseLch,
  rgb8aToLaba,
  labaToRgb8a,
  rgb8aToLcha,
  lchaToRgb8a,
  labaToLabString,
  lchaToLchString,
} from '../src/color-lab'
import { rgb8a, laba, lcha } from '../src/color'

describe('canParseLab', () => {
  test('should return true for valid lab strings', () => {
    expect(canParseLab('lab(50 -20 30)')).toBe(true)
    expect(canParseLab('lab(50% -20 30 / 0.5)')).toBe(true)
  })

  test('should return false for invalid strings', () => {
    expect(canParseLab('#ff0000')).toBe(false)
    expect(canParseLab('rgb(0,0,0)')).toBe(false)
    expect(canParseLab('')).toBe(false)
  })
})

describe('parseLab', () => {
  test('should parse lab(50 -20 30)', () => {
    const result = parseLab('lab(50 -20 30)')
    expect(result.l).toBe(50)
    expect(result.a).toBe(-20)
    expect(result.b).toBe(30)
    expect(result.alpha).toBe(1)
  })

  test('should parse lab with percentage lightness and alpha', () => {
    const result = parseLab('lab(50% -20 30 / 0.5)')
    expect(result.l).toBe(50)
    expect(result.a).toBe(-20)
    expect(result.b).toBe(30)
    expect(result.alpha).toBe(0.5)
  })

  test('should throw on invalid input', () => {
    expect(() => parseLab('#ff0000')).toThrow()
    expect(() => parseLab('not a color')).toThrow()
  })
})

describe('canParseLch', () => {
  test('should return true for valid lch strings', () => {
    expect(canParseLch('lch(50 36 326)')).toBe(true)
    expect(canParseLch('lch(50% 36 326 / 0.8)')).toBe(true)
  })

  test('should return false for invalid strings', () => {
    expect(canParseLch('rgb(0,0,0)')).toBe(false)
    expect(canParseLch('#ff0000')).toBe(false)
  })
})

describe('parseLch', () => {
  test('should parse lch(50 36 326)', () => {
    const result = parseLch('lch(50 36 326)')
    expect(result.l).toBe(50)
    expect(result.c).toBe(36)
    expect(result.h).toBe(326)
    expect(result.alpha).toBe(1)
  })

  test('should throw on invalid input', () => {
    expect(() => parseLch('not a color')).toThrow()
  })
})

describe('rgb8aToLaba', () => {
  test('should convert red to LAB', () => {
    const result = rgb8aToLaba(rgb8a(255, 0, 0))
    expect(result.l).toBeCloseTo(53.23, 0)
    expect(result.a).toBeGreaterThan(0)
    expect(result.b).toBeGreaterThan(0)
    expect(result.alpha).toBe(1)
  })

  test('should convert black to LAB', () => {
    const result = rgb8aToLaba(rgb8a(0, 0, 0))
    expect(result.l).toBeCloseTo(0, 0)
    expect(result.a).toBeCloseTo(0, 0)
    expect(result.b).toBeCloseTo(0, 0)
  })

  test('should convert white to LAB', () => {
    const result = rgb8aToLaba(rgb8a(255, 255, 255))
    expect(result.l).toBeCloseTo(100, 0)
  })
})

describe('labaToRgb8a', () => {
  test('should round-trip red through LAB', () => {
    const lab = rgb8aToLaba(rgb8a(255, 0, 0))
    const result = labaToRgb8a(lab)
    expect(result.r).toBeCloseTo(255, 0)
    expect(result.g).toBeCloseTo(0, 0)
    expect(result.b).toBeCloseTo(0, 0)
  })
})

describe('rgb8aToLcha / lchaToRgb8a', () => {
  test('should round-trip red through LCH', () => {
    const lchColor = rgb8aToLcha(rgb8a(255, 0, 0))
    const result = lchaToRgb8a(lchColor)
    expect(result.r).toBeCloseTo(255, 0)
    expect(result.g).toBeCloseTo(0, 0)
    expect(result.b).toBeCloseTo(0, 0)
  })
})

describe('labaToLabString', () => {
  test('should serialize without alpha when alpha is 1', () => {
    expect(labaToLabString(laba(50, -20, 30))).toBe('lab(50 -20 30)')
  })

  test('should serialize with alpha when alpha < 1', () => {
    expect(labaToLabString(laba(50, -20, 30, 0.5))).toBe(
      'lab(50 -20 30 / 0.5)'
    )
  })
})

describe('lchaToLchString', () => {
  test('should serialize without alpha when alpha is 1', () => {
    expect(lchaToLchString(lcha(50, 36, 326))).toBe('lch(50 36 326)')
  })

  test('should serialize with alpha when alpha < 1', () => {
    expect(lchaToLchString(lcha(50, 36, 326, 0.8))).toBe(
      'lch(50 36 326 / 0.8)'
    )
  })
})

describe('round-trip: cornflower blue through LAB', () => {
  test('rgb8a(100, 149, 237) -> rgb8aToLaba -> labaToRgb8a', () => {
    const original = rgb8a(100, 149, 237)
    const lab = rgb8aToLaba(original)
    const result = labaToRgb8a(lab)
    expect(Math.abs(result.r - original.r)).toBeLessThanOrEqual(1)
    expect(Math.abs(result.g - original.g)).toBeLessThanOrEqual(1)
    expect(Math.abs(result.b - original.b)).toBeLessThanOrEqual(1)
  })
})

describe('round-trip: cornflower blue through LCH', () => {
  test('rgb8a(100, 149, 237) -> rgb8aToLcha -> lchaToRgb8a', () => {
    const original = rgb8a(100, 149, 237)
    const lchColor = rgb8aToLcha(original)
    const result = lchaToRgb8a(lchColor)
    expect(Math.abs(result.r - original.r)).toBeLessThanOrEqual(1)
    expect(Math.abs(result.g - original.g)).toBeLessThanOrEqual(1)
    expect(Math.abs(result.b - original.b)).toBeLessThanOrEqual(1)
  })
})
