import { describe, test, expect } from 'vitest'
import {
  complement,
  analogous,
  triadic,
  splitComplementary,
  tetradic,
} from '../src/color-harmony'
import { rgb8a, hsla, convertColor, type OKLCHA } from '../src/color'

const toOklch = (c: Parameters<typeof convertColor>[0]): OKLCHA =>
  convertColor(c, 'oklch') as OKLCHA

const hueDiff = (a: number, b: number): number => {
  const d = Math.abs(a - b) % 360
  return d > 180 ? 360 - d : d
}

const expectHueDiff = (
  actual: number,
  expected: number,
  tolerance = 25
): void => {
  const diff = hueDiff(actual, expected)
  expect(diff).toBeLessThanOrEqual(tolerance)
}

describe('complement', () => {
  test('should rotate hue by approximately 180 degrees', () => {
    const red = rgb8a(255, 0, 0)
    const comp = complement(red)
    const originalHue = toOklch(red).h
    const compHue = (convertColor(comp, 'oklch') as OKLCHA).h
    expectHueDiff(hueDiff(originalHue, compHue), 180)
  })

  test('should preserve the original color space', () => {
    const hslColor = hsla(0, 1, 0.5)
    const result = complement(hslColor)
    expect(result.space).toBe('hsl')
  })
})

describe('analogous', () => {
  test('should return 3 colors', () => {
    const result = analogous(rgb8a(255, 0, 0))
    expect(result).toHaveLength(3)
  })

  test('should have the input color as the first element', () => {
    const red = rgb8a(255, 0, 0)
    const [first] = analogous(red)
    expect(first).toBe(red)
  })

  test('should have rotated hues for the other two colors', () => {
    const red = rgb8a(255, 0, 0)
    const [, second, third] = analogous(red)
    const originalHue = toOklch(red).h
    const secondHue = (convertColor(second, 'oklch') as OKLCHA).h
    const thirdHue = (convertColor(third, 'oklch') as OKLCHA).h
    expectHueDiff(hueDiff(originalHue, secondHue), 30)
    expectHueDiff(hueDiff(originalHue, thirdHue), 30)
  })
})

describe('triadic', () => {
  test('should return 3 colors', () => {
    const result = triadic(rgb8a(255, 0, 0))
    expect(result).toHaveLength(3)
  })

  test('should have hues spaced approximately 120 degrees apart', () => {
    const red = rgb8a(255, 0, 0)
    const [a, b, c] = triadic(red)
    const hueA = (convertColor(a, 'oklch') as OKLCHA).h
    const hueB = (convertColor(b, 'oklch') as OKLCHA).h
    const hueC = (convertColor(c, 'oklch') as OKLCHA).h
    expectHueDiff(hueDiff(hueA, hueB), 120)
    expectHueDiff(hueDiff(hueB, hueC), 120)
  })
})

describe('splitComplementary', () => {
  test('should return 3 colors', () => {
    const result = splitComplementary(rgb8a(255, 0, 0))
    expect(result).toHaveLength(3)
  })

  test('should have the input color as the first element', () => {
    const red = rgb8a(255, 0, 0)
    const [first] = splitComplementary(red)
    expect(first).toBe(red)
  })
})

describe('tetradic', () => {
  test('should return 4 colors', () => {
    const result = tetradic(rgb8a(255, 0, 0))
    expect(result).toHaveLength(4)
  })

  test('should have hues spaced approximately 90 degrees apart', () => {
    const red = rgb8a(255, 0, 0)
    const colors = tetradic(red)
    const hues = colors.map(
      (c) => (convertColor(c, 'oklch') as OKLCHA).h
    )
    expectHueDiff(hueDiff(hues[0], hues[1]), 90)
    expectHueDiff(hueDiff(hues[1], hues[2]), 90)
    expectHueDiff(hueDiff(hues[2], hues[3]), 90)
  })
})
