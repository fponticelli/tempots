import { CMYK } from './cmyk'
import { HSL } from './hsl'
import { HSLuv } from './hsluv'
import { HSV } from './hsv'
import { LAB } from './lab'
import { LCH } from './lch'
import { LUV } from './luv'
import {
  _calculateMaxChromaHsluv,
  _calculateBoundingLines,
  _epsilon,
  _kappa,
  WHITE_REFERENCE,
} from './math'
import { RGB } from './rgb'
import { SRGB } from './srgb'
import { XYZ } from './xyz'

/**
 * @internal
 */
export const _cmyk2rgb = ([c, m, y, k]: [
  c: number,
  m: number,
  y: number,
  k: number,
]): [number, number, number] => {
  const r = (1 - c) * (1 - k)
  const g = (1 - m) * (1 - k)
  const b = (1 - y) * (1 - k)
  return [r, g, b]
}

/**
 * @internal
 */
export const _hsl2hsv = ([h, s, l]: [h: number, s: number, l: number]): [
  number,
  number,
  number,
] => {
  const v = l < 0.5 ? l * (1 + s) : l + s - l * s
  const m = l + l - v
  const sv = v !== 0 ? (v - m) / v : 0
  return [h, sv, v]
}

/**
 * @internal
 */
export const _hsv2hsl = ([h, s, v]: [h: number, s: number, v: number]): [
  number,
  number,
  number,
] => {
  const l = ((2 - s) * v) / 2
  if (l === 0) {
    return [h, 0, l]
  } else if (l === 1) {
    return [h, 0, l]
  } else if (l < 0.5) {
    return [h, (s * v) / (l * 2), l]
  } else {
    return [h, (s * v) / (2 - l * 2), l]
  }
}

/**
 * @internal
 */
export const _hsl2rgb = ([h, s, l]: [h: number, s: number, l: number]): [
  number,
  number,
  number,
] => {
  const a = s * Math.min(l, 1 - l)
  const f = (n: number, k = (n + h / 30) % 12): number =>
    l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
  return [f(0), f(8), f(4)]
}

/**
 * @internal
 */
export const _lab2lch = ([l, a, b]: [l: number, a: number, b: number]): [
  number,
  number,
  number,
] => {
  const h = (Math.atan2(b, a) * 180) / Math.PI
  if (h > 0) {
    return [l, Math.sqrt(a * a + b * b), h]
  } else {
    return [l, Math.sqrt(a * a + b * b), h + 360]
  }
}

/**
 * @internal
 */
export const _lab2xyz = (
  [l, a, b]: [l: number, a: number, b: number],
  [rx, ry, rz]: [number, number, number]
): [number, number, number] => {
  const fy = (l + 16) / 116
  const fx = a / 500 + fy
  const fz = fy - b / 200
  const x = rx * (fx ** 3 > _epsilon ? fx ** 3 : (116 * fx - 16) / _kappa)
  const y = ry * (l > _kappa * _epsilon ? ((l + 16) / 116) ** 3 : l / _kappa)
  const z = rz * (fz ** 3 > _epsilon ? fz ** 3 : (116 * fz - 16) / _kappa)
  return [x * 100, y * 100, z * 100]
}

/**
 * @internal
 */
export const _lch2lab = ([l, c, h]: [l: number, c: number, h: number]): [
  number,
  number,
  number,
] => {
  const hrad = (h * Math.PI) / 180
  return [l, c * Math.cos(hrad), c * Math.sin(hrad)]
}

/**
 * @internal
 */
export const _luv2xyz = (
  [l, u, v]: [l: number, u: number, v: number],
  [rx, ry, rz]: [number, number, number]
): [number, number, number] => {
  if (l === 0) {
    return [0, 0, 0]
  }
  const u0 = (4 * rx) / (rx + 15 * ry + 3 * rz)
  const v0 = (9 * ry) / (rx + 15 * ry + 3 * rz)
  const a = (1 / 3) * ((52 * l) / (u + 13 * l * u0) - 1)
  const y = l > _kappa * _epsilon ? ((l + 16) / 116) ** 3 : l / _kappa
  const b = -5 * y
  const c = -1 / 3
  const d = y * ((39 * l) / (v + 13 * l * v0) - 5)
  const x = (d - b) / (a - c)
  const z = x * a + b
  return [x * 100, y * 100, z * 100]
}

/**
 * @internal
 */
export const _rgb2cmyk = ([r, g, b]: [r: number, g: number, b: number]): [
  number,
  number,
  number,
  number,
] => {
  const k = 1 - Math.max(r, g, b)
  const c = (1 - r - k) / (1 - k)
  const m = (1 - g - k) / (1 - k)
  const y = (1 - b - k) / (1 - k)
  return [c, m, y, k]
}

/**
 * @internal
 */
export const _rgb2hsl = ([r, g, b]: [r: number, g: number, b: number]): [
  number,
  number,
  number,
] => {
  const a = Math.max(r, g, b)
  const n = a - Math.min(r, g, b)
  const f = 1 - Math.abs(a + a - n - 1)
  const h =
    n === 0
      ? 0
      : a === r
        ? (g - b) / n
        : a === g
          ? 2 + (b - r) / n
          : 4 + (r - g) / n
  return [60 * (h < 0 ? h + 6 : h), f !== 0 ? n / f : 0, (a + a - n) / 2]
}

/**
 * @internal
 */
export const _rgb2xyz = ([r, g, b]: [r: number, g: number, b: number]): [
  number,
  number,
  number,
] => {
  if (r > 0.04045) {
    r = Math.pow((r + 0.055) / 1.055, 2.4)
  } else {
    r = r / 12.92
  }
  if (g > 0.04045) {
    g = Math.pow((g + 0.055) / 1.055, 2.4)
  } else {
    g = g / 12.92
  }
  if (b > 0.04045) {
    b = Math.pow((b + 0.055) / 1.055, 2.4)
  } else {
    b = b / 12.92
  }
  return [
    (r * 0.4124564 + g * 0.3575761 + b * 0.1804375) * 100,
    (r * 0.2126729 + g * 0.7151522 + b * 0.072175) * 100,
    (r * 0.0193339 + g * 0.119192 + b * 0.9503041) * 100,
  ]
}

/**
 * @internal
 */
export const _xyz2lab = (
  [x, y, z]: [number, number, number],
  [rx, ry, rz]: [number, number, number]
): [number, number, number] => {
  const f = (t: number): number =>
    t > _epsilon ? Math.pow(t, 1 / 3) : (116 * t - 16) / _kappa
  const l = 116 * f(y / ry / 100) - 16
  const a = 500 * (f(x / rx / 100) - f(y / ry / 100))
  const b = 200 * (f(y / ry / 100) - f(z / rz / 100))
  return [l, a, b]
}

/**
 * @internal
 */
export const _xyz2luv = (
  [x, y, z]: [number, number, number],
  [rx, ry, rz]: [number, number, number]
): [number, number, number] => {
  x /= 100
  y /= 100
  z /= 100
  const yr = y / ry
  const up = (4 * x) / (x + 15 * y + 3 * z)
  const vp = (9 * y) / (x + 15 * y + 3 * z)
  const upr = (4 * rx) / (rx + 15 * ry + 3 * rz)
  const vpr = (9 * ry) / (rx + 15 * ry + 3 * rz)
  const l = yr > _epsilon ? 116 * Math.pow(yr, 1 / 3) - 16 : _kappa * yr
  const u = 13 * l * (up - upr)
  const v = 13 * l * (vp - vpr)
  return [l, u, v]
}

