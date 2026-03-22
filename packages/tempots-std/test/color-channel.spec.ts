import { describe, test, expect } from 'vitest'
import {
  getChannel,
  getChannels,
  getChannelsAsArray,
  withColor,
  withAlpha,
  isOpaque,
  isTransparent,
} from '../src/color-channel'
import { rgb8a, rgba, hsla, hsva, oklcha } from '../src/color'

describe('getChannel', () => {
  test('reads r from rgb8', () => {
    expect(getChannel(rgb8a(255, 0, 0), 'r')).toBe(255)
  })

  test('reads h from hsl', () => {
    expect(getChannel(hsla(120, 50, 75), 'h')).toBe(120)
  })

  test('reads alpha', () => {
    expect(getChannel(rgb8a(255, 0, 0, 0.5), 'alpha')).toBe(0.5)
  })

  test('reads c from oklch', () => {
    expect(getChannel(oklcha(0.5, 0.15, 326), 'c')).toBe(0.15)
  })
})

describe('getChannels', () => {
  test('returns channels without space', () => {
    const channels = getChannels(rgb8a(255, 128, 0))
    expect(channels).toEqual({ r: 255, g: 128, b: 0, alpha: 1 })
    expect('space' in channels).toBe(false)
  })

  test('works for hsl', () => {
    const channels = getChannels(hsla(120, 50, 75, 0.8))
    expect(channels).toEqual({ h: 120, s: 50, l: 75, alpha: 0.8 })
  })
})

describe('getChannelsAsArray', () => {
  test('rgb8 returns [r, g, b, alpha]', () => {
    expect(getChannelsAsArray(rgb8a(255, 0, 0))).toEqual([255, 0, 0, 1])
  })

  test('hsl returns [h, s, l, alpha]', () => {
    expect(getChannelsAsArray(hsla(120, 50, 75, 0.5))).toEqual([
      120, 50, 75, 0.5,
    ])
  })

  test('hsv returns [h, s, v, alpha]', () => {
    expect(getChannelsAsArray(hsva(0, 100, 100))).toEqual([0, 100, 100, 1])
  })

  test('oklch returns [l, c, h, alpha]', () => {
    expect(getChannelsAsArray(oklcha(0.5, 0.15, 326))).toEqual([
      0.5, 0.15, 326, 1,
    ])
  })

  test('rgb returns [r, g, b, alpha]', () => {
    expect(getChannelsAsArray(rgba(1, 0, 0))).toEqual([1, 0, 0, 1])
  })
})

describe('withColor', () => {
  test('changes a single channel in rgb8', () => {
    const result = withColor(rgb8a(255, 0, 0), { g: 255 })
    expect(result.space).toBe('rgb8')
    expect(result.r).toBe(255)
    expect(result.g).toBe(255)
    expect(result.b).toBe(0)
  })

  test('changes hue in hsl', () => {
    const result = withColor(hsla(0, 100, 50), { h: 120 })
    expect(result.space).toBe('hsl')
    expect(result.h).toBe(120)
    expect(result.s).toBe(100)
  })

  test('clamps out-of-range values', () => {
    const result = withColor(rgb8a(255, 0, 0), { r: 300 })
    expect(result.r).toBe(255)
  })

  test('wraps hue', () => {
    const result = withColor(hsla(0, 100, 50), { h: 400 })
    expect(result.h).toBe(40)
  })

  test('changes multiple channels', () => {
    const result = withColor(rgb8a(255, 0, 0), { g: 128, b: 64 })
    expect(result.r).toBe(255)
    expect(result.g).toBe(128)
    expect(result.b).toBe(64)
  })

  test('changes alpha', () => {
    const result = withColor(rgb8a(255, 0, 0), { alpha: 0.5 })
    expect(result.alpha).toBe(0.5)
  })

  test('preserves type for rgba', () => {
    const result = withColor(rgba(1, 0, 0), { g: 1 })
    expect(result.space).toBe('rgb')
    expect(result.g).toBe(1)
  })

  test('works with oklch', () => {
    const result = withColor(oklcha(0.5, 0.15, 326), { l: 0.8 })
    expect(result.space).toBe('oklch')
    expect(result.l).toBe(0.8)
    expect(result.c).toBe(0.15)
  })
})

describe('withAlpha', () => {
  test('sets alpha', () => {
    const result = withAlpha(rgb8a(255, 0, 0), 0.5)
    expect(result.alpha).toBe(0.5)
    expect(result.r).toBe(255)
    expect(result.space).toBe('rgb8')
  })

  test('clamps alpha', () => {
    expect(withAlpha(rgb8a(255, 0, 0), 1.5).alpha).toBe(1)
    expect(withAlpha(rgb8a(255, 0, 0), -0.5).alpha).toBe(0)
  })

  test('preserves type', () => {
    const result = withAlpha(hsla(120, 100, 50), 0.3)
    expect(result.space).toBe('hsl')
    expect(result.h).toBe(120)
  })
})

describe('isOpaque', () => {
  test('true for alpha 1', () => {
    expect(isOpaque(rgb8a(255, 0, 0))).toBe(true)
  })

  test('false for alpha < 1', () => {
    expect(isOpaque(rgb8a(255, 0, 0, 0.5))).toBe(false)
  })

  test('false for alpha 0', () => {
    expect(isOpaque(rgb8a(255, 0, 0, 0))).toBe(false)
  })
})

describe('isTransparent', () => {
  test('true for alpha 0', () => {
    expect(isTransparent(rgb8a(255, 0, 0, 0))).toBe(true)
  })

  test('false for alpha > 0', () => {
    expect(isTransparent(rgb8a(255, 0, 0, 0.5))).toBe(false)
  })

  test('false for alpha 1', () => {
    expect(isTransparent(rgb8a(255, 0, 0))).toBe(false)
  })
})
