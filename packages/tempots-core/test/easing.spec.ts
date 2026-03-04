import { describe, expect, test } from 'vitest'
import {
  linear,
  easeInQuad,
  easeOutQuad,
  easeInOutQuad,
  easeInCubic,
  easeOutCubic,
  easeInOutCubic,
  easeInQuart,
  easeOutQuart,
  easeInOutQuart,
  easeInSine,
  easeOutSine,
  easeInOutSine,
  easeInExpo,
  easeOutExpo,
  easeInOutExpo,
  easeInBack,
  easeOutBack,
  easeInOutBack,
  easeOutBounce,
  easeInBounce,
  easeInOutBounce,
  easeOutElastic,
  easeInElastic,
  easeInOutElastic,
  reverseEasing,
  mirrorEasing,
  chainEasing,
  type EasingFn,
} from '../src/easing'

const allEasings: [string, EasingFn][] = [
  ['linear', linear],
  ['easeInQuad', easeInQuad],
  ['easeOutQuad', easeOutQuad],
  ['easeInOutQuad', easeInOutQuad],
  ['easeInCubic', easeInCubic],
  ['easeOutCubic', easeOutCubic],
  ['easeInOutCubic', easeInOutCubic],
  ['easeInQuart', easeInQuart],
  ['easeOutQuart', easeOutQuart],
  ['easeInOutQuart', easeInOutQuart],
  ['easeInSine', easeInSine],
  ['easeOutSine', easeOutSine],
  ['easeInOutSine', easeInOutSine],
  ['easeInExpo', easeInExpo],
  ['easeOutExpo', easeOutExpo],
  ['easeInOutExpo', easeInOutExpo],
  ['easeInBack', easeInBack],
  ['easeOutBack', easeOutBack],
  ['easeInOutBack', easeInOutBack],
  ['easeOutBounce', easeOutBounce],
  ['easeInBounce', easeInBounce],
  ['easeInOutBounce', easeInOutBounce],
  ['easeOutElastic', easeOutElastic],
  ['easeInElastic', easeInElastic],
  ['easeInOutElastic', easeInOutElastic],
]