/**
 * @internal
 */
export const _xyz2rgb = ([x, y, z]: [number, number, number]): [
  number,
  number,
  number,
] => {
  function adj(v: number): number {
    if (Math.abs(v) < 0.0031308) {
      return 12.92 * v
    }
    return 1.055 * Math.pow(v, 0.41666) - 0.055
  }

  x /= 100
  y /= 100
  z /= 100

  const r = adj(x * 3.2404542 + y * -1.5371385 + z * -0.4985314)
  const g = adj(x * -0.969266 + y * 1.8760108 + z * 0.041556)
  const b = adj(x * 0.0556434 + y * -0.2040259 + z * 1.0572252)
  return [r, g, b]
}

/**
 * @internal
 */
export const _hsluv2lch = ([h, s, l]: [number, number, number]): [
  number,
  number,
  number,
] => {
  let lchL = 0
  let lchC = 0
  if (l > 99.9999999) {
    lchL = 100
  } else if (l >= 0.00000001) {
    lchL = l
    const [r0s, r0i, r1s, r1i, g0s, g0i, g1s, g1i, b0s, b0i, b1s, b1i] =
      _calculateBoundingLines(l)
    const max = _calculateMaxChromaHsluv(
      h,
      r0s,
      r0i,
      r1s,
      r1i,
      g0s,
      g0i,
      g1s,
      g1i,
      b0s,
      b0i,
      b1s,
      b1i
    )
    lchC = (max / 100) * s
  }
  return [lchL, lchC, h]
}

/**
 * @internal
 */
export const _lch2hsluv = ([l, c, h]: [number, number, number]): [
  number,
  number,
  number,
] => {
  let hsluvS = 0
  let hsluvL = 0
  if (l > 99.9999999) {
    hsluvL = 100
  } else if (l >= 0.00000001) {
    hsluvL = l
    const [r0s, r0i, r1s, r1i, g0s, g0i, g1s, g1i, b0s, b0i, b1s, b1i] =
      _calculateBoundingLines(l)
    const max = _calculateMaxChromaHsluv(
      h,
      r0s,
      r0i,
      r1s,
      r1i,
      g0s,
      g0i,
      g1s,
      g1i,
      b0s,
      b0i,
      b1s,
      b1i
    )
    hsluvS = (c / max) * 100
    hsluvL = l
  }
  return [h, hsluvS, hsluvL]
}

/**
 * @internal
 */
export const _cmyk2hsl = (cmyk: [number, number, number, number]) => {
  const rgb = _cmyk2rgb(cmyk)
  return _rgb2hsl(rgb)
}

/**
 * @internal
 */
export const _cmyk2hsluv = (
  cmyk: [number, number, number, number],
  whiteReference: [number, number, number]
) => {
  const lch = _cmyk2lch(cmyk, whiteReference)
  return _lch2hsluv(lch)
}

/**
 * @internal
 */
export const _cmyk2hsv = (cmyk: [number, number, number, number]) => {
  const rgb = _cmyk2rgb(cmyk)
  return _rgb2hsv(rgb)
}

/**
 * @internal
 */
export const _cmyk2lab = (
  cmyk: [number, number, number, number],
  whiteReference: [number, number, number]
) => {
  const rgb = _cmyk2rgb(cmyk)
  return _rgb2lab(rgb, whiteReference)
}

/**
 * @internal
 */
export const _cmyk2lch = (
  cmyk: [number, number, number, number],
  whiteReference: [number, number, number]
) => {
  const rgb = _cmyk2rgb(cmyk)
  return _rgb2lch(rgb, whiteReference)
}

/**
 * @internal
 */
export const _cmyk2luv = (
  cmyk: [number, number, number, number],
  whiteReference: [number, number, number]
) => {
  const rgb = _cmyk2rgb(cmyk)
  return _rgb2luv(rgb, whiteReference)
}

/**
 * @internal
 */
export const _cmyk2xyz = (cmyk: [number, number, number, number]) => {
  const rgb = _cmyk2rgb(cmyk)
  return _rgb2xyz(rgb)
}

/**
 * @internal
 */
export const _hsl2cmyk = (hsl: [number, number, number]) => {
  const rgb = _hsl2rgb(hsl)
  return _rgb2cmyk(rgb)
}

/**
 * @internal
 */
export const _hsl2lab = (
  hsl: [number, number, number],
  whiteReference: [number, number, number]
) => {
  const rgb = _hsl2rgb(hsl)
  return _rgb2lab(rgb, whiteReference)
}

/**
 * @internal
 */
export const _hsl2hsluv = (
  hsl: [number, number, number],
  whiteReference: [number, number, number]
) => {
  const lch = _hsl2lch(hsl, whiteReference)
  return _lch2hsluv(lch)
}

/**
 * @internal
 */
export const _hsl2lch = (
  hsl: [number, number, number],
  whiteReference: [number, number, number]
) => {
  const rgb = _hsl2rgb(hsl)
  return _rgb2lch(rgb, whiteReference)
}

/**
 * @internal
 */
export const _hsl2luv = (
  hsl: [number, number, number],
  whiteReference: [number, number, number]
) => {
  const rgb = _hsl2rgb(hsl)
  return _rgb2luv(rgb, whiteReference)
}

/**
 * @internal
 */
export const _hsl2xyz = (hsl: [number, number, number]) => {
  const rgb = _hsl2rgb(hsl)
  return _rgb2xyz(rgb)
}

/**
 * @internal
 */
export const _hsluv2cmyk = (
  hsluv: [number, number, number],
  whiteReference: [number, number, number]
) => {
  const lch = _hsluv2lch(hsluv)
  return _lch2cmyk(lch, whiteReference)
}

/**
 * @internal
 */
export const _hsluv2hsl = (
  hsluv: [number, number, number],
  whiteReference: [number, number, number]
) => {
  const lch = _hsluv2lch(hsluv)
  return _lch2hsl(lch, whiteReference)
}

/**
 * @internal
 */
export const _hsluv2lab = (hsluv: [number, number, number]) => {
  const lch = _hsluv2lch(hsluv)
  return _lch2lab(lch)
}

/**
 * @internal
 */
export const _hsluv2luv = (
  hsluv: [number, number, number],
  whiteReference: [number, number, number]
) => {
  const lch = _hsluv2lch(hsluv)
  return _lch2luv(lch, whiteReference)
}

/**
 * @internal
 */
export const _hsluv2hsv = (
  hsluv: [number, number, number],
  whiteReference: [number, number, number]
) => {
  const lch = _hsluv2lch(hsluv)
  return _lch2hsv(lch, whiteReference)
}

/**
 * @internal
 */
export const _hsluv2rgb = (
  hsluv: [number, number, number],
  whiteReference: [number, number, number]
) => {
  const lch = _hsluv2lch(hsluv)
  return _lch2rgb(lch, whiteReference)
}

/**
 * @internal
 */
export const _hsluv2xyz = (
  hsluv: [number, number, number],
  whiteReference: [number, number, number]
) => {
  const lch = _hsluv2lch(hsluv)
  return _lch2xyz(lch, whiteReference)
}

/**
 * @internal
 */
export const _hsv2cmyk = (hsv: [number, number, number]) => {
  const hsl = _hsv2hsl(hsv)
  return _hsl2cmyk(hsl)
}

