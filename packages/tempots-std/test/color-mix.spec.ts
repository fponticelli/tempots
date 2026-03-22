import { describe, test, expect } from 'vitest'
import { mixColors, interpolateColors } from '../src/color-mix'
import { rgb8a, convertColor, type RGB8A } from '../src/color'

describe('mixColors', () => {
  test('should blend black and white to gray in rgb8 space', () => {
    const result = mixColors(
      rgb8a(0, 0, 0),
      rgb8a(255, 255, 255),
      0.5,
      'rgb8'
    ) as RGB8A
    expect(result.r).toBeGreaterThanOrEqual(126)
    expect(result.r).toBeLessThanOrEqual(130)
    expect(result.g).toBeGreaterThanOrEqual(126)
    expect(result.g).toBeLessThanOrEqual(130)
    expect(result.b).toBeGreaterThanOrEqual(126)
    expect(result.b).toBeLessThanOrEqual(130)
  })

  test('should return first color when t=0', () => {
    const black = rgb8a(0, 0, 0)
    const white = rgb8a(255, 255, 255)
    const result = mixColors(black, white, 0, 'rgb8') as RGB8A
    expect(result.r).toBe(0)
    expect(result.g).toBe(0)
    expect(result.b).toBe(0)
  })

  test('should return second color when t=1', () => {
    const black = rgb8a(0, 0, 0)
    const white = rgb8a(255, 255, 255)
    const result = mixColors(black, white, 1, 'rgb8') as RGB8A
    expect(result.r).toBe(255)
    expect(result.g).toBe(255)
    expect(result.b).toBe(255)
  })

  test('should default to oklch space', () => {
    const result = mixColors(rgb8a(0, 0, 0), rgb8a(255, 255, 255))
    expect(result.space).toBe('oklch')
  })

  test('should blend alpha channels', () => {
    const transparent = rgb8a(255, 0, 0, 0)
    const opaque = rgb8a(255, 0, 0, 1)
    const result = mixColors(transparent, opaque, 0.5, 'rgb8') as RGB8A
    expect(result.alpha).toBeCloseTo(0.5, 1)
  })
})

describe('interpolateColors', () => {
  test('should return the correct number of colors', () => {
    const result = interpolateColors(
      rgb8a(0, 0, 0),
      rgb8a(255, 255, 255),
      3,
      'rgb8'
    )
    expect(result).toHaveLength(3)
  })

  test('should have first color approximately equal to start', () => {
    const result = interpolateColors(
      rgb8a(0, 0, 0),
      rgb8a(255, 255, 255),
      3,
      'rgb8'
    )
    const first = result[0] as RGB8A
    expect(first.r).toBe(0)
    expect(first.g).toBe(0)
    expect(first.b).toBe(0)
  })

  test('should have last color approximately equal to end', () => {
    const result = interpolateColors(
      rgb8a(0, 0, 0),
      rgb8a(255, 255, 255),
      3,
      'rgb8'
    )
    const last = result[2] as RGB8A
    expect(last.r).toBe(255)
    expect(last.g).toBe(255)
    expect(last.b).toBe(255)
  })

  test('should have middle color approximately gray', () => {
    const result = interpolateColors(
      rgb8a(0, 0, 0),
      rgb8a(255, 255, 255),
      3,
      'rgb8'
    )
    const mid = result[1] as RGB8A
    expect(mid.r).toBeGreaterThanOrEqual(126)
    expect(mid.r).toBeLessThanOrEqual(130)
  })

  test('should return midpoint when steps is 1', () => {
    const result = interpolateColors(
      rgb8a(0, 0, 0),
      rgb8a(255, 255, 255),
      1,
      'rgb8'
    )
    expect(result).toHaveLength(1)
    const mid = result[0] as RGB8A
    expect(mid.r).toBeGreaterThanOrEqual(126)
    expect(mid.r).toBeLessThanOrEqual(130)
  })

  test('should return [start, end] when steps is 2', () => {
    const result = interpolateColors(
      rgb8a(0, 0, 0),
      rgb8a(255, 255, 255),
      2,
      'rgb8'
    )
    expect(result).toHaveLength(2)
    const first = result[0] as RGB8A
    const last = result[1] as RGB8A
    expect(first.r).toBe(0)
    expect(last.r).toBe(255)
  })
})