describe('easing functions', () => {
  describe('boundary conditions', () => {
    test.each(allEasings)('%s returns 0 at t=0', (_name, fn) => {
      expect(fn(0)).toBeCloseTo(0, 5)
    })

    test.each(allEasings)('%s returns 1 at t=1', (_name, fn) => {
      expect(fn(1)).toBeCloseTo(1, 5)
    })
  })

  describe('specific values', () => {
    test('linear is identity', () => {
      expect(linear(0.25)).toBe(0.25)
      expect(linear(0.5)).toBe(0.5)
      expect(linear(0.75)).toBe(0.75)
    })

    test('easeInQuad at 0.5 is 0.25', () => {
      expect(easeInQuad(0.5)).toBeCloseTo(0.25, 5)
    })

    test('easeOutQuad at 0.5 is 0.75', () => {
      expect(easeOutQuad(0.5)).toBeCloseTo(0.75, 5)
    })

    test('easeInOutQuad is symmetric around 0.5', () => {
      expect(easeInOutQuad(0.5)).toBeCloseTo(0.5, 5)
    })

    test('easeInCubic at 0.5 is 0.125', () => {
      expect(easeInCubic(0.5)).toBeCloseTo(0.125, 5)
    })

    test('easeOutCubic at 0.5 is 0.875', () => {
      expect(easeOutCubic(0.5)).toBeCloseTo(0.875, 5)
    })

    test('easeInQuart at 0.5 is 0.0625', () => {
      expect(easeInQuart(0.5)).toBeCloseTo(0.0625, 5)
    })

    test('easeOutQuart at 0.5 is 0.9375', () => {
      expect(easeOutQuart(0.5)).toBeCloseTo(0.9375, 5)
    })
  })

  describe('back easings overshoot', () => {
    test('easeInBack goes below 0', () => {
      const minValue = Math.min(
        ...Array.from({ length: 100 }, (_, i) => easeInBack(i / 100))
      )
      expect(minValue).toBeLessThan(0)
    })

    test('easeOutBack goes above 1', () => {
      const maxValue = Math.max(
        ...Array.from({ length: 100 }, (_, i) => easeOutBack(i / 100))
      )
      expect(maxValue).toBeGreaterThan(1)
    })
  })

  describe('elastic easings overshoot', () => {
    test('easeOutElastic overshoots above 1', () => {
      const maxValue = Math.max(
        ...Array.from({ length: 100 }, (_, i) => easeOutElastic(i / 100))
      )
      expect(maxValue).toBeGreaterThan(1)
    })

    test('easeInElastic goes below 0', () => {
      const minValue = Math.min(
        ...Array.from({ length: 100 }, (_, i) => easeInElastic(i / 100))
      )
      expect(minValue).toBeLessThan(0)
    })
  })

  describe('bounce easings stay in [0, 1]', () => {
    test('easeOutBounce stays in range', () => {
      for (let i = 0; i <= 100; i++) {
        const t = i / 100
        const v = easeOutBounce(t)
        expect(v).toBeGreaterThanOrEqual(0)
        expect(v).toBeLessThanOrEqual(1.001)
      }
    })

    test('easeInBounce stays in range', () => {
      for (let i = 0; i <= 100; i++) {
        const t = i / 100
        const v = easeInBounce(t)
        expect(v).toBeGreaterThanOrEqual(-0.001)
        expect(v).toBeLessThanOrEqual(1.001)
      }
    })
  })

  describe('expo edge cases', () => {
    test('easeInExpo at 0 returns exactly 0', () => {
      expect(easeInExpo(0)).toBe(0)
    })

    test('easeOutExpo at 1 returns exactly 1', () => {
      expect(easeOutExpo(1)).toBe(1)
    })

    test('easeInOutExpo at 0 and 1 returns exact values', () => {
      expect(easeInOutExpo(0)).toBe(0)
      expect(easeInOutExpo(1)).toBe(1)
    })
  })
})

describe('easing combinators', () => {
  describe('reverseEasing', () => {
    test('reverseEasing(easeInQuad) approximates easeOutQuad', () => {
      const reversed = reverseEasing(easeInQuad)
      for (let i = 0; i <= 10; i++) {
        const t = i / 10
        expect(reversed(t)).toBeCloseTo(easeOutQuad(t), 5)
      }
    })

    test('boundary conditions', () => {
      const reversed = reverseEasing(easeInCubic)
      expect(reversed(0)).toBeCloseTo(0, 5)
      expect(reversed(1)).toBeCloseTo(1, 5)
    })
  })

  describe('mirrorEasing', () => {
    test('mirrorEasing is symmetric around 0.5', () => {
      const mirrored = mirrorEasing(easeInQuad)
      expect(mirrored(0.25) + mirrored(0.75)).toBeCloseTo(1, 5)
    })

    test('boundary conditions', () => {
      const mirrored = mirrorEasing(easeInCubic)
      expect(mirrored(0)).toBeCloseTo(0, 5)
      expect(mirrored(1)).toBeCloseTo(1, 5)
      expect(mirrored(0.5)).toBeCloseTo(0.5, 5)
    })
  })

  describe('chainEasing', () => {
    test('chainEasing(linear, linear) behaves like linear', () => {
      const chained = chainEasing(linear, linear)
      for (let i = 0; i <= 10; i++) {
        const t = i / 10
        expect(chained(t)).toBeCloseTo(t, 5)
      }
    })

    test('boundary conditions', () => {
      const chained = chainEasing(easeInQuad, easeOutCubic)
      expect(chained(0)).toBeCloseTo(0, 5)
      expect(chained(1)).toBeCloseTo(1, 5)
    })

    test('midpoint continuity', () => {
      const chained = chainEasing(easeInQuad, easeOutQuad)
      expect(chained(0.5)).toBeCloseTo(0.5, 5)
    })
  })
})