/**
 * @internal
 */
export const _hsv2hsluv = (
  hsv: [number, number, number],
  whiteReference: [number, number, number]
) => {
  const hsl = _hsv2hsl(hsv)
  return _hsl2hsluv(hsl, whiteReference)
}

/**
 * @internal
 */
export const _hsv2lab = (
  hsv: [number, number, number],
  whiteReference: [number, number, number]
) => {
  const rgb = _hsv2rgb(hsv)
  return _rgb2lab(rgb, whiteReference)
}

/**
 * @internal
 */
export const _hsv2lch = (
  hsv: [number, number, number],
  whiteReference: [number, number, number]
) => {
  const rgb = _hsv2rgb(hsv)
  return _rgb2lch(rgb, whiteReference)
}

/**
 * @internal
 */
export const _hsv2luv = (
  hsv: [number, number, number],
  whiteReference: [number, number, number]
) => {
  const rgb = _hsv2rgb(hsv)
  return _rgb2luv(rgb, whiteReference)
}

/**
 * @internal
 */
export const _hsv2rgb = (hsv: [number, number, number]) => {
  const hsl = _hsv2hsl(hsv)
  return _hsl2rgb(hsl)
}

/**
 * @internal
 */
export const _hsv2xyz = (hsv: [number, number, number]) => {
  const hsl = _hsv2hsl(hsv)
  return _hsl2xyz(hsl)
}

/**
 * @internal
 */
export const _lab2cmyk = (
  lab: [number, number, number],
  whiteReference: [number, number, number]
) => {
  const rgb = _lab2rgb(lab, whiteReference)
  return _rgb2cmyk(rgb)
}

/**
 * @internal
 */
export const _lab2hsl = (
  lab: [number, number, number],
  whiteReference: [number, number, number]
) => {
  const rgb = _lab2rgb(lab, whiteReference)
  return _rgb2hsl(rgb)
}

/**
 * @internal
 */
export const _lab2hsluv = (lab: [number, number, number]) => {
  const lch = _lab2lch(lab)
  return _lch2hsluv(lch)
}

/**
 * @internal
 */
export const _lab2hsv = (
  lab: [number, number, number],
  whiteReference: [number, number, number]
) => {
  const rgb = _lab2rgb(lab, whiteReference)
  return _rgb2hsv(rgb)
}

/**
 * @internal
 */
export const _lab2luv = (
  lab: [number, number, number],
  whiteReference: [number, number, number]
) => {
  const rgb = _lab2rgb(lab, whiteReference)
  return _rgb2luv(rgb, whiteReference)
}

/**
 * @internal
 */
export const _lab2rgb = (
  lab: [number, number, number],
  whiteReference: [number, number, number]
) => {
  const xyz = _lab2xyz(lab, whiteReference)
  return _xyz2rgb(xyz)
}

/**
 * @internal
 */
export const _lch2cmyk = (
  lch: [number, number, number],
  whiteReference: [number, number, number]
) => {
  const rgb = _lch2rgb(lch, whiteReference)
  return _rgb2cmyk(rgb)
}

/**
 * @internal
 */
export const _lch2hsl = (
  lch: [number, number, number],
  whiteReference: [number, number, number]
) => {
  const rgb = _lch2rgb(lch, whiteReference)
  return _rgb2hsl(rgb)
}

/**
 * @internal
 */
export const _lch2hsv = (
  lch: [number, number, number],
  whiteReference: [number, number, number]
) => {
  const rgb = _lch2rgb(lch, whiteReference)
  return _rgb2hsv(rgb)
}

/**
 * @internal
 */
export const _lch2luv = (
  lch: [number, number, number],
  whiteReference: [number, number, number]
) => {
  const rgb = _lch2rgb(lch, whiteReference)
  return _rgb2luv(rgb, whiteReference)
}

/**
 * @internal
 */
export const _lch2rgb = (
  lch: [number, number, number],
  whiteReference: [number, number, number]
) => {
  const xyz = _lch2xyz(lch, whiteReference)
  return _xyz2rgb(xyz)
}

/**
 * @internal
 */
export const _lch2xyz = (
  lch: [number, number, number],
  whiteReference: [number, number, number]
) => {
  const lab = _lch2lab(lch)
  return _lab2xyz(lab, whiteReference)
}

/**
 * @internal
 */
export const _luv2cmyk = (
  luv: [number, number, number],
  whiteReference: [number, number, number]
) => {
  const rgb = _luv2rgb(luv, whiteReference)
  return _rgb2cmyk(rgb)
}

/**
 * @internal
 */
export const _luv2hsl = (
  luv: [number, number, number],
  whiteReference: [number, number, number]
) => {
  const rgb = _luv2rgb(luv, whiteReference)
  return _rgb2hsl(rgb)
}

/**
 * @internal
 */
export const _luv2hsluv = (
  luv: [number, number, number],
  whiteReference: [number, number, number]
) => {
  const lch = _luv2lch(luv, whiteReference)
  return _lch2hsluv(lch)
}

/**
 * @internal
 */
export const _luv2hsv = (
  luv: [number, number, number],
  whiteReference: [number, number, number]
) => {
  const rgb = _luv2rgb(luv, whiteReference)
  return _rgb2hsv(rgb)
}

/**
 * @internal
 */
export const _luv2lab = (
  luv: [number, number, number],
  whiteReference: [number, number, number]
) => {
  const rgb = _luv2rgb(luv, whiteReference)
  return _rgb2lab(rgb, whiteReference)
}

/**
 * @internal
 */
export const _luv2lch = (
  luv: [number, number, number],
  whiteReference: [number, number, number]
) => {
  const rgb = _luv2rgb(luv, whiteReference)
  return _rgb2lch(rgb, whiteReference)
}

/**
 * @internal
 */
export const _luv2rgb = (
  luv: [number, number, number],
  whiteReference: [number, number, number]
) => {
  const xyz = _luv2xyz(luv, whiteReference)
  return _xyz2rgb(xyz)
}

/**
 * @internal
 */
export const _rgb2hsluv = (
  rgb: [number, number, number],
  whiteReference: [number, number, number]
) => {
  const luv = _rgb2luv(rgb, whiteReference)
  return _luv2hsluv(luv, whiteReference)
}

/**
 * @internal
 */
export const _rgb2hsv = (rgb: [number, number, number]) => {
  const hsl = _rgb2hsl(rgb)
  return _hsl2hsv(hsl)
}

/**
 * @internal
 */
export const _rgb2lab = (
  rgb: [number, number, number],
  whiteReference: [number, number, number]
) => {
  const xyz = _rgb2xyz(rgb)
  return _xyz2lab(xyz, whiteReference)
}

/**
 * @internal
 */
export const _rgb2lch = (
  rgb: [number, number, number],
  whiteReference: [number, number, number]
) => {
  const lab = _rgb2lab(rgb, whiteReference)
  return _lab2lch(lab)
}

/**
 * @internal
 */
export const _rgb2luv = (
  rgb: [number, number, number],
  whiteReference: [number, number, number]
) => {
  const xyz = _rgb2xyz(rgb)
  return _xyz2luv(xyz, whiteReference)
}

/**
 * @internal
 */
export const _xyz2cmyk = (xyz: [number, number, number]) => {
  const rgb = _xyz2rgb(xyz)
  return _rgb2cmyk(rgb)
}

/**
 * @internal
 */
