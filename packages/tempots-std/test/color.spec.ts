import { describe, test, expect } from 'vitest'
import {
  rgba,
  rgb8a,
  hsla,
  hsva,
  hwba,
  laba,
  lcha,
  oklaba,
  oklcha,
  isRgba,
  isRgb8a,
  isHsla,
  isHsva,
  isHwba,
  isLaba,
  isLcha,
  isOklaba,
  isOklcha,
  parseAlpha,
  detectColorSpace,
  canParseColor,
  parseColor,
  convertColor,
  colorToString,
  rgbaToRgb8a,
  rgb8aToRgba,
  rgb8aToHexString,
  type RGB8A,
} from '../src/color'

// ---------------------------------------------------------------------------
// Construction helpers
// ---------------------------------------------------------------------------

describe('rgb8a', () => {
  test('creates an RGB8A color with default alpha', () => {
    const c = rgb8a(255, 0, 0)
    expect(c.space).toBe('rgb8')
    expect(c.r).toBe(255)
    expect(c.g).toBe(0)
    expect(c.b).toBe(0)
    expect(c.alpha).toBe(1)
  })

  test('clamps r above 255', () => {
    expect(rgb8a(300, 0, 0).r).toBe(255)
  })

  test('clamps r below 0', () => {
    expect(rgb8a(-1, 0, 0).r).toBe(0)
  })

  test('clamps g and b similarly', () => {
    expect(rgb8a(0, 300, -5).g).toBe(255)
    expect(rgb8a(0, 300, -5).b).toBe(0)
  })
})

describe('rgba', () => {
  test('creates an RGBA color with default alpha', () => {
    const c = rgba(1, 0, 0)
    expect(c.space).toBe('rgb')
    expect(c.r).toBe(1)
    expect(c.g).toBe(0)
    expect(c.b).toBe(0)
    expect(c.alpha).toBe(1)
  })

  test('clamps r above 1', () => {
    expect(rgba(1.5, 0, 0).r).toBe(1)
  })

  test('clamps r below 0', () => {
    expect(rgba(-0.1, 0, 0).r).toBe(0)
  })

  test('clamps g and b similarly', () => {
    expect(rgba(0, 1.5, -0.1).g).toBe(1)
    expect(rgba(0, 1.5, -0.1).b).toBe(0)
  })
})

describe('hsla', () => {
  test('creates an HSLA color', () => {
    const c = hsla(120, 1, 0.5)
    expect(c.space).toBe('hsl')
    expect(c.h).toBe(120)
    expect(c.s).toBe(1)
    expect(c.l).toBe(0.5)
    expect(c.alpha).toBe(1)
  })

  test('wraps hue above 360', () => {
    expect(hsla(370, 1, 0.5).h).toBe(10)
  })

  test('wraps negative hue', () => {
    expect(hsla(-10, 1, 0.5).h).toBe(350)
  })

  test('clamps saturation and lightness', () => {
    expect(hsla(0, 1.5, -0.1).s).toBe(1)
    expect(hsla(0, 1.5, -0.1).l).toBe(0)
  })
})

describe('hsva', () => {
  test('creates an HSVA color', () => {
    const c = hsva(0, 1, 1)
    expect(c.space).toBe('hsv')
    expect(c.h).toBe(0)
    expect(c.s).toBe(1)
    expect(c.v).toBe(1)
    expect(c.alpha).toBe(1)
  })

  test('wraps hue', () => {
    expect(hsva(370, 0, 0).h).toBe(10)
    expect(hsva(-10, 0, 0).h).toBe(350)
  })
})

describe('hwba', () => {
  test('creates an HWBA color', () => {
    const c = hwba(0, 0, 0)
    expect(c.space).toBe('hwb')
    expect(c.h).toBe(0)
    expect(c.w).toBe(0)
    expect(c.b).toBe(0)
    expect(c.alpha).toBe(1)
  })

  test('wraps hue', () => {
    expect(hwba(370, 0, 0).h).toBe(10)
    expect(hwba(-10, 0, 0).h).toBe(350)
  })
})

