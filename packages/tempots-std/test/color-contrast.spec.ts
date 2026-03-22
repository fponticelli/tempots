import { describe, test, expect } from 'vitest'
import {
  luminance,
  contrastRatio,
  contrastColor,
  meetsContrast,
} from '../src/color-contrast'
import { rgb8a, convertColor, type RGB8A } from '../src/color'

const toRgb8 = (c: ReturnType<typeof convertColor>): RGB8A =>
  convertColor(c, 'rgb8') as RGB8A

describe('color-contrast', () => {
  describe('luminance', () => {
    test('should return 0 for black', () => {
      expect(luminance(rgb8a(0, 0, 0))).toBe(0)
    })

    test('should return 1 for white', () => {
      expect(luminance(rgb8a(255, 255, 255))).toBe(1)
    })

    test('should return ~0.2126 for pure red', () => {
      expect(luminance(rgb8a(255, 0, 0))).toBeCloseTo(0.2126, 4)
    })
  })

  describe('contrastRatio', () => {
    test('should return 21 for black vs white', () => {
      expect(
        contrastRatio(rgb8a(0, 0, 0), rgb8a(255, 255, 255))
      ).toBe(21)
    })

    test('should return 1 for identical colors', () => {
      expect(
        contrastRatio(rgb8a(255, 255, 255), rgb8a(255, 255, 255))
      ).toBe(1)
    })

    test('should be symmetric', () => {
      const a = rgb8a(100, 50, 200)
      const b = rgb8a(200, 180, 30)
      expect(contrastRatio(a, b)).toBe(contrastRatio(b, a))
    })
  })

  describe('contrastColor', () => {
    test('should return white for a black background', () => {
      const result = toRgb8(contrastColor(rgb8a(0, 0, 0)))
      expect(result.r).toBe(255)
      expect(result.g).toBe(255)
      expect(result.b).toBe(255)
    })

    test('should return black for a white background', () => {
      const result = toRgb8(contrastColor(rgb8a(255, 255, 255)))
      expect(result.r).toBe(0)
      expect(result.g).toBe(0)
      expect(result.b).toBe(0)
    })
  })

  describe('meetsContrast', () => {
    test('should pass AAA for black vs white', () => {
      expect(
        meetsContrast(rgb8a(0, 0, 0), rgb8a(255, 255, 255), 'AAA')
      ).toBe(true)
    })

    test('should fail AA for similar grays', () => {
      expect(
        meetsContrast(
          rgb8a(100, 100, 100),
          rgb8a(120, 120, 120),
          'AA'
        )
      ).toBe(false)
    })
  })
})