export const _xyz2hsl = (xyz: [number, number, number]) => {
  const rgb = _xyz2rgb(xyz)
  return _rgb2hsl(rgb)
}

/**
 * @internal
 */
export const _xyz2hsluv = (
  xyz: [number, number, number],
  whiteReference: [number, number, number]
) => {
  const luv = _xyz2luv(xyz, whiteReference)
  return _luv2hsluv(luv, whiteReference)
}

/**
 * @internal
 */
export const _xyz2hsv = (xyz: [number, number, number]) => {
  const rgb = _xyz2rgb(xyz)
  return _rgb2hsv(rgb)
}

/**
 * @internal
 */
export const _xyz2lch = (
  xyz: [number, number, number],
  whiteReference: [number, number, number]
) => {
  const lab = _xyz2lab(xyz, whiteReference)
  return _lab2lch(lab)
}

/**
 * Converts a CMYK color to LUV color space.
 * @param cmyk - The CMYK color to convert.
 * @param whiteReference - The white reference used for the conversion. Defaults to WHITE_REFERENCE.
 * @returns The converted LUV color.
 * @public
 */
export const cmyk2luv = (cmyk: CMYK, whiteReference = WHITE_REFERENCE): LUV =>
  LUV.ofChannels(_cmyk2luv(cmyk.toChannels(), whiteReference))

/**
 * Converts a CMYK color to an HSL color.
 *
 * @param cmyk - The CMYK color to convert.
 * @returns The corresponding HSL color.
 * @public
 */
export const cmyk2hsl = (cmyk: CMYK): HSL =>
  HSL.ofChannels(_cmyk2hsl(cmyk.toChannels()))

/**
 * Converts a CMYK color to an HSLuv color.
 *
 * @param cmyk - The CMYK color to convert.
 * @param whiteReference - The white reference used for the conversion. Defaults to WHITE_REFERENCE.
 * @returns The converted HSLuv color.
 * @public
 */
export const cmyk2hsluv = (
  cmyk: CMYK,
  whiteReference = WHITE_REFERENCE
): HSLuv => HSLuv.ofChannels(_cmyk2hsluv(cmyk.toChannels(), whiteReference))

/**
 * Converts a CMYK color to an HSV color.
 *
 * @param cmyk - The CMYK color to convert.
 * @returns The converted HSV color.
 * @public
 */
export const cmyk2hsv = (cmyk: CMYK): HSV =>
  HSV.ofChannels(_cmyk2hsv(cmyk.toChannels()))

/**
 * Converts a CMYK color to LAB color using a specified white reference.
 * @param cmyk - The CMYK color to convert.
 * @param whiteReference - The white reference used for the conversion. Defaults to `WHITE_REFERENCE`.
 * @returns The LAB color representation of the input CMYK color.
 * @public
 */
export const cmyk2lab = (cmyk: CMYK, whiteReference = WHITE_REFERENCE): LAB =>
  LAB.ofChannels(_cmyk2lab(cmyk.toChannels(), whiteReference))

/**
 * Converts a CMYK color to LCH color.
 * @param cmyk - The CMYK color to convert.
 * @param whiteReference - The white reference used for the conversion. Defaults to WHITE_REFERENCE.
 * @returns The converted LCH color.
 * @public
 */
export const cmyk2lch = (cmyk: CMYK, whiteReference = WHITE_REFERENCE): LCH =>
  LCH.ofChannels(_cmyk2lch(cmyk.toChannels(), whiteReference))

/**
 * Converts a CMYK color to an RGB color.
 *
 * @param cmyk - The CMYK color to convert.
 * @returns The converted RGB color.
 * @public
 */
export const cmyk2rgb = (cmyk: CMYK): RGB =>
  RGB.ofChannels(_cmyk2rgb(cmyk.toChannels()))

/**
 * Converts a CMYK color to an sRGB color.
 *
 * @param cmyk - The CMYK color to convert.
 * @returns The converted sRGB color.
 * @public
 */
export const cmyk2srgb = (cmyk: CMYK): SRGB =>
  SRGB.ofChannels(_cmyk2rgb(cmyk.toChannels()))

/**
 * Converts a CMYK color to XYZ color space.
 * @param cmyk - The CMYK color to convert.
 * @returns The converted XYZ color.
 * @public
 */
export const cmyk2xyz = (cmyk: CMYK): XYZ =>
  XYZ.ofChannels(_cmyk2xyz(cmyk.toChannels()))

/**
 * Converts an HSL color to CMYK color.
 *
 * @param hsl - The HSL color to convert.
 * @returns The CMYK color.
 * @public
 */
export const hsl2cmyk = (hsl: HSL): CMYK =>
  CMYK.ofChannels(_hsl2cmyk(hsl.toChannels()))

/**
 * Converts an HSL color to an HSLuv color.
 * @param hsl - The HSL color to convert.
 * @param whiteReference - The white reference used for the conversion. Defaults to WHITE_REFERENCE.
 * @returns The converted HSLuv color.
 * @public
 */
export const hsl2hsluv = (hsl: HSL, whiteReference = WHITE_REFERENCE): HSLuv =>
  HSLuv.ofChannels(_hsl2hsluv(hsl.toChannels(), whiteReference))

/**
 * Converts an HSL color value to LUV color space.
 * @param hsl - The HSL color value to convert.
 * @param whiteReference - The white reference value. Defaults to WHITE_REFERENCE.
 * @returns The LUV color value.
 * @public
 */
export const hsl2luv = (hsl: HSL, whiteReference = WHITE_REFERENCE): LUV =>
  LUV.ofChannels(_hsl2luv(hsl.toChannels(), whiteReference))

/**
 * Converts an HSL color to HSV color.
 *
 * @param hsl - The HSL color to convert.
 * @returns The corresponding HSV color.
 * @public
 */
export const hsl2hsv = (hsl: HSL): HSV =>
  HSV.ofChannels(_hsl2hsv(hsl.toChannels()))

/**
 * Converts an HSL color to LAB color.
 * @param hsl - The HSL color to convert.
 * @param whiteReference - The white reference color used for conversion. Defaults to `WHITE_REFERENCE`.
 * @returns The LAB color representation of the input HSL color.
 * @public
 */
export const hsl2lab = (hsl: HSL, whiteReference = WHITE_REFERENCE): LAB =>
  LAB.ofChannels(_hsl2lab(hsl.toChannels(), whiteReference))

/**
 * Converts an HSL color to LCH color.
 * @param hsl - The HSL color to convert.
 * @param whiteReference - The white reference used for the conversion. Defaults to WHITE_REFERENCE.
 * @returns The converted LCH color.
 * @public
 */
export const hsl2lch = (hsl: HSL, whiteReference = WHITE_REFERENCE): LCH =>
  LCH.ofChannels(_hsl2lch(hsl.toChannels(), whiteReference))

/**
 * Converts an HSL color value to an RGB color value.
 * @param hsl - The HSL color value to convert.
 * @returns The converted RGB color value.
 * @public
 */
export const hsl2rgb = (hsl: HSL): RGB =>
  RGB.ofChannels(_hsl2rgb(hsl.toChannels()))

/**
 * Converts an HSL color value to an SRGB color value.
 *
 * @param hsl - The HSL color value to convert.
 * @returns The converted SRGB color value.
 * @public
 */
export const hsl2srgb = (hsl: HSL): SRGB =>
  SRGB.ofChannels(_hsl2rgb(hsl.toChannels()))