describe('laba', () => {
  test('creates a LABA color', () => {
    const c = laba(0.5, -20, 30)
    expect(c.space).toBe('lab')
    expect(c.l).toBe(0.5)
    expect(c.a).toBe(-20)
    expect(c.b).toBe(30)
    expect(c.alpha).toBe(1)
  })

  test('clamps alpha', () => {
    expect(laba(0.5, 0, 0, 2).alpha).toBe(1)
    expect(laba(0.5, 0, 0, -1).alpha).toBe(0)
  })
})

describe('lcha', () => {
  test('creates a LCHA color', () => {
    const c = lcha(0.5, 36, 326)
    expect(c.space).toBe('lch')
    expect(c.l).toBe(0.5)
    expect(c.c).toBe(36)
    expect(c.h).toBe(326)
    expect(c.alpha).toBe(1)
  })

  test('wraps hue', () => {
    expect(lcha(0.5, 36, 370).h).toBe(10)
    expect(lcha(0.5, 36, -10).h).toBe(350)
  })
})

describe('oklaba', () => {
  test('creates an OKLABA color', () => {
    const c = oklaba(0.5, -0.1, 0.1)
    expect(c.space).toBe('oklab')
    expect(c.l).toBe(0.5)
    expect(c.a).toBe(-0.1)
    expect(c.b).toBe(0.1)
    expect(c.alpha).toBe(1)
  })
})

describe('oklcha', () => {
  test('creates an OKLCHA color', () => {
    const c = oklcha(0.5, 0.15, 326)
    expect(c.space).toBe('oklch')
    expect(c.l).toBe(0.5)
    expect(c.c).toBe(0.15)
    expect(c.h).toBe(326)
    expect(c.alpha).toBe(1)
  })

  test('wraps hue', () => {
    expect(oklcha(0.5, 0.15, 370).h).toBe(10)
    expect(oklcha(0.5, 0.15, -10).h).toBe(350)
  })
})

// ---------------------------------------------------------------------------
// Type guards
// ---------------------------------------------------------------------------

