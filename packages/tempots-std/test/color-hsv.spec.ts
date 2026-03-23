import { describe, test, expect } from 'vitest'
import {
  canParseHsv,
  parseHsv,
  rgb8aToHsva,
  hsvaToRgb8a,
  hslaToHsva,
  hsvaToHsla,
  hsvaToHsvString,
} from '../src/color-hsv'
import { rgb8a, hsva, hsla } from '../src/color'

describe('canParseHsv', () => {
  test('should return true for valid hsv strings', () => {
    expect(canParseHsv('hsv(0, 100%, 100%)')).toBe(true)
  })

  test('should return false for non-hsv strings', () => {
    expect(canParseHsv('hsl(0, 100%, 50%)')).toBe(false)
    expect(canParseHsv('#ff0000')).toBe(false)
  })
})

describe('parseHsv', () => {
  test('should parse valid hsv string', () => {
    const c = parseHsv('hsv(0, 100%, 100%)')
    expect(c.h).toBe(0)
    expect(c.s).toBe(1)
    expect(c.v).toBe(1)
  })

  test('should throw on invalid input', () => {
    expect(() => parseHsv('not-a-color')).toThrow()
  })
})

describe('rgb8aToHsva', () => {
  test('should convert pure red', () => {
    const c = rgb8aToHsva(rgb8a(255, 0, 0))
    expect(c.h).toBeCloseTo(0, 0)
    expect(c.s).toBe(1)
    expect(c.v).toBe(1)
  })

  test('should convert black', () => {
    const c = rgb8aToHsva(rgb8a(0, 0, 0))
    expect(c.s).toBe(0)
    expect(c.v).toBe(0)
  })

  test('should convert gray with zero saturation', () => {
    const c = rgb8aToHsva(rgb8a(128, 128, 128))
    expect(c.s).toBe(0)
  })
})

describe('hsvaToRgb8a', () => {
  test('should convert pure red', () => {
    const c = hsvaToRgb8a(hsva(0, 1, 1))
    expect(c.r).toBe(255)
    expect(c.g).toBe(0)
    expect(c.b).toBe(0)
  })

  test('should convert pure green', () => {
    const c = hsvaToRgb8a(hsva(120, 1, 1))
    expect(c.r).toBe(0)
    expect(c.g).toBe(255)
    expect(c.b).toBe(0)
  })
})

describe('hslaToHsva', () => {
  test('should convert pure red hsl to hsv', () => {
    const c = hslaToHsva(hsla(0, 1, 0.5))
    expect(c.s).toBe(1)
    expect(c.v).toBe(1)
  })

  test('should convert black', () => {
    const c = hslaToHsva(hsla(0, 0, 0))
    expect(c.s).toBe(0)
    expect(c.v).toBe(0)
  })
})

describe('hsvaToHsla', () => {
  test('should convert pure red hsv to hsl', () => {
    const c = hsvaToHsla(hsva(0, 1, 1))
    expect(c.s).toBe(1)
    expect(c.l).toBe(0.5)
  })

  test('should convert black', () => {
    const c = hsvaToHsla(hsva(0, 0, 0))
    expect(c.s).toBe(0)
    expect(c.l).toBe(0)
  })
})

describe('round-trip rgb8a -> hsva -> rgb8a', () => {
  test('should preserve cornflower blue within +-1', () => {
    const original = rgb8a(100, 149, 237)
    const roundTripped = hsvaToRgb8a(rgb8aToHsva(original))
    expect(Math.abs(roundTripped.r - 100)).toBeLessThanOrEqual(1)
    expect(Math.abs(roundTripped.g - 149)).toBeLessThanOrEqual(1)
    expect(Math.abs(roundTripped.b - 237)).toBeLessThanOrEqual(1)
  })
})

describe('hsvaToHsvString', () => {
  test('should serialize opaque color without alpha', () => {
    expect(hsvaToHsvString(hsva(0, 1, 1))).toBe('hsv(0 100% 100%)')
  })

  test('should serialize translucent color with alpha', () => {
    expect(hsvaToHsvString(hsva(120, 0.5, 0.8, 0.5))).toBe(
      'hsv(120 50% 80% / 0.5)'
    )
  })
})