/**
 * Converts an HSL color to XYZ color space.
 * @param hsl - The HSL color to convert.
 * @returns The converted XYZ color.
 * @public
 */
export const hsl2xyz = (hsl: HSL): XYZ =>
  XYZ.ofChannels(_hsl2xyz(hsl.toChannels()))

/**
 * Converts an HSLuv color to CMYK color.
 * @param hsluv - The HSLuv color to convert.
 * @param whiteReference - The white reference for the conversion. Defaults to WHITE_REFERENCE.
 * @returns The CMYK color.
 * @public
 */
export const hsluv2cmyk = (
  hsluv: HSLuv,
  whiteReference = WHITE_REFERENCE
): CMYK => CMYK.ofChannels(_hsluv2cmyk(hsluv.toChannels(), whiteReference))

/**
 * Converts an HSLuv color to an HSL color.
 *
 * @param hsluv - The HSLuv color to convert.
 * @param whiteReference - The white reference used for the conversion. Defaults to `WHITE_REFERENCE`.
 * @returns The converted HSL color.
 * @public
 */
export const hsluv2hsl = (
  hsluv: HSLuv,
  whiteReference = WHITE_REFERENCE
): HSL => HSL.ofChannels(_hsluv2hsl(hsluv.toChannels(), whiteReference))

/**
 * Converts an HSLuv color to LUV color.
 *
 * @param hsluv - The HSLuv color to convert.
 * @param whiteReference - The white reference used for the conversion. Defaults to `WHITE_REFERENCE`.
 * @returns The converted LUV color.
 * @public
 */
export const hsluv2luv = (
  hsluv: HSLuv,
  whiteReference = WHITE_REFERENCE
): LUV => LUV.ofChannels(_hsluv2luv(hsluv.toChannels(), whiteReference))

/**
 * Converts an HSLuv color to an HSV color.
 * @param hsluv - The HSLuv color to convert.
 * @param whiteReference - The white reference used for the conversion. Defaults to WHITE_REFERENCE.
 * @returns The converted HSV color.
 * @public
 */
export const hsluv2hsv = (
  hsluv: HSLuv,
  whiteReference = WHITE_REFERENCE
): HSV => HSV.ofChannels(_hsluv2hsv(hsluv.toChannels(), whiteReference))

/**
 * Converts an HSLuv color to LAB color.
 * @param hsluv - The HSLuv color to convert.
 * @returns The LAB color.
 * @public
 */
export const hsluv2lab = (hsluv: HSLuv): LAB =>
  LAB.ofChannels(_hsluv2lab(hsluv.toChannels()))

/**
 * Converts an HSLuv color to LCH color.
 *
 * @param hsluv - The HSLuv color to convert.
 * @returns The converted LCH color.
 * @public
 */
export const hsluv2lch = (hsluv: HSLuv): LCH =>
  LCH.ofChannels(_hsluv2lch(hsluv.toChannels()))

/**
 * Converts an HSLuv color value to an RGB color value.
 *
 * @param hsluv - The HSLuv color value to convert.
 * @param whiteReference - The white reference value. Defaults to `WHITE_REFERENCE`.
 * @returns The converted RGB color value.
 * @public
 */
export const hsluv2rgb = (
  hsluv: HSLuv,
  whiteReference = WHITE_REFERENCE
): RGB => RGB.ofChannels(_hsluv2rgb(hsluv.toChannels(), whiteReference))

/**
 * Converts an HSLuv color value to an sRGB color value.
 *
 * @param hsluv - The HSLuv color value to convert.
 * @param whiteReference - The white reference value. Defaults to `WHITE_REFERENCE`.
 * @returns The converted sRGB color value.
 * @public
 */
export const hsluv2srgb = (
  hsluv: HSLuv,
  whiteReference = WHITE_REFERENCE
): SRGB => SRGB.ofChannels(_hsluv2rgb(hsluv.toChannels(), whiteReference))

/**
 * Converts an HSLuv color to XYZ color space.
 *
 * @param hsluv - The HSLuv color to convert.
 * @param whiteReference - The white reference used for the conversion. Defaults to `WHITE_REFERENCE`.
 * @returns The converted XYZ color.
 * @public
 */
export const hsluv2xyz = (
  hsluv: HSLuv,
  whiteReference = WHITE_REFERENCE
): XYZ => XYZ.ofChannels(_hsluv2xyz(hsluv.toChannels(), whiteReference))

/**
 * Converts an HSV color to CMYK color.
 * @param hsv - The HSV color to convert.
 * @returns The CMYK color representation of the given HSV color.
 * @public
 */
export const hsv2cmyk = (hsv: HSV): CMYK =>
  CMYK.ofChannels(_hsv2cmyk(hsv.toChannels()))

/**
 * Converts an HSV color value to HSL.
 * @param hsv - The HSV color value to convert.
 * @returns The equivalent HSL color value.
 * @public
 */
export const hsv2hsl = (hsv: HSV): HSL =>
  HSL.ofChannels(_hsv2hsl(hsv.toChannels()))

/**
 * Converts an HSV color value to an HSLuv color value.
 * @param hsv - The HSV color value to convert.
 * @param whiteReference - The white reference used for the conversion. Defaults to WHITE_REFERENCE.
 * @returns The converted HSLuv color value.
 * @public
 */
export const hsv2hsluv = (hsv: HSV, whiteReference = WHITE_REFERENCE): HSLuv =>
  HSLuv.ofChannels(_hsv2hsluv(hsv.toChannels(), whiteReference))

/**
 * Converts an HSV color value to a LAB color value.
 * @param hsv - The HSV color value to convert.
 * @param whiteReference - The white reference used for the conversion. Defaults to WHITE_REFERENCE.
 * @returns The converted LAB color value.
 * @public
 */
export const hsv2lab = (hsv: HSV, whiteReference = WHITE_REFERENCE): LAB =>
  LAB.ofChannels(_hsv2lab(hsv.toChannels(), whiteReference))

/**
 * Converts an HSV color value to an LCH color value.
 * @param hsv - The HSV color value to convert.
 * @param whiteReference - The white reference value. Defaults to WHITE_REFERENCE.
 * @returns The converted LCH color value.
 * @public
 */
export const hsv2lch = (hsv: HSV, whiteReference = WHITE_REFERENCE): LCH =>
  LCH.ofChannels(_hsv2lch(hsv.toChannels(), whiteReference))

/**
 * Converts an HSV color value to an LUV color value.
 * @param hsv - The HSV color value to convert.
 * @param whiteReference - The white reference used for the conversion. Defaults to WHITE_REFERENCE.
 * @returns The converted LUV color value.
 * @public
 */
export const hsv2luv = (hsv: HSV, whiteReference = WHITE_REFERENCE): LUV =>
  LUV.ofChannels(_hsv2luv(hsv.toChannels(), whiteReference))

/**
 * Converts an HSV color value to an RGB color value.
 * @param hsv - The HSV color value to convert.
 * @returns The corresponding RGB color value.
 * @public
 */
export const hsv2rgb = (hsv: HSV): RGB =>
  RGB.ofChannels(_hsv2rgb(hsv.toChannels()))

/**
 * Converts an HSV color value to an SRGB color value.
 * @param hsv - The HSV color value to convert.
 * @returns The converted SRGB color value.
 * @public
 */
export const hsv2srgb = (hsv: HSV): SRGB =>
  SRGB.ofChannels(_hsv2rgb(hsv.toChannels()))

