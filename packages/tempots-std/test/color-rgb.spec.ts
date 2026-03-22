import { describe, test, expect } from 'vitest'
import {
  canParseHex,
  parseHex,
  canParseRgb,
  parseRgb,
  canParseNamedColor,
  parseNamedColor,
  rgb8aToHexString,
  rgb8aToRgbString,
} from '../src/color-rgb'
import { rgb8a } from '../src/color'

describe('canParseHex', () => {
  test('accepts valid 3-digit hex', () => {
    expect(canParseHex('#f00')).toBe(true)
  })

  test('accepts valid 4-digit hex', () => {
    expect(canParseHex('#f00f')).toBe(true)
  })

  test('accepts valid 6-digit hex', () => {
    expect(canParseHex('#ff0000')).toBe(true)
  })

  test('accepts valid 8-digit hex', () => {
    expect(canParseHex('#ff0000ff')).toBe(true)
  })

  test('rejects missing hash', () => {
    expect(canParseHex('f00')).toBe(false)
  })

  test('rejects invalid hex characters', () => {
    expect(canParseHex('#gg0000')).toBe(false)
  })

  test('rejects rgb() notation', () => {
    expect(canParseHex('rgb(255, 0, 0)')).toBe(false)
  })

  test('rejects empty string', () => {
    expect(canParseHex('')).toBe(false)
  })
})

describe('parseHex', () => {
  test('parses 3-digit hex', () => {
    const c = parseHex('#f00')
    expect(c.r).toBe(255)
    expect(c.g).toBe(0)
    expect(c.b).toBe(0)
    expect(c.alpha).toBe(1)
  })

  test('parses 6-digit hex', () => {
    const c = parseHex('#ff0000')
    expect(c.r).toBe(255)
    expect(c.g).toBe(0)
    expect(c.b).toBe(0)
    expect(c.alpha).toBe(1)
  })

  test('parses 8-digit hex with alpha', () => {
    const c = parseHex('#ff000080')
    expect(c.r).toBe(255)
    expect(c.g).toBe(0)
    expect(c.b).toBe(0)
    expect(c.alpha).toBeCloseTo(128 / 255, 3)
  })

  test('parses 4-digit hex with alpha', () => {
    const c = parseHex('#f00f')
    expect(c.r).toBe(255)
    expect(c.g).toBe(0)
    expect(c.b).toBe(0)
    expect(c.alpha).toBe(1)
  })

  test('parses uppercase hex', () => {
    const c = parseHex('#F00')
    expect(c.r).toBe(255)
    expect(c.g).toBe(0)
    expect(c.b).toBe(0)
  })

  test('throws on invalid hex', () => {
    expect(() => parseHex('not-a-hex')).toThrow()
  })
})

describe('canParseRgb', () => {
  test('accepts legacy comma syntax', () => {
    expect(canParseRgb('rgb(255, 0, 0)')).toBe(true)
  })

  test('accepts legacy rgba syntax', () => {
    expect(canParseRgb('rgba(255, 0, 0, 0.5)')).toBe(true)
  })

  test('accepts modern space syntax with slash alpha', () => {
    expect(canParseRgb('rgb(255 0 0 / 50%)')).toBe(true)
  })

  test('rejects hex notation', () => {
    expect(canParseRgb('#ff0000')).toBe(false)
  })

  test('rejects hsl notation', () => {
    expect(canParseRgb('hsl(0, 100%, 50%)')).toBe(false)
  })
})

describe('parseRgb', () => {
  test('parses legacy rgb()', () => {
    const c = parseRgb('rgb(255, 0, 0)')
    expect(c.r).toBe(255)
    expect(c.g).toBe(0)
    expect(c.b).toBe(0)
    expect(c.alpha).toBe(1)
  })

  test('parses legacy rgba() with alpha', () => {
    const c = parseRgb('rgba(255, 0, 0, 0.5)')
    expect(c.r).toBe(255)
    expect(c.alpha).toBe(0.5)
  })

  test('parses modern syntax with percentage alpha', () => {
    const c = parseRgb('rgb(255 0 0 / 50%)')
    expect(c.r).toBe(255)
    expect(c.g).toBe(0)
    expect(c.b).toBe(0)
    expect(c.alpha).toBe(0.5)
  })

  test('throws on invalid input', () => {
    expect(() => parseRgb('not-rgb')).toThrow()
  })
})

describe('canParseNamedColor', () => {
  test('accepts lowercase named color', () => {
    expect(canParseNamedColor('red')).toBe(true)
  })

  test('accepts mixed-case named color', () => {
    expect(canParseNamedColor('Red')).toBe(true)
  })

  test('accepts multi-word named color', () => {
    expect(canParseNamedColor('cornflowerblue')).toBe(true)
  })

  test('rejects unknown color name', () => {
    expect(canParseNamedColor('notacolor')).toBe(false)
  })

  test('rejects hex notation', () => {
    expect(canParseNamedColor('#ff0000')).toBe(false)
  })
})

describe('parseNamedColor', () => {
  test('parses red', () => {
    const c = parseNamedColor('red')
    expect(c.r).toBe(255)
    expect(c.g).toBe(0)
    expect(c.b).toBe(0)
    expect(c.alpha).toBe(1)
  })

  test('parses cornflowerblue', () => {
    const c = parseNamedColor('cornflowerblue')
    expect(c.r).toBe(100)
    expect(c.g).toBe(149)
    expect(c.b).toBe(237)
  })

  test('throws on unknown color', () => {
    expect(() => parseNamedColor('notacolor')).toThrow()
  })
})

describe('rgb8aToHexString', () => {
  test('serializes opaque color without alpha', () => {
    expect(rgb8aToHexString(rgb8a(255, 0, 0))).toBe('#ff0000')
  })

  test('serializes color with alpha', () => {
    expect(rgb8aToHexString(rgb8a(255, 0, 0, 0.5))).toBe('#ff000080')
  })
})

describe('rgb8aToRgbString', () => {
  test('serializes opaque color as rgb()', () => {
    expect(rgb8aToRgbString(rgb8a(255, 0, 0))).toBe('rgb(255, 0, 0)')
  })

  test('serializes translucent color as rgba()', () => {
    expect(rgb8aToRgbString(rgb8a(255, 0, 0, 0.5))).toBe(
      'rgba(255, 0, 0, 0.5)'
    )
  })
})
