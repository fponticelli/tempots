import { describe, test, expect } from 'vitest'
import {
  canParseHsl,
  parseHsl,
  rgb8aToHsla,
  hslaToRgb8a,
  hslaToHslString,
} from '../src/color-hsl'
import { rgb8a, hsla } from '../src/color'

describe('canParseHsl', () => {
  test('should return true for valid legacy hsl strings', () => {
    expect(canParseHsl('hsl(0, 100%, 50%)')).toBe(true)
    expect(canParseHsl('hsla(0, 100%, 50%, 0.5)')).toBe(true)
  })

  test('should return true for valid modern hsl strings', () => {
    expect(canParseHsl('hsl(120 50% 50% / 0.5)')).toBe(true)
  })

  test('should return false for non-hsl strings', () => {
    expect(canParseHsl('#ff0000')).toBe(false)
    expect(canParseHsl('rgb(255, 0, 0)')).toBe(false)
  })
})

describe('parseHsl', () => {
  test('should parse legacy hsl without alpha', () => {
    const c = parseHsl('hsl(0, 100%, 50%)')
    expect(c.h).toBe(0)
    expect(c.s).toBe(1)
    expect(c.l).toBe(0.5)
    expect(c.alpha).toBe(1)
  })

  test('should parse legacy hsla with alpha', () => {
    const c = parseHsl('hsla(120, 50%, 75%, 0.8)')
    expect(c.h).toBe(120)
    expect(c.s).toBe(0.5)
    expect(c.l).toBe(0.75)
    expect(c.alpha).toBe(0.8)
  })

  test('should parse modern hsl with percentage alpha', () => {
    const c = parseHsl('hsl(240 100% 50% / 50%)')
    expect(c.alpha).toBe(0.5)
  })

  test('should throw on invalid input', () => {
    expect(() => parseHsl('not-a-color')).toThrow()
  })
})

describe('rgb8aToHsla', () => {
  test('should convert pure red', () => {
    const c = rgb8aToHsla(rgb8a(255, 0, 0))
    expect(c.h).toBeCloseTo(0, 0)
    expect(c.s).toBeCloseTo(1, 2)
    expect(c.l).toBeCloseTo(0.5, 2)
  })

  test('should convert pure green', () => {
    const c = rgb8aToHsla(rgb8a(0, 255, 0))
    expect(c.h).toBeCloseTo(120, 0)
  })

  test('should convert pure blue', () => {
    const c = rgb8aToHsla(rgb8a(0, 0, 255))
    expect(c.h).toBeCloseTo(240, 0)
  })

  test('should convert black', () => {
    const c = rgb8aToHsla(rgb8a(0, 0, 0))
    expect(c.s).toBe(0)
    expect(c.l).toBe(0)
  })

  test('should convert white', () => {
    const c = rgb8aToHsla(rgb8a(255, 255, 255))
    expect(c.s).toBe(0)
    expect(c.l).toBe(1)
  })

  test('should convert gray with zero saturation', () => {
    const c = rgb8aToHsla(rgb8a(128, 128, 128))
    expect(c.s).toBe(0)
  })
})

describe('hslaToRgb8a', () => {
  test('should convert pure red', () => {
    const c = hslaToRgb8a(hsla(0, 1, 0.5))
    expect(c.r).toBe(255)
    expect(c.g).toBe(0)
    expect(c.b).toBe(0)
  })

  test('should convert pure green', () => {
    const c = hslaToRgb8a(hsla(120, 1, 0.5))
    expect(c.r).toBe(0)
    expect(c.g).toBe(255)
    expect(c.b).toBe(0)
  })

  test('should convert pure blue', () => {
    const c = hslaToRgb8a(hsla(240, 1, 0.5))
    expect(c.r).toBe(0)
    expect(c.g).toBe(0)
    expect(c.b).toBe(255)
  })

  test('should convert black', () => {
    const c = hslaToRgb8a(hsla(0, 0, 0))
    expect(c.r).toBe(0)
    expect(c.g).toBe(0)
    expect(c.b).toBe(0)
  })

  test('should convert white', () => {
    const c = hslaToRgb8a(hsla(0, 0, 1))
    expect(c.r).toBe(255)
    expect(c.g).toBe(255)
    expect(c.b).toBe(255)
  })
})

describe('round-trip rgb8a -> hsla -> rgb8a', () => {
  test('should preserve cornflower blue within +-1', () => {
    const original = rgb8a(100, 149, 237)
    const roundTripped = hslaToRgb8a(rgb8aToHsla(original))
    expect(roundTripped.r).toBeCloseTo(100, 0)
    expect(roundTripped.g).toBeCloseTo(149, 0)
    expect(roundTripped.b).toBeCloseTo(237, 0)
    expect(Math.abs(roundTripped.r - 100)).toBeLessThanOrEqual(1)
    expect(Math.abs(roundTripped.g - 149)).toBeLessThanOrEqual(1)
    expect(Math.abs(roundTripped.b - 237)).toBeLessThanOrEqual(1)
  })
})

describe('hslaToHslString', () => {
  test('should serialize opaque color without alpha', () => {
    expect(hslaToHslString(hsla(0, 1, 0.5))).toBe('hsl(0 100% 50%)')
  })

  test('should serialize translucent color with alpha', () => {
    expect(hslaToHslString(hsla(120, 0.5, 0.75, 0.5))).toBe(
      'hsl(120 50% 75% / 0.5)'
    )
  })
})
