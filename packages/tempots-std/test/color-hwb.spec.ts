import { describe, test, expect } from 'vitest'
import {
  canParseHwb,
  parseHwb,
  rgb8aToHwba,
  hwbaToRgb8a,
  hwbaToHwbString,
} from '../src/color-hwb'
import { rgb8a, hwba } from '../src/color'

describe('canParseHwb', () => {
  test('should return true for valid hwb strings', () => {
    expect(canParseHwb('hwb(0 0% 0%)')).toBe(true)
    expect(canParseHwb('hwb(180 20% 30% / 0.5)')).toBe(true)
  })

  test('should return false for non-hwb strings', () => {
    expect(canParseHwb('#ff0000')).toBe(false)
    expect(canParseHwb('rgb(255, 0, 0)')).toBe(false)
  })
})

describe('parseHwb', () => {
  test('should parse hwb without alpha', () => {
    const c = parseHwb('hwb(0 0% 0%)')
    expect(c.h).toBe(0)
    expect(c.w).toBe(0)
    expect(c.b).toBe(0)
    expect(c.alpha).toBe(1)
  })

  test('should parse hwb with alpha', () => {
    const c = parseHwb('hwb(180 20% 30% / 0.5)')
    expect(c.h).toBe(180)
    expect(c.w).toBe(20)
    expect(c.b).toBe(30)
    expect(c.alpha).toBe(0.5)
  })

  test('should throw on invalid input', () => {
    expect(() => parseHwb('not-a-color')).toThrow()
  })
})

describe('rgb8aToHwba', () => {
  test('should convert pure red', () => {
    const c = rgb8aToHwba(rgb8a(255, 0, 0))
    expect(c.h).toBeCloseTo(0, 0)
    expect(c.w).toBe(0)
    expect(c.b).toBe(0)
  })

  test('should convert black', () => {
    const c = rgb8aToHwba(rgb8a(0, 0, 0))
    expect(c.w).toBe(0)
    expect(c.b).toBe(100)
  })

  test('should convert white', () => {
    const c = rgb8aToHwba(rgb8a(255, 255, 255))
    expect(c.w).toBe(100)
    expect(c.b).toBe(0)
  })
})

describe('hwbaToRgb8a', () => {
  test('should convert pure red', () => {
    const c = hwbaToRgb8a(hwba(0, 0, 0))
    expect(c.r).toBe(255)
    expect(c.g).toBe(0)
    expect(c.b).toBe(0)
  })

  test('should convert full whiteness to white', () => {
    const c = hwbaToRgb8a(hwba(0, 100, 0))
    expect(c.r).toBe(255)
    expect(c.g).toBe(255)
    expect(c.b).toBe(255)
  })

  test('should convert full blackness to black', () => {
    const c = hwbaToRgb8a(hwba(0, 0, 100))
    expect(c.r).toBe(0)
    expect(c.g).toBe(0)
    expect(c.b).toBe(0)
  })
})

describe('round-trip rgb8a -> hwba -> rgb8a', () => {
  test('should preserve cornflower blue within +-1', () => {
    const original = rgb8a(100, 149, 237)
    const roundTripped = hwbaToRgb8a(rgb8aToHwba(original))
    expect(Math.abs(roundTripped.r - 100)).toBeLessThanOrEqual(1)
    expect(Math.abs(roundTripped.g - 149)).toBeLessThanOrEqual(1)
    expect(Math.abs(roundTripped.b - 237)).toBeLessThanOrEqual(1)
  })
})

describe('hwbaToHwbString', () => {
  test('should serialize opaque color without alpha', () => {
    expect(hwbaToHwbString(hwba(0, 0, 0))).toBe('hwb(0 0% 0%)')
  })

  test('should serialize translucent color with alpha', () => {
    expect(hwbaToHwbString(hwba(180, 20, 30, 0.5))).toBe(
      'hwb(180 20% 30% / 0.5)'
    )
  })
})
