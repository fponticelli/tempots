import { describe, test, expect } from 'vitest'
import {
  canParseOklab,
  parseOklab,
  canParseOklch,
  parseOklch,
  rgb8aToOklaba,
  oklabaToRgb8a,
  rgb8aToOklcha,
  oklchaToRgb8a,
  oklabaToOklabString,
  oklchaToOklchString,
} from '../src/color-oklab'
import { rgb8a, oklaba, oklcha } from '../src/color'

describe('canParseOklab', () => {
  test('should return true for valid oklab strings', () => {
    expect(canParseOklab('oklab(0.5 -0.1 0.1)')).toBe(true)
    expect(canParseOklab('oklab(50% -0.1 0.1 / 0.5)')).toBe(true)
  })

  test('should return false for invalid strings', () => {
    expect(canParseOklab('red')).toBe(false)
    expect(canParseOklab('#ff0000')).toBe(false)
    expect(canParseOklab('')).toBe(false)
  })
})

describe('parseOklab', () => {
  test('should parse oklab(0.5 -0.1 0.1)', () => {
    const result = parseOklab('oklab(0.5 -0.1 0.1)')
    expect(result.l).toBe(0.5)
    expect(result.a).toBe(-0.1)
    expect(result.b).toBe(0.1)
    expect(result.alpha).toBe(1)
  })

  test('should parse oklab with percentage lightness and alpha', () => {
    const result = parseOklab('oklab(50% -0.1 0.1 / 0.8)')
    expect(result.l).toBe(0.5)
    expect(result.a).toBe(-0.1)
    expect(result.b).toBe(0.1)
    expect(result.alpha).toBe(0.8)
  })

  test('should throw on invalid input', () => {
    expect(() => parseOklab('red')).toThrow()
    expect(() => parseOklab('not a color')).toThrow()
  })
})

describe('canParseOklch', () => {
  test('should return true for valid oklch strings', () => {
    expect(canParseOklch('oklch(0.5 0.15 326)')).toBe(true)
    expect(canParseOklch('oklch(50% 0.15 326 / 0.8)')).toBe(true)
  })

  test('should return false for invalid strings', () => {
    expect(canParseOklch('red')).toBe(false)
    expect(canParseOklch('#ff0000')).toBe(false)
  })
})

describe('parseOklch', () => {
  test('should parse oklch(0.5 0.15 326)', () => {
    const result = parseOklch('oklch(0.5 0.15 326)')
    expect(result.l).toBe(0.5)
    expect(result.c).toBe(0.15)
    expect(result.h).toBe(326)
    expect(result.alpha).toBe(1)
  })

  test('should throw on invalid input', () => {
    expect(() => parseOklch('not a color')).toThrow()
  })
})

describe('rgb8aToOklaba', () => {
  test('should convert red to OKLAB', () => {
    const result = rgb8aToOklaba(rgb8a(255, 0, 0))
    expect(result.l).toBeCloseTo(0.628, 2)
    expect(result.alpha).toBe(1)
  })

  test('should convert black to OKLAB', () => {
    const result = rgb8aToOklaba(rgb8a(0, 0, 0))
    expect(result.l).toBeCloseTo(0, 2)
    expect(result.a).toBeCloseTo(0, 2)
    expect(result.b).toBeCloseTo(0, 2)
  })

  test('should convert white to OKLAB', () => {
    const result = rgb8aToOklaba(rgb8a(255, 255, 255))
    expect(result.l).toBeCloseTo(1, 2)
  })
})

describe('oklabaToRgb8a', () => {
  test('should round-trip red through OKLAB', () => {
    const oklab = rgb8aToOklaba(rgb8a(255, 0, 0))
    const result = oklabaToRgb8a(oklab)
    expect(Math.abs(result.r - 255)).toBeLessThanOrEqual(1)
    expect(Math.abs(result.g - 0)).toBeLessThanOrEqual(1)
    expect(Math.abs(result.b - 0)).toBeLessThanOrEqual(1)
  })
})

describe('rgb8aToOklcha / oklchaToRgb8a', () => {
  test('should round-trip red through OKLCH', () => {
    const oklchColor = rgb8aToOklcha(rgb8a(255, 0, 0))
    const result = oklchaToRgb8a(oklchColor)
    expect(Math.abs(result.r - 255)).toBeLessThanOrEqual(1)
    expect(Math.abs(result.g - 0)).toBeLessThanOrEqual(1)
    expect(Math.abs(result.b - 0)).toBeLessThanOrEqual(1)
  })
})

describe('oklabaToOklabString', () => {
  test('should serialize without alpha when alpha is 1', () => {
    expect(oklabaToOklabString(oklaba(0.5, -0.1, 0.1))).toBe(
      'oklab(0.5 -0.1 0.1)'
    )
  })

  test('should serialize with alpha when alpha < 1', () => {
    expect(oklabaToOklabString(oklaba(0.5, -0.1, 0.1, 0.8))).toBe(
      'oklab(0.5 -0.1 0.1 / 0.8)'
    )
  })
})

describe('oklchaToOklchString', () => {
  test('should serialize without alpha when alpha is 1', () => {
    expect(oklchaToOklchString(oklcha(0.5, 0.15, 326))).toBe(
      'oklch(0.5 0.15 326)'
    )
  })

  test('should serialize with alpha when alpha < 1', () => {
    expect(oklchaToOklchString(oklcha(0.5, 0.15, 326, 0.8))).toBe(
      'oklch(0.5 0.15 326 / 0.8)'
    )
  })
})

describe('round-trip: cornflower blue through OKLAB', () => {
  test('rgb8a(100, 149, 237) -> rgb8aToOklaba -> oklabaToRgb8a', () => {
    const original = rgb8a(100, 149, 237)
    const oklab = rgb8aToOklaba(original)
    const result = oklabaToRgb8a(oklab)
    expect(Math.abs(result.r - original.r)).toBeLessThanOrEqual(1)
    expect(Math.abs(result.g - original.g)).toBeLessThanOrEqual(1)
    expect(Math.abs(result.b - original.b)).toBeLessThanOrEqual(1)
  })
})

describe('round-trip: cornflower blue through OKLCH', () => {
  test('rgb8a(100, 149, 237) -> rgb8aToOklcha -> oklchaToRgb8a', () => {
    const original = rgb8a(100, 149, 237)
    const oklchColor = rgb8aToOklcha(original)
    const result = oklchaToRgb8a(oklchColor)
    expect(Math.abs(result.r - original.r)).toBeLessThanOrEqual(1)
    expect(Math.abs(result.g - original.g)).toBeLessThanOrEqual(1)
    expect(Math.abs(result.b - original.b)).toBeLessThanOrEqual(1)
  })
})