/**
 * Converts an HSV color to XYZ color space.
 *
 * @param hsv - The HSV color to convert.
 * @returns The converted XYZ color.
 * @public
 */
export const hsv2xyz = (hsv: HSV): XYZ =>
  XYZ.ofChannels(_hsv2xyz(hsv.toChannels()))

/**
 * Converts a color from LAB color space to CMYK color space.
 * @param lab - The LAB color to convert.
 * @param whiteReference - The white reference used for the conversion. Defaults to WHITE_REFERENCE.
 * @returns The color converted to CMYK color space.
 * @public
 */
export const lab2cmyk = (lab: LAB, whiteReference = WHITE_REFERENCE): CMYK =>
  CMYK.ofChannels(_lab2cmyk(lab.toChannels(), whiteReference))

/**
 * Converts a color from LAB color space to HSL color space.
 * @param lab - The LAB color to convert.
 * @param whiteReference - The white reference used for the conversion. Defaults to WHITE_REFERENCE.
 * @returns The color converted to HSL color space.
 * @public
 */
export const lab2hsl = (lab: LAB, whiteReference = WHITE_REFERENCE): HSL =>
  HSL.ofChannels(_lab2hsl(lab.toChannels(), whiteReference))

/**
 * Converts a LAB color to HSLuv color.
 * @param lab - The LAB color to convert.
 * @returns The corresponding HSLuv color.
 * @public
 */
export const lab2hsluv = (lab: LAB): HSLuv =>
  HSLuv.ofChannels(_lab2hsluv(lab.toChannels()))

/**
 * Converts a color from LAB color space to HSV color space.
 * @param lab - The LAB color to convert.
 * @param whiteReference - The white reference used for the conversion. Defaults to WHITE_REFERENCE.
 * @returns The color converted to HSV color space.
 * @public
 */
export const lab2hsv = (lab: LAB, whiteReference = WHITE_REFERENCE): HSV =>
  HSV.ofChannels(_lab2hsv(lab.toChannels(), whiteReference))

/**
 * Converts a LAB color to LCH color.
 * @param lab - The LAB color to convert.
 * @returns The converted LCH color.
 * @public
 */
export const lab2lch = (lab: LAB): LCH =>
  LCH.ofChannels(_lab2lch(lab.toChannels()))

/**
 * Converts a color from LAB color space to LUV color space.
 * @param lab - The LAB color to convert.
 * @param whiteReference - The white reference used for the conversion. Defaults to WHITE_REFERENCE.
 * @returns The color converted to LUV color space.
 * @public
 */
export const lab2luv = (lab: LAB, whiteReference = WHITE_REFERENCE): LUV =>
  LUV.ofChannels(_lab2luv(lab.toChannels(), whiteReference))

/**
 * Converts a color from LAB color space to RGB color space.
 * @param lab - The LAB color to convert.
 * @param whiteReference - The white reference used for the conversion. Defaults to WHITE_REFERENCE.
 * @returns The converted color in RGB color space.
 * @public
 */
export const lab2rgb = (lab: LAB, whiteReference = WHITE_REFERENCE): RGB =>
  RGB.ofChannels(_lab2rgb(lab.toChannels(), whiteReference))

/**
 * Converts a color from LAB color space to SRGB color space.
 * @param lab - The LAB color to convert.
 * @param whiteReference - The white reference used for the conversion. Defaults to `WHITE_REFERENCE`.
 * @returns The color converted to SRGB color space.
 * @public
 */
export const lab2srgb = (lab: LAB, whiteReference = WHITE_REFERENCE): SRGB =>
  SRGB.ofChannels(_lab2rgb(lab.toChannels(), whiteReference))

/**
 * Converts a color from LAB color space to XYZ color space.
 * @param lab - The LAB color to convert.
 * @param whiteReference - The white reference used for the conversion. Defaults to WHITE_REFERENCE.
 * @returns The color converted to XYZ color space.
 * @public
 */
export const lab2xyz = (lab: LAB, whiteReference = WHITE_REFERENCE): XYZ =>
  XYZ.ofChannels(_lab2xyz(lab.toChannels(), whiteReference))

/**
 * Converts an LCH color to CMYK color.
 * @param lch - The LCH color to convert.
 * @param whiteReference - The white reference used for the conversion. Defaults to WHITE_REFERENCE.
 * @returns The CMYK color.
 * @public
 */
export const lch2cmyk = (lch: LCH, whiteReference = WHITE_REFERENCE): CMYK =>
  CMYK.ofChannels(_lch2cmyk(lch.toChannels(), whiteReference))

/**
 * Converts a color in LCH color space to HSL color space.
 * @param lch - The LCH color to convert.
 * @param whiteReference - The white reference color. Defaults to WHITE_REFERENCE.
 * @returns The color in HSL color space.
 * @public
 */
export const lch2hsl = (lch: LCH, whiteReference = WHITE_REFERENCE): HSL =>
  HSL.ofChannels(_lch2hsl(lch.toChannels(), whiteReference))

/**
 * Converts a color in the LCH color space to the HSLuv color space.
 * @param lch - The LCH color to convert.
 * @returns The color in the HSLuv color space.
 * @public
 */
export const lch2hsluv = (lch: LCH): HSLuv => {
  const c = _lch2hsluv(lch.toChannels())
  return HSLuv.ofChannels(c)
}

/**
 * Converts a color in the LCH color space to the HSV color space.
 * @param lch - The color in the LCH color space.
 * @param whiteReference - The white reference color used for conversion. Defaults to WHITE_REFERENCE.
 * @returns The color in the HSV color space.
 * @public
 */
export const lch2hsv = (lch: LCH, whiteReference = WHITE_REFERENCE): HSV =>
  HSV.ofChannels(_lch2hsv(lch.toChannels(), whiteReference))

/**
 * Converts a color in LCH color space to LAB color space.
 * @param lch - The color in LCH color space.
 * @returns The color in LAB color space.
 * @public
 */
export const lch2lab = (lch: LCH): LAB =>
  LAB.ofChannels(_lch2lab(lch.toChannels()))

/**
 * Converts a color from LCH (Lightness, Chroma, Hue) to LUV (Lightness, U, V) color space.
 * @param lch - The LCH color to convert.
 * @param whiteReference - The white reference color used for the conversion. Defaults to WHITE_REFERENCE.
 * @returns The color converted to LUV color space.
 * @public
 */
export const lch2luv = (lch: LCH, whiteReference = WHITE_REFERENCE): LUV =>
  LUV.ofChannels(_lch2luv(lch.toChannels(), whiteReference))

/**
 * Converts an LCH color value to an RGB color value.
 * @param lch - The LCH color value to convert.
 * @param whiteReference - The white reference used for the conversion. Defaults to `WHITE_REFERENCE`.
 * @returns The converted RGB color value.
 * @public
 */
export const lch2rgb = (lch: LCH, whiteReference = WHITE_REFERENCE): RGB =>
  RGB.ofChannels(_lch2rgb(lch.toChannels(), whiteReference))

/**
 * Converts an LCH color value to an sRGB color value.
 * @param lch - The LCH color value to convert.
 * @param whiteReference - The white reference value. Defaults to WHITE_REFERENCE.
 * @returns The converted sRGB color value.
 * @public
 */
export const lch2srgb = (lch: LCH, whiteReference = WHITE_REFERENCE): SRGB =>
  SRGB.ofChannels(_lch2rgb(lch.toChannels(), whiteReference))

