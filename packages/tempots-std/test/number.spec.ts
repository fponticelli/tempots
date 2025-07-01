import { describe, expect, test } from "vitest";
import {
  sign,
  wrap,
  wrapCircular,
  angleDifference,
  widestAngleDifference,
  ceilTo,
  floorTo,
  roundTo,
  clamp,
  clampInt,
  clampSym,
  interpolate,
  interpolateAngle,
  interpolateAngleCW,
  interpolateAngleCCW,
  interpolateWidestAngle,
  toHex,
  compareNumbers,
  nearEqual,
  nearEqualAngles,
  nearZero,
  root,
  EPSILON
} from '../src/number'

describe('numbers', () => {
  test('sign', () => {
    expect(sign(100)).toBe(1)
    expect(sign(1)).toBe(1)
    expect(sign(0)).toBe(1)
    expect(sign(-1)).toBe(-1)
    expect(sign(-100)).toBe(-1)
  })

  test('wrap', () => {
    expect(wrap(4,  5, 10)).toBe(5)
    expect(wrap(5,  5, 10)).toBe(5)
    expect(wrap(10, 5, 10)).toBe(10)
    expect(wrap(11, 5, 10)).toBe(5)
    expect(wrap(14, 5, 10)).toBe(8)
    expect(wrap(16, 5, 10)).toBe(10)
    expect(wrap(-5, 5, 10)).toBe(5)
  })

  test('angleDifference', () => {
    expect(angleDifference(0, 0)).toBe(0);
    expect(angleDifference(0, 1)).toBe(1);
    expect(angleDifference(1, 0)).toBe(-1);
    expect(angleDifference(0, 359)).toBe(-1);
    expect(angleDifference(359, 0)).toBe(1);
    expect(angleDifference(0, 180)).toBe(180);
    expect(angleDifference(180, 0)).toBe(180);
    expect(angleDifference(0, 270)).toBe(-90);
    expect(angleDifference(270, 0)).toBe(90);
  })

  test('ceilTo', () => {
    expect(ceilTo(1.1234, 1)).toBe(1.2)
    expect(ceilTo(1.1234, 2)).toBe(1.13)
    expect(ceilTo(1.1234, 3)).toBe(1.124)
  })

  test('floorTo', () => {
    expect(floorTo(1.1234, 1)).toBe(1.1)
    expect(floorTo(1.1234, 2)).toBe(1.12)
    expect(floorTo(1.1234, 3)).toBe(1.123)
  })

  test('clamp', () => {
    expect(clamp(1, 2, 3)).toBe(2)
    expect(clamp(2, 2, 3)).toBe(2)
    expect(clamp(3, 2, 3)).toBe(3)
    expect(clamp(4, 2, 3)).toBe(3)
  })

  test('clampInt', () => {
    expect(clampInt(1, 2, 3)).toBe(2)
    expect(clampInt(2, 2, 3)).toBe(2)
    expect(clampInt(3, 2, 3)).toBe(3)
    expect(clampInt(4, 2, 3)).toBe(3)
  })

  test('clampSym', () => {
    expect(clampSym(1, 2)).toBe(1)
    expect(clampSym(2, 2)).toBe(2)
    expect(clampSym(3, 2)).toBe(2)
    expect(clampSym(4, 2)).toBe(2)
    expect(clampSym(-1, 2)).toBe(-1)
    expect(clampSym(-2, 2)).toBe(-2)
    expect(clampSym(-3, 2)).toBe(-2)
    expect(clampSym(-4, 2)).toBe(-2)
  })

  test('compareNumbers', () => {
    expect(compareNumbers(1, 2)).toBe(-1)
    expect(compareNumbers(2, 1)).toBe(1)
    expect(compareNumbers(1, 1)).toBe(0)
  })

  test('interpolate', () => {
    expect(interpolate(5, 10, 0.5)).toBe(7.5)
    expect(interpolate(5, 10, 0.0)).toBe(5)
    expect(interpolate(5, 10, 1.0)).toBe(10)
  })

  test('toHex', () => {
    expect(toHex(0, 1)).toBe('0')
    expect(toHex(0, 2)).toBe('00')
    expect(toHex(255, 2)).toBe('ff')
  })

  test("interpolateAngle", () => {
    expect(interpolateAngle(0, 90, 0.5)).toBe(45);
    expect(interpolateAngle(0, 90, 0.0)).toBe(0);
    expect(interpolateAngle(0, 90, 1.0)).toBe(90);
    expect(interpolateAngle(0, 270, 0.5)).toBe(315);
    expect(interpolateAngle(0, 270, 0.0)).toBe(0);
    expect(interpolateAngle(0, 270, 1.0)).toBe(270);
    expect(interpolateAngle(0, 360, 0.5)).toBe(0);
    expect(interpolateAngle(0, 360, 0.0)).toBe(0);
    expect(interpolateAngle(0, 360, 1.0)).toBe(0);
    expect(interpolateAngle(0, 450, 0.5)).toBe(45);
    expect(interpolateAngle(0, 450, 0.0)).toBe(0);
    expect(interpolateAngle(0, 450, 1.0)).toBe(90);
    expect(interpolateAngle(0, 540, 0.5)).toBe(90);
    expect(interpolateAngle(0, 540, 0.0)).toBe(0);
    expect(interpolateAngle(0, 540, 1.0)).toBe(180);
  })

  test('wrapCircular', () => {
    expect(wrapCircular(5, 10)).toBe(5)
    expect(wrapCircular(15, 10)).toBe(5)
    expect(wrapCircular(-5, 10)).toBe(5)
    expect(wrapCircular(0, 10)).toBe(0)
    expect(wrapCircular(10, 10)).toBe(0)
    expect(wrapCircular(360, 360)).toBe(0)
    expect(wrapCircular(450, 360)).toBe(90)
    expect(wrapCircular(-90, 360)).toBe(270)
  })

  test('widestAngleDifference', () => {
    expect(widestAngleDifference(0, 90)).toBe(90)
    expect(widestAngleDifference(90, 0)).toBe(-90)
    expect(widestAngleDifference(0, 270)).toBe(-90)
    expect(widestAngleDifference(270, 0)).toBe(90)
    expect(widestAngleDifference(0, 180)).toBe(180)
    expect(widestAngleDifference(180, 0)).toBe(180)
    expect(widestAngleDifference(0, 0)).toBe(0)
  })

  test('roundTo', () => {
    expect(roundTo(1.234, 2)).toBe(1.23)
    expect(roundTo(1.235, 2)).toBe(1.24)
    expect(roundTo(1.234, 1)).toBe(1.2)
    expect(roundTo(1.25, 1)).toBe(1.3)
    expect(roundTo(1.234, 0)).toBe(1)
    expect(roundTo(1.5, 0)).toBe(2)
    expect(roundTo(-1.234, 2)).toBe(-1.23)
    expect(roundTo(-1.235, 2)).toBe(-1.24)
  })

  test('interpolateAngleCW', () => {
    expect(interpolateAngleCW(0, 90, 0.5)).toBe(45)
    expect(interpolateAngleCW(0, 90, 0.0)).toBe(0)
    expect(interpolateAngleCW(0, 90, 1.0)).toBe(90)
    expect(interpolateAngleCW(90, 0, 0.5)).toBe(225)
    expect(interpolateAngleCW(270, 90, 0.5)).toBe(0)
    expect(interpolateAngleCW(350, 10, 0.5)).toBe(0)
  })

  test('interpolateAngleCCW', () => {
    expect(interpolateAngleCCW(0, 90, 0.5)).toBe(225)
    expect(interpolateAngleCCW(0, 90, 0.0)).toBe(0)
    expect(interpolateAngleCCW(0, 90, 1.0)).toBe(90)
    expect(interpolateAngleCCW(90, 0, 0.5)).toBe(45)
    expect(interpolateAngleCCW(270, 90, 0.5)).toBe(180)
    expect(interpolateAngleCCW(10, 350, 0.5)).toBe(0)
  })

  test('interpolateWidestAngle', () => {
    expect(interpolateWidestAngle(0, 90, 0.5)).toBe(45)
    expect(interpolateWidestAngle(0, 270, 0.5)).toBe(315)
    expect(interpolateWidestAngle(90, 0, 0.5)).toBe(45)
    expect(interpolateWidestAngle(270, 90, 0.5)).toBe(0)
  })

  test('nearEqual', () => {
    expect(nearEqual(5, 5.000000000000001)).toBe(true)
    expect(nearEqual(5, 5.000000001)).toBe(false)
    expect(nearEqual(5, 5.000000001, 1e-8)).toBe(true)
    expect(nearEqual(0, 0)).toBe(true)
    expect(nearEqual(1, 2)).toBe(false)

    // Test with special values
    expect(nearEqual(NaN, NaN)).toBe(true)
    expect(nearEqual(NaN, 5)).toBe(false)
    expect(nearEqual(5, NaN)).toBe(false)
    expect(nearEqual(Infinity, Infinity)).toBe(true)
    expect(nearEqual(-Infinity, -Infinity)).toBe(true)
    expect(nearEqual(Infinity, -Infinity)).toBe(false)
    expect(nearEqual(Infinity, 5)).toBe(false)
    expect(nearEqual(5, Infinity)).toBe(false)
  })

  test('nearEqualAngles', () => {
    expect(nearEqualAngles(0, 360)).toBe(true)
    expect(nearEqualAngles(0, 361)).toBe(false)
    expect(nearEqualAngles(0, 360.000000000001)).toBe(true)
    expect(nearEqualAngles(0, 361, 360, 1)).toBe(true)
    expect(nearEqualAngles(359, 1)).toBe(false) // 359 to 1 is 2 degrees, not within epsilon
    expect(nearEqualAngles(1, 359)).toBe(false) // 1 to 359 is 2 degrees, not within epsilon
    expect(nearEqualAngles(180, 180)).toBe(true)
    expect(nearEqualAngles(0, 180)).toBe(false)
  })

  test('nearZero', () => {
    expect(nearZero(0.000000000000001)).toBe(true)
    expect(nearZero(0.000000001)).toBe(true) // 1e-9 is still within default EPSILON (1e-9)
    expect(nearZero(0.000000001, 1e-10)).toBe(false)
    expect(nearZero(0)).toBe(true)
    expect(nearZero(1)).toBe(false)
    expect(nearZero(-0.000000000000001)).toBe(true)
    expect(nearZero(-1)).toBe(false)
  })

  test('root', () => {
    expect(root(8, 3)).toBe(2)
    expect(root(27, 3)).toBe(3)
    expect(root(16, 4)).toBe(2)
    expect(root(1, 5)).toBe(1)
    expect(root(0, 3)).toBe(0)
    expect(root(64, 6)).toBe(2)
    expect(root(125, 3)).toBeCloseTo(5, 10) // Use toBeCloseTo for floating point precision
  })

  test('EPSILON constant', () => {
    expect(EPSILON).toBe(1e-9)
    expect(typeof EPSILON).toBe('number')
    expect(EPSILON > 0).toBe(true)
    expect(EPSILON < 1e-8).toBe(true)
  })
})
