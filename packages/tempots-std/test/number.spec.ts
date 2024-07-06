import { describe, expect, test } from "vitest";
import {
  sign,
  wrap,
  angleDifference,
  ceilTo,
  floorTo,
  clamp,
  clampInt,
  clampSym,
  compare,
  interpolate,
  interpolateAngle,
  toHex
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

  test('compare', () => {
    expect(compare(1, 2)).toBe(-1)
    expect(compare(2, 1)).toBe(1)
    expect(compare(1, 1)).toBe(0)
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
})