/**
 * Converts a color in the LCH color space to the XYZ color space.
 * @param lch - The color in the LCH color space.
 * @param whiteReference - The white reference used for the conversion. Defaults to WHITE_REFERENCE.
 * @returns The color in the XYZ color space.
 * @public
 */
export const lch2xyz = (lch: LCH, whiteReference = WHITE_REFERENCE): XYZ =>
  XYZ.ofChannels(_lch2xyz(lch.toChannels(), whiteReference))

/**
 * Converts an LUV color to CMYK color.
 *
 * @param luv - The LUV color to convert.
 * @param whiteReference - The white reference used for the conversion. Defaults to `WHITE_REFERENCE`.
 * @returns The CMYK color representation of the input LUV color.
 * @public
 */
export const luv2cmyk = (luv: LUV, whiteReference = WHITE_REFERENCE): CMYK =>
  CMYK.ofChannels(_luv2cmyk(luv.toChannels(), whiteReference))

/**
 * Converts a color from LUV color space to HSL color space.
 * @param luv - The LUV color to convert.
 * @param whiteReference - The white reference used for the conversion. Defaults to WHITE_REFERENCE.
 * @returns The color converted to HSL color space.
 * @public
 */
export const luv2hsl = (luv: LUV, whiteReference = WHITE_REFERENCE): HSL =>
  HSL.ofChannels(_luv2hsl(luv.toChannels(), whiteReference))

/**
 * Converts a color from LUV color space to HSLuv color space.
 * @param luv - The LUV color to convert.
 * @param whiteReference - The white reference used for the conversion. Defaults to WHITE_REFERENCE.
 * @returns The color in HSLuv color space.
 * @public
 */
export const luv2hsluv = (luv: LUV, whiteReference = WHITE_REFERENCE): HSLuv =>
  HSLuv.ofChannels(_luv2hsluv(luv.toChannels(), whiteReference))

/**
 * Converts a color from LUV color space to HSV color space.
 * @param luv - The LUV color to convert.
 * @param whiteReference - The white reference used for the conversion. Defaults to WHITE_REFERENCE.
 * @returns The color converted to HSV color space.
 * @public
 */
export const luv2hsv = (luv: LUV, whiteReference = WHITE_REFERENCE): HSV =>
  HSV.ofChannels(_luv2hsv(luv.toChannels(), whiteReference))

/**
 * Converts a color in LUV color space to LAB color space.
 * @param luv - The color in LUV color space.
 * @param whiteReference - The white reference color in LAB color space. Defaults to WHITE_REFERENCE.
 * @returns The color in LAB color space.
 * @public
 */
export const luv2lab = (luv: LUV, whiteReference = WHITE_REFERENCE): LAB =>
  LAB.ofChannels(_luv2lab(luv.toChannels(), whiteReference))

/**
 * Converts a color in LUV color space to LCH color space.
 * @param luv - The LUV color to convert.
 * @param whiteReference - The white reference used for the conversion. Defaults to WHITE_REFERENCE.
 * @returns The color in LCH color space.
 * @public
 */
export const luv2lch = (luv: LUV, whiteReference = WHITE_REFERENCE): LCH =>
  LCH.ofChannels(_luv2lch(luv.toChannels(), whiteReference))

/**
 * Converts a color from LUV color space to RGB color space.
 *
 * @param luv - The LUV color to convert.
 * @param whiteReference - The white reference used for the conversion. Defaults to `WHITE_REFERENCE`.
 * @returns The converted color in RGB color space.
 * @public
 */
export const luv2rgb = (luv: LUV, whiteReference = WHITE_REFERENCE): RGB =>
  RGB.ofChannels(_luv2rgb(luv.toChannels(), whiteReference))

/**
 * Converts a color from LUV color space to SRGB color space.
 * @param luv - The color in LUV color space.
 * @param whiteReference - The white reference used for the conversion. Defaults to WHITE_REFERENCE.
 * @returns The color in SRGB color space.
 * @public
 */
export const luv2srgb = (luv: LUV, whiteReference = WHITE_REFERENCE): SRGB =>
  SRGB.ofChannels(_luv2rgb(luv.toChannels(), whiteReference))

/**
 * Converts a color in LUV color space to XYZ color space.
 *
 * @param luv - The color in LUV color space.
 * @param whiteReference - The white reference used for the conversion. Defaults to `WHITE_REFERENCE`.
 * @returns The color in XYZ color space.
 * @public
 */
export const luv2xyz = (luv: LUV, whiteReference = WHITE_REFERENCE): XYZ =>
  XYZ.ofChannels(_luv2xyz(luv.toChannels(), whiteReference))

/**
 * Converts an RGB color to CMYK color representation.
 * @param rgb - The RGB color to convert.
 * @returns The CMYK color representation.
 * @public
 */
export const rgb2cmyk = (rgb: RGB): CMYK =>
  CMYK.ofChannels(_rgb2cmyk(rgb.toChannels()))

/**
 * Converts an RGB color to HSL color.
 *
 * @param rgb - The RGB color to convert.
 * @returns The corresponding HSL color.
 * @public
 */
export const rgb2hsl = (rgb: RGB): HSL =>
  HSL.ofChannels(_rgb2hsl(rgb.toChannels()))

/**
 * Converts an RGB color to HSLuv color.
 * @param rgb - The RGB color to convert.
 * @param whiteReference - The white reference used for the conversion. Defaults to WHITE_REFERENCE.
 * @returns The HSLuv color.
 * @public
 */
export const rgb2hsluv = (rgb: RGB, whiteReference = WHITE_REFERENCE): HSLuv =>
  HSLuv.ofChannels(_rgb2hsluv(rgb.toChannels(), whiteReference))

/**
 * Converts an RGB color value to its corresponding HSV representation.
 *
 * @param rgb - The RGB color value to convert.
 * @returns The HSV representation of the given RGB color value.
 * @public
 */
export const rgb2hsv = (rgb: RGB): HSV =>
  HSV.ofChannels(_rgb2hsv(rgb.toChannels()))

/**
 * Converts an RGB color to the LAB color space.
 * @param rgb - The RGB color to convert.
 * @param whiteReference - The white reference used for the conversion. Defaults to WHITE_REFERENCE.
 * @returns The LAB color representation of the input RGB color.
 * @public
 */
export const rgb2lab = (rgb: RGB, whiteReference = WHITE_REFERENCE): LAB =>
  LAB.ofChannels(_rgb2lab(rgb.toChannels(), whiteReference))

/**
 * Converts an RGB color to LCH color.
 * @param rgb - The RGB color to convert.
 * @param whiteReference - The white reference color. Defaults to WHITE_REFERENCE.
 * @returns The LCH color.
 * @public
 */
export const rgb2lch = (rgb: RGB, whiteReference = WHITE_REFERENCE): LCH =>
  LCH.ofChannels(_rgb2lch(rgb.toChannels(), whiteReference))

/**
 * Converts an RGB color to LUV color space.
 * @param rgb - The RGB color to convert.
 * @param whiteReference - The white reference used for the conversion. Defaults to `WHITE_REFERENCE`.
 * @returns The converted LUV color.
 * @public
 */
export const rgb2luv = (rgb: RGB, whiteReference = WHITE_REFERENCE): LUV =>
  LUV.ofChannels(_rgb2luv(rgb.toChannels(), whiteReference))