describe('type guards', () => {
  const colors = {
    rgb: rgba(1, 0, 0),
    rgb8: rgb8a(255, 0, 0),
    hsl: hsla(0, 1, 0.5),
    hsv: hsva(0, 1, 1),
    hwb: hwba(0, 0, 0),
    lab: laba(0.5, 0, 0),
    lch: lcha(0.5, 36, 0),
    oklab: oklaba(0.5, 0, 0),
    oklch: oklcha(0.5, 0.15, 0),
  }

  test('isRgba returns true only for RGBA', () => {
    expect(isRgba(colors.rgb)).toBe(true)
    expect(isRgba(colors.rgb8)).toBe(false)
    expect(isRgba(colors.hsl)).toBe(false)
  })

  test('isRgb8a returns true only for RGB8A', () => {
    expect(isRgb8a(colors.rgb8)).toBe(true)
    expect(isRgb8a(colors.rgb)).toBe(false)
    expect(isRgb8a(colors.hsl)).toBe(false)
  })

  test('isHsla returns true only for HSLA', () => {
    expect(isHsla(colors.hsl)).toBe(true)
    expect(isHsla(colors.rgb8)).toBe(false)
  })

  test('isHsva returns true only for HSVA', () => {
    expect(isHsva(colors.hsv)).toBe(true)
    expect(isHsva(colors.rgb8)).toBe(false)
  })

  test('isHwba returns true only for HWBA', () => {
    expect(isHwba(colors.hwb)).toBe(true)
    expect(isHwba(colors.rgb8)).toBe(false)
  })

  test('isLaba returns true only for LABA', () => {
    expect(isLaba(colors.lab)).toBe(true)
    expect(isLaba(colors.rgb8)).toBe(false)
  })

  test('isLcha returns true only for LCHA', () => {
    expect(isLcha(colors.lch)).toBe(true)
    expect(isLcha(colors.rgb8)).toBe(false)
  })

  test('isOklaba returns true only for OKLABA', () => {
    expect(isOklaba(colors.oklab)).toBe(true)
    expect(isOklaba(colors.rgb8)).toBe(false)
  })

  test('isOklcha returns true only for OKLCHA', () => {
    expect(isOklcha(colors.oklch)).toBe(true)
    expect(isOklcha(colors.rgb8)).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// parseAlpha
// ---------------------------------------------------------------------------

describe('parseAlpha', () => {
  test('returns 1 for undefined', () => {
    expect(parseAlpha(undefined)).toBe(1)
  })

  test('parses decimal string', () => {
    expect(parseAlpha('0.5')).toBe(0.5)
  })

  test('parses percentage string', () => {
    expect(parseAlpha('50%')).toBe(0.5)
  })

  test('parses 1', () => {
    expect(parseAlpha('1')).toBe(1)
  })

  test('parses 0', () => {
    expect(parseAlpha('0')).toBe(0)
  })
})

// ---------------------------------------------------------------------------
// detectColorSpace
// ---------------------------------------------------------------------------

describe('detectColorSpace', () => {
  test('detects hex as rgb8', () => {
    expect(detectColorSpace('#ff0000')).toBe('rgb8')
  })

  test('detects rgb() as rgb8', () => {
    expect(detectColorSpace('rgb(255, 0, 0)')).toBe('rgb8')
  })

  test('detects hsl() as hsl', () => {
    expect(detectColorSpace('hsl(0, 100%, 50%)')).toBe('hsl')
  })

  test('detects hsv() as hsv', () => {
    expect(detectColorSpace('hsv(0, 100%, 100%)')).toBe('hsv')
  })

  test('detects hwb() as hwb', () => {
    expect(detectColorSpace('hwb(0 0% 0%)')).toBe('hwb')
  })

  test('detects lab() as lab', () => {
    expect(detectColorSpace('lab(50 -20 30)')).toBe('lab')
  })

  test('detects lch() as lch', () => {
    expect(detectColorSpace('lch(50 36 326)')).toBe('lch')
  })

  test('detects oklab() as oklab', () => {
    expect(detectColorSpace('oklab(0.5 -0.1 0.1)')).toBe('oklab')
  })

  test('detects oklch() as oklch', () => {
    expect(detectColorSpace('oklch(0.5 0.15 326)')).toBe('oklch')
  })

  test('detects named color as rgb8', () => {
    expect(detectColorSpace('red')).toBe('rgb8')
  })

  test('returns undefined for unrecognized input', () => {
    expect(detectColorSpace('nope')).toBeUndefined()
  })
})

// ---------------------------------------------------------------------------
// canParseColor
// ---------------------------------------------------------------------------

describe('canParseColor', () => {
  test('accepts hex', () => {
    expect(canParseColor('#ff0000')).toBe(true)
  })

  test('accepts rgb()', () => {
    expect(canParseColor('rgb(255, 0, 0)')).toBe(true)
  })

  test('accepts named color', () => {
    expect(canParseColor('red')).toBe(true)
  })

  test('rejects unrecognized string', () => {
    expect(canParseColor('nope')).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// parseColor
// ---------------------------------------------------------------------------

describe('parseColor', () => {
  test('parses hex to RGB8A', () => {
    const c = parseColor('#ff0000')
    expect(c.space).toBe('rgb8')
    expect((c as RGB8A).r).toBe(255)
  })

  test('parses hsl() to HSLA', () => {
    const c = parseColor('hsl(0, 100%, 50%)')
    expect(c.space).toBe('hsl')
  })

  test('parses named color to RGB8A', () => {
    const c = parseColor('red')
    expect(c.space).toBe('rgb8')
    expect((c as RGB8A).r).toBe(255)
  })

  test('throws on unrecognized format', () => {
    expect(() => parseColor('nope')).toThrow()
  })
})

// ---------------------------------------------------------------------------
// rgbaToRgb8a / rgb8aToRgba
// ---------------------------------------------------------------------------

describe('rgbaToRgb8a', () => {
  test('converts RGBA red to RGB8A', () => {
    const c = rgbaToRgb8a(rgba(1, 0, 0))
    expect(c.space).toBe('rgb8')
    expect(c.r).toBe(255)
    expect(c.g).toBe(0)
    expect(c.b).toBe(0)
    expect(c.alpha).toBe(1)
  })

  test('preserves alpha', () => {
    const c = rgbaToRgb8a(rgba(0, 0, 0, 0.5))
    expect(c.alpha).toBe(0.5)
  })
})

describe('rgb8aToRgba', () => {
  test('converts RGB8A red to RGBA', () => {
    const c = rgb8aToRgba(rgb8a(255, 0, 0))
    expect(c.space).toBe('rgb')
    expect(c.r).toBeCloseTo(1, 5)
    expect(c.g).toBeCloseTo(0, 5)
    expect(c.b).toBeCloseTo(0, 5)
    expect(c.alpha).toBe(1)
  })

  test('preserves alpha', () => {
    const c = rgb8aToRgba(rgb8a(0, 0, 0, 0.5))
    expect(c.alpha).toBe(0.5)
  })
})

// ---------------------------------------------------------------------------
// convertColor
// ---------------------------------------------------------------------------

describe('convertColor', () => {
  test('converts rgb8a red to hsl', () => {
    const hsl = convertColor(rgb8a(255, 0, 0), 'hsl')
    expect(hsl.space).toBe('hsl')
    const h = hsl as ReturnType<typeof hsla>
    expect(h.h).toBeCloseTo(0, 0)
    expect(h.s).toBeCloseTo(1, 2)
    expect(h.l).toBeCloseTo(0.5, 2)
  })

  test('converts hsla green to rgb8', () => {
    const rgb = convertColor(hsla(120, 1, 0.5), 'rgb8')
    expect(rgb.space).toBe('rgb8')
    const r = rgb as RGB8A
    expect(r.g).toBeCloseTo(255, 0)
  })

  test('converts rgb8a red to rgb (0-1)', () => {
    const rgb = convertColor(rgb8a(255, 0, 0), 'rgb')
    expect(rgb.space).toBe('rgb')
    const r = rgb as ReturnType<typeof rgba>
    expect(r.r).toBeCloseTo(1, 5)
    expect(r.g).toBeCloseTo(0, 5)
    expect(r.b).toBeCloseTo(0, 5)
  })

  test('returns same object for same-space conversion', () => {
    const c = rgb8a(255, 0, 0)
    expect(convertColor(c, 'rgb8')).toBe(c)
  })
})

// ---------------------------------------------------------------------------
// colorToString
// ---------------------------------------------------------------------------

describe('colorToString', () => {
  test('serializes RGB8A as rgb()', () => {
    expect(colorToString(rgb8a(255, 0, 0))).toBe('rgb(255 0 0)')
  })

  test('serializes RGBA (0-1) as rgb() with percentages', () => {
    expect(colorToString(rgba(1, 0, 0))).toBe('rgb(100% 0% 0%)')
  })

  test('serializes HSLA starting with hsl(', () => {
    const s = colorToString(hsla(0, 1, 0.5))
    expect(s.startsWith('hsl(')).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// rgb8aToHexString
// ---------------------------------------------------------------------------

describe('rgb8aToHexString', () => {
  test('converts RGB8A red to hex string', () => {
    expect(rgb8aToHexString(rgb8a(255, 0, 0))).toBe('#ff0000')
  })

  test('converts RGB8A white to hex string', () => {
    expect(rgb8aToHexString(rgb8a(255, 255, 255))).toBe('#ffffff')
  })
})
