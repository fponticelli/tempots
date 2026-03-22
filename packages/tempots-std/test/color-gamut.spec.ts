import { describe, test, expect } from 'vitest'
import {
  isInGamut,
  clampToGamut,
  clampToGamutOklch,
} from '../src/color-gamut'
import {
  rgb8a,
  rgba,
  hsla,
  oklcha,
  laba,
  lcha,
  convertColor,
  type OKLCHA,
  type RGB8A,
} from '../src/color'

describe('isInGamut', () => {
  test('rgb8 colors are always in gamut', () => {
    expect(isInGamut(rgb8a(255, 0, 0))).toBe(true)
    expect(isInGamut(rgb8a(0, 0, 0))).toBe(true)
    expect(isInGamut(rgb8a(255, 255, 255))).toBe(true)
  })

  test('rgba colors within 0-1 are in gamut', () => {
    expect(isInGamut(rgba(1, 0, 0))).toBe(true)
    expect(isInGamut(rgba(0.5, 0.5, 0.5))).toBe(true)
  })

  test('hsl colors are always in gamut', () => {
    expect(isInGamut(hsla(0, 1, 0.5))).toBe(true)
    expect(isInGamut(hsla(120, 0.5, 0.75))).toBe(true)
  })

  test('oklch with moderate chroma is in gamut', () => {
    expect(isInGamut(oklcha(0.5, 0.1, 150))).toBe(true)
  })

  test('oklch with very high chroma is out of gamut', () => {
    expect(isInGamut(oklcha(0.5, 0.4, 150))).toBe(false)
  })

  test('lab with extreme values is out of gamut', () => {
    expect(isInGamut(laba(0.5, 125, 125))).toBe(false)
  })

  test('lch with very high chroma is out of gamut', () => {
    expect(isInGamut(lcha(0.5, 150, 150))).toBe(false)
  })

  test('oklch black and white are in gamut', () => {
    expect(isInGamut(oklcha(0, 0, 0))).toBe(true)
    expect(isInGamut(oklcha(1, 0, 0))).toBe(true)
  })
})

describe('clampToGamut', () => {
  test('returns in-gamut color unchanged', () => {
    const c = rgb8a(255, 0, 0)
    expect(clampToGamut(c)).toBe(c)
  })

  test('clamps out-of-gamut oklch', () => {
    const c = oklcha(0.5, 0.4, 150)
    const clamped = clampToGamut(c)
    expect(isInGamut(clamped)).toBe(true)
    expect(clamped.space).toBe('oklch')
  })

  test('preserves original color space', () => {
    const c = laba(0.5, 125, 125)
    const clamped = clampToGamut(c)
    expect(clamped.space).toBe('lab')
    expect(isInGamut(clamped)).toBe(true)
  })
})

describe('clampToGamutOklch', () => {
  test('returns in-gamut color unchanged', () => {
    const c = rgb8a(255, 0, 0)
    expect(clampToGamutOklch(c)).toBe(c)
  })

  test('clamps out-of-gamut color by reducing chroma', () => {
    const c = oklcha(0.5, 0.4, 150)
    const clamped = clampToGamutOklch(c)
    expect(isInGamut(clamped)).toBe(true)
    // Should preserve lightness and hue
    const ok = convertColor(clamped, 'oklch') as OKLCHA
    expect(ok.l).toBeCloseTo(0.5, 2)
    expect(ok.h).toBeCloseTo(150, 0)
    // Chroma should be reduced
    expect(ok.c).toBeLessThan(0.4)
    expect(ok.c).toBeGreaterThan(0)
  })

  test('preserves original color space', () => {
    const c = lcha(0.5, 150, 150)
    const clamped = clampToGamutOklch(c)
    expect(clamped.space).toBe('lch')
    expect(isInGamut(clamped)).toBe(true)
  })

  test('result converts to valid rgb8', () => {
    const c = oklcha(0.5, 0.4, 150)
    const clamped = clampToGamutOklch(c)
    const rgb = convertColor(clamped, 'rgb8') as RGB8A
    expect(rgb.r).toBeGreaterThanOrEqual(0)
    expect(rgb.r).toBeLessThanOrEqual(255)
    expect(rgb.g).toBeGreaterThanOrEqual(0)
    expect(rgb.g).toBeLessThanOrEqual(255)
    expect(rgb.b).toBeGreaterThanOrEqual(0)
    expect(rgb.b).toBeLessThanOrEqual(255)
  })
})