/**
 * Converts an RGB color to an sRGB color.
 *
 * @param rgb - The RGB color to convert.
 * @returns The converted sRGB color.
 * @public
 */
export const rgb2srgb = (rgb: RGB): SRGB => {
  const srgb = rgb.toChannels()
  return SRGB.ofChannels(srgb)
}

/**
 * Converts an RGB color to XYZ color space.
 *
 * @param rgb - The RGB color to convert.
 * @returns The corresponding XYZ color.
 * @public
 */
export const rgb2xyz = (rgb: RGB): XYZ =>
  XYZ.ofChannels(_rgb2xyz(rgb.toChannels()))

/**
 * Converts an SRGB color to CMYK color.
 * @param srgb - The SRGB color to convert.
 * @returns The CMYK color.
 * @public
 */
export const srgb2cmyk = (srgb: SRGB): CMYK =>
  CMYK.ofChannels(_rgb2cmyk(srgb.toChannels()))

/**
 * Converts an sRGB color to HSV color space.
 * @param srgb - The sRGB color to convert.
 * @returns The HSV representation of the sRGB color.
 * @public
 */
export const srgb2hsv = (srgb: SRGB): HSV =>
  HSV.ofChannels(_rgb2hsv(srgb.toChannels()))

/**
 * Converts an SRGB color value to HSL color space.
 * @param srgb - The SRGB color value to convert.
 * @returns The corresponding HSL color value.
 * @public
 */
export const srgb2hsl = (srgb: SRGB): HSL =>
  HSL.ofChannels(_rgb2hsl(srgb.toChannels()))

/**
 * Converts an sRGB color value to an HSLuv color value.
 * @param srgb - The sRGB color value to convert.
 * @param whiteReference - The white reference value. Defaults to WHITE_REFERENCE.
 * @returns The converted HSLuv color value.
 * @public
 */
export const srgb2hsluv = (
  srgb: SRGB,
  whiteReference = WHITE_REFERENCE
): HSLuv => HSLuv.ofChannels(_rgb2hsluv(srgb.toChannels(), whiteReference))

/**
 * Converts an SRGB color to LAB color space.
 * @param srgb - The SRGB color to convert.
 * @param whiteReference - The white reference used for the conversion. Defaults to WHITE_REFERENCE.
 * @returns The LAB color representation of the input SRGB color.
 * @public
 */
export const srgb2lab = (srgb: SRGB, whiteReference = WHITE_REFERENCE): LAB =>
  LAB.ofChannels(_rgb2lab(srgb.toChannels(), whiteReference))

/**
 * Converts an sRGB color to LCH color.
 * @param srgb - The sRGB color to convert.
 * @param whiteReference - The white reference used for the conversion. Defaults to `WHITE_REFERENCE`.
 * @returns The converted LCH color.
 * @public
 */
export const srgb2lch = (srgb: SRGB, whiteReference = WHITE_REFERENCE): LCH =>
  LCH.ofChannels(_rgb2lch(srgb.toChannels(), whiteReference))

/**
 * Converts an sRGB color to LUV color space.
 * @param srgb - The sRGB color to convert.
 * @param whiteReference - The white reference used for the conversion. Defaults to WHITE_REFERENCE.
 * @returns The converted color in LUV color space.
 * @public
 */
export const srgb2luv = (srgb: SRGB, whiteReference = WHITE_REFERENCE): LUV =>
  LUV.ofChannels(_rgb2luv(srgb.toChannels(), whiteReference))

/**
 * Converts an SRGB color to an RGB color.
 *
 * @param srgb - The SRGB color to convert.
 * @returns The converted RGB color.
 * @public
 */
export const srgb2rgb = (srgb: SRGB): RGB => {
  const rgb = srgb.toChannels()
  return RGB.ofChannels(rgb)
}

/**
 * Converts an sRGB color to XYZ color space.
 *
 * @param srgb - The sRGB color to convert.
 * @returns The corresponding XYZ color.
 * @public
 */
export const srgb2xyz = (srgb: SRGB): XYZ =>
  XYZ.ofChannels(_rgb2xyz(srgb.toChannels()))

/**
 * Converts an XYZ color to CMYK color.
 *
 * @param xyz - The XYZ color to convert.
 * @returns The CMYK color representation of the XYZ color.
 * @public
 */
export const xyz2cmyk = (xyz: XYZ): CMYK =>
  CMYK.ofChannels(_xyz2cmyk(xyz.toChannels()))

/**
 * Converts XYZ color space to HSL color space.
 * @param xyz - The XYZ color to convert.
 * @returns The corresponding HSL color.
 * @public
 */
export const xyz2hsl = (xyz: XYZ): HSL =>
  HSL.ofChannels(_xyz2hsl(xyz.toChannels()))

/**
 * Converts XYZ color space to HSLuv color space.
 * @param xyz - The XYZ color to convert.
 * @param whiteReference - The white reference used for conversion. Defaults to WHITE_REFERENCE.
 * @returns The color in HSLuv color space.
 * @public
 */
export const xyz2hsluv = (xyz: XYZ, whiteReference = WHITE_REFERENCE): HSLuv =>
  HSLuv.ofChannels(_xyz2hsluv(xyz.toChannels(), whiteReference))

/**
 * Converts XYZ color space to HSV color space.
 * @param xyz - The XYZ color to convert.
 * @returns The corresponding HSV color.
 * @public
 */
export const xyz2hsv = (xyz: XYZ): HSV =>
  HSV.ofChannels(_xyz2hsv(xyz.toChannels()))

/**
 * Converts XYZ color space to LAB color space.
 * @param xyz - The XYZ color to convert.
 * @param whiteReference - The white reference color. Defaults to WHITE_REFERENCE.
 * @returns The LAB color in the LAB color space.
 * @public
 */
export const xyz2lab = (xyz: XYZ, whiteReference = WHITE_REFERENCE): LAB =>
  LAB.ofChannels(_xyz2lab(xyz.toChannels(), whiteReference))

/**
 * Converts XYZ color space to LCH color space.
 * @param xyz - The XYZ color to convert.
 * @param whiteReference - The white reference color. Defaults to WHITE_REFERENCE.
 * @returns The converted LCH color.
 * @public
 */
export const xyz2lch = (xyz: XYZ, whiteReference = WHITE_REFERENCE): LCH =>
  LCH.ofChannels(_xyz2lch(xyz.toChannels(), whiteReference))

/**
 * Converts XYZ color space to LUV color space.
 * @param xyz - The XYZ color to convert.
 * @param whiteReference - The white reference color. Defaults to WHITE_REFERENCE.
 * @returns The converted LUV color.
 * @public
 */
export const xyz2luv = (xyz: XYZ, whiteReference = WHITE_REFERENCE): LUV =>
  LUV.ofChannels(_xyz2luv(xyz.toChannels(), whiteReference))

/**
 * Converts XYZ color space to RGB color space.
 * @param xyz - The XYZ color to convert.
 * @returns The RGB color in the RGB color space.
 * @public
 */
export const xyz2rgb = (xyz: XYZ): RGB =>
  RGB.ofChannels(_xyz2rgb(xyz.toChannels()))

/**
 * Converts XYZ color space to SRGB color space.
 *
 * @param xyz - The XYZ color to convert.
 * @returns The converted SRGB color.
 * @public
 */
export const xyz2srgb = (xyz: XYZ): SRGB =>
  SRGB.ofChannels(_xyz2rgb(xyz.toChannels()))
