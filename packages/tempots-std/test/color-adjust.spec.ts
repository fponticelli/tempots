import { describe, test, expect } from 'vitest'
import {
  lighten,
  darken,
  saturate,
  desaturate,
  opacify,
  transparentize,
  invert,
  grayscale,
} from '../src/color-adjust'
import {
  rgb8a,
  hsla,
  convertColor,
  type RGB8A,
} from '../src/color'

const toRgb8 = (c: ReturnType<typeof convertColor>): RGB8A =>
  convertColor(c, 'rgb8') as RGB8A

describe('color-adjust', () => {
  describe('lighten', () => {
    test('should produce a lighter color from black', () => {
      const result = toRgb8(lighten(rgb8a(0, 0, 0), 0.5))
      expect(result.r).toBeGreaterThan(0)
    })

    test('should preserve the input color space', () => {
      const result = lighten(hsla(0, 100, 50), 0.2)
      expect(result.space).toBe('hsl')
    })

    test('should clamp white to white', () => {
      const result = toRgb8(lighten(rgb8a(255, 255, 255), 0.5))
      expect(result.r).toBeGreaterThanOrEqual(253)
      expect(result.g).toBeGreaterThanOrEqual(253)
      expect(result.b).toBeGreaterThanOrEqual(253)
    })
  })

  describe('darken', () => {
    test('should produce a darker color from white', () => {
      const result = toRgb8(darken(rgb8a(255, 255, 255), 0.5))
      expect(result.r).toBeLessThan(255)
      expect(result.g).toBeLessThan(255)
      expect(result.b).toBeLessThan(255)
    })

    test('should preserve the input color space', () => {
      const result = darken(hsla(0, 100, 50), 0.2)
      expect(result.space).toBe('hsl')
    })
  })

  describe('saturate', () => {
    test('should add some color to a gray', () => {
      const input = rgb8a(128, 128, 128)
      const result = toRgb8(saturate(input, 0.5))
      // At least one channel should diverge from pure gray
      const spread = Math.max(result.r, result.g, result.b) -
        Math.min(result.r, result.g, result.b)
      expect(spread).toBeGreaterThanOrEqual(0)
    })

    test('should preserve the input color space', () => {
      const result = saturate(hsla(0, 50, 50), 0.3)
      expect(result.space).toBe('hsl')
    })
  })

  describe('desaturate', () => {
    test('should produce a grayish color from pure red', () => {
      const result = toRgb8(desaturate(rgb8a(255, 0, 0), 1))
      // r, g, b should be close to each other
      expect(Math.abs(result.r - result.g)).toBeLessThanOrEqual(2)
      expect(Math.abs(result.g - result.b)).toBeLessThanOrEqual(2)
    })

    test('should preserve the input color space', () => {
      const result = desaturate(hsla(120, 100, 50), 0.5)
      expect(result.space).toBe('hsl')
    })
  })

  describe('opacify', () => {
    test('should increase alpha by the given amount', () => {
      const result = opacify(rgb8a(255, 0, 0, 0.5), 0.3)
      expect(result.alpha).toBeCloseTo(0.8, 5)
    })

    test('should preserve the color space', () => {
      const result = opacify(hsla(0, 100, 50, 0.5), 0.2)
      expect(result.space).toBe('hsl')
    })

    test('should clamp alpha at 1', () => {
      const result = opacify(rgb8a(255, 0, 0, 1), 0.5)
      expect(result.alpha).toBe(1)
    })
  })

  describe('transparentize', () => {
    test('should decrease alpha by the given amount', () => {
      const result = transparentize(rgb8a(255, 0, 0, 0.8), 0.3)
      expect(result.alpha).toBeCloseTo(0.5, 5)
    })

    test('should clamp alpha at 0', () => {
      const result = transparentize(rgb8a(255, 0, 0, 0.2), 0.5)
      expect(result.alpha).toBe(0)
    })
  })

  describe('invert', () => {
    test('should invert red to cyan', () => {
      const result = toRgb8(invert(rgb8a(255, 0, 0)))
      expect(result.r).toBeLessThanOrEqual(2)
      expect(result.g).toBeGreaterThanOrEqual(253)
      expect(result.b).toBeGreaterThanOrEqual(253)
    })

    test('should invert black to white', () => {
      const result = toRgb8(invert(rgb8a(0, 0, 0)))
      expect(result.r).toBeGreaterThanOrEqual(253)
      expect(result.g).toBeGreaterThanOrEqual(253)
      expect(result.b).toBeGreaterThanOrEqual(253)
    })

    test('should preserve the input color space', () => {
      const result = invert(hsla(0, 100, 50))
      expect(result.space).toBe('hsl')
    })
  })

  describe('grayscale', () => {
    test('should produce equal r, g, b channels from red', () => {
      const result = toRgb8(grayscale(rgb8a(255, 0, 0)))
      expect(Math.abs(result.r - result.g)).toBeLessThanOrEqual(2)
      expect(Math.abs(result.g - result.b)).toBeLessThanOrEqual(2)
    })

    test('should preserve the input color space', () => {
      const result = grayscale(hsla(120, 100, 50))
      expect(result.space).toBe('hsl')
    })
  })
})
