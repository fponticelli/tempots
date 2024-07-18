import { CMYK } from './cmyk'
import { HSL } from './hsl'
import { HSLuv } from './hsluv'
import { HSV } from './hsv'
import { LAB } from './lab'
import { LCH } from './lch'
import { LUV } from './luv'
import {
  calculateMaxChromaHsluv,
  calculateBoundingLines,
  epsilon,
  kappa,
  WHITE_REFERENCE,
} from './math'
import { RGB } from './rgb'
import { SRGB } from './srgb'
import { XYZ } from './xyz'

export const Direct = {
  cmyk2rgb([c, m, y, k]: [c: number, m: number, y: number, k: number]): [
    number,
    number,
    number,
  ] {
    const r = (1 - c) * (1 - k)
    const g = (1 - m) * (1 - k)
    const b = (1 - y) * (1 - k)
    return [r, g, b]
  },
  hsl2hsv([h, s, l]: [h: number, s: number, l: number]): [
    number,
    number,
    number,
  ] {
    const v = l < 0.5 ? l * (1 + s) : l + s - l * s
    const m = l + l - v
    const sv = v !== 0 ? (v - m) / v : 0
    return [h, sv, v]
  },
  hsv2hsl([h, s, v]: [h: number, s: number, v: number]): [
    number,
    number,
    number,
  ] {
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
  },
  hsl2rgb([h, s, l]: [h: number, s: number, l: number]): [
    number,
    number,
    number,
  ] {
    const a = s * Math.min(l, 1 - l)
    const f = (n: number, k = (n + h / 30) % 12): number =>
      l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return [f(0), f(8), f(4)]
  },
  lab2lch([l, a, b]: [l: number, a: number, b: number]): [
    number,
    number,
    number,
  ] {
    const h = (Math.atan2(b, a) * 180) / Math.PI
    if (h > 0) {
      return [l, Math.sqrt(a * a + b * b), h]
    } else {
      return [l, Math.sqrt(a * a + b * b), h + 360]
    }
  },
  lab2xyz(
    [l, a, b]: [l: number, a: number, b: number],
    [rx, ry, rz]: [number, number, number]
  ): [number, number, number] {
    const fy = (l + 16) / 116
    const fx = a / 500 + fy
    const fz = fy - b / 200
    const x = rx * (fx ** 3 > epsilon ? fx ** 3 : (116 * fx - 16) / kappa)
    const y = ry * (l > kappa * epsilon ? ((l + 16) / 116) ** 3 : l / kappa)
    const z = rz * (fz ** 3 > epsilon ? fz ** 3 : (116 * fz - 16) / kappa)
    return [x * 100, y * 100, z * 100]
  },
  lch2lab([l, c, h]: [l: number, c: number, h: number]): [
    number,
    number,
    number,
  ] {
    const hrad = (h * Math.PI) / 180
    return [l, c * Math.cos(hrad), c * Math.sin(hrad)]
  },
  luv2xyz(
    [l, u, v]: [l: number, u: number, v: number],
    [rx, ry, rz]: [number, number, number]
  ): [number, number, number] {
    if (l === 0) {
      return [0, 0, 0]
    }
    const u0 = (4 * rx) / (rx + 15 * ry + 3 * rz)
    const v0 = (9 * ry) / (rx + 15 * ry + 3 * rz)
    const a = (1 / 3) * ((52 * l) / (u + 13 * l * u0) - 1)
    const y = l > kappa * epsilon ? ((l + 16) / 116) ** 3 : l / kappa
    const b = -5 * y
    const c = -1 / 3
    const d = y * ((39 * l) / (v + 13 * l * v0) - 5)
    const x = (d - b) / (a - c)
    const z = x * a + b
    return [x * 100, y * 100, z * 100]
  },
  rgb2cmyk([r, g, b]: [r: number, g: number, b: number]): [
    number,
    number,
    number,
    number,
  ] {
    const k = 1 - Math.max(r, g, b)
    const c = (1 - r - k) / (1 - k)
    const m = (1 - g - k) / (1 - k)
    const y = (1 - b - k) / (1 - k)
    return [c, m, y, k]
  },
  rgb2hsl([r, g, b]: [r: number, g: number, b: number]): [
    number,
    number,
    number,
  ] {
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
  },
  rgb2xyz([r, g, b]: [r: number, g: number, b: number]): [
    number,
    number,
    number,
  ] {
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
  },
  xyz2lab(
    [x, y, z]: [number, number, number],
    [rx, ry, rz]: [number, number, number]
  ): [number, number, number] {
    const f = (t: number): number =>
      t > epsilon ? Math.pow(t, 1 / 3) : (116 * t - 16) / kappa
    const l = 116 * f(y / ry / 100) - 16
    const a = 500 * (f(x / rx / 100) - f(y / ry / 100))
    const b = 200 * (f(y / ry / 100) - f(z / rz / 100))
    return [l, a, b]
  },
  xyz2luv(
    [x, y, z]: [number, number, number],
    [rx, ry, rz]: [number, number, number]
  ): [number, number, number] {
    x /= 100
    y /= 100
    z /= 100
    const yr = y / ry
    const up = (4 * x) / (x + 15 * y + 3 * z)
    const vp = (9 * y) / (x + 15 * y + 3 * z)
    const upr = (4 * rx) / (rx + 15 * ry + 3 * rz)
    const vpr = (9 * ry) / (rx + 15 * ry + 3 * rz)
    const l = yr > epsilon ? 116 * Math.pow(yr, 1 / 3) - 16 : kappa * yr
    const u = 13 * l * (up - upr)
    const v = 13 * l * (vp - vpr)
    return [l, u, v]
  },
  xyz2rgb([x, y, z]: [number, number, number]): [number, number, number] {
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
  },
  hsluv2lch: ([h, s, l]: [number, number, number]): [
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
        calculateBoundingLines(l)
      const max = calculateMaxChromaHsluv(
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
  },
  lch2hsluv: ([l, c, h]: [number, number, number]): [
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
        calculateBoundingLines(l)
      const max = calculateMaxChromaHsluv(
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
  },
}

export const Channel = {
  ...Direct,
  cmyk2hsl: (cmyk: [number, number, number, number]) => {
    const rgb = Channel.cmyk2rgb(cmyk)
    return Channel.rgb2hsl(rgb)
  },
  cmyk2hsluv: (
    cmyk: [number, number, number, number],
    whiteReference: [number, number, number]
  ) => {
    const lch = Channel.cmyk2lch(cmyk, whiteReference)
    return Channel.lch2hsluv(lch)
  },
  cmyk2hsv: (cmyk: [number, number, number, number]) => {
    const rgb = Channel.cmyk2rgb(cmyk)
    return Channel.rgb2hsv(rgb)
  },
  cmyk2lab: (
    cmyk: [number, number, number, number],
    whiteReference: [number, number, number]
  ) => {
    const rgb = Channel.cmyk2rgb(cmyk)
    return Channel.rgb2lab(rgb, whiteReference)
  },
  cmyk2lch: (
    cmyk: [number, number, number, number],
    whiteReference: [number, number, number]
  ) => {
    const rgb = Channel.cmyk2rgb(cmyk)
    return Channel.rgb2lch(rgb, whiteReference)
  },
  cmyk2luv: (
    cmyk: [number, number, number, number],
    whiteReference: [number, number, number]
  ) => {
    const rgb = Channel.cmyk2rgb(cmyk)
    return Channel.rgb2luv(rgb, whiteReference)
  },
  cmyk2xyz: (cmyk: [number, number, number, number]) => {
    const rgb = Channel.cmyk2rgb(cmyk)
    return Channel.rgb2xyz(rgb)
  },
  hsl2cmyk: (hsl: [number, number, number]) => {
    const rgb = Channel.hsl2rgb(hsl)
    return Channel.rgb2cmyk(rgb)
  },
  hsl2lab: (
    hsl: [number, number, number],
    whiteReference: [number, number, number]
  ) => {
    const rgb = Channel.hsl2rgb(hsl)
    return Channel.rgb2lab(rgb, whiteReference)
  },
  hsl2hsluv: (
    hsl: [number, number, number],
    whiteReference: [number, number, number]
  ) => {
    const lch = Channel.hsl2lch(hsl, whiteReference)
    return Channel.lch2hsluv(lch)
  },
  hsl2lch: (
    hsl: [number, number, number],
    whiteReference: [number, number, number]
  ) => {
    const rgb = Channel.hsl2rgb(hsl)
    return Channel.rgb2lch(rgb, whiteReference)
  },
  hsl2luv: (
    hsl: [number, number, number],
    whiteReference: [number, number, number]
  ) => {
    const rgb = Channel.hsl2rgb(hsl)
    return Channel.rgb2luv(rgb, whiteReference)
  },
  hsl2xyz: (hsl: [number, number, number]) => {
    const rgb = Channel.hsl2rgb(hsl)
    return Channel.rgb2xyz(rgb)
  },
  hsluv2cmyk: (
    hsluv: [number, number, number],
    whiteReference: [number, number, number]
  ) => {
    const lch = Channel.hsluv2lch(hsluv)
    return Channel.lch2cmyk(lch, whiteReference)
  },
  hsluv2hsl: (
    hsluv: [number, number, number],
    whiteReference: [number, number, number]
  ) => {
    const lch = Channel.hsluv2lch(hsluv)
    return Channel.lch2hsl(lch, whiteReference)
  },
  hsluv2lab: (hsluv: [number, number, number]) => {
    const lch = Channel.hsluv2lch(hsluv)
    return Channel.lch2lab(lch)
  },
  hsluv2luv(
    hsluv: [number, number, number],
    whiteReference: [number, number, number]
  ) {
    const lch = Channel.hsluv2lch(hsluv)
    return Channel.lch2luv(lch, whiteReference)
  },
  hsluv2hsv(
    hsluv: [number, number, number],
    whiteReference: [number, number, number]
  ) {
    const lch = Channel.hsluv2lch(hsluv)
    return Channel.lch2hsv(lch, whiteReference)
  },
  hsluv2rgb(
    hsluv: [number, number, number],
    whiteReference: [number, number, number]
  ) {
    const lch = Channel.hsluv2lch(hsluv)
    return Channel.lch2rgb(lch, whiteReference)
  },
  hsluv2xyz: (
    hsluv: [number, number, number],
    whiteReference: [number, number, number]
  ) => {
    const lch = Channel.hsluv2lch(hsluv)
    return Channel.lch2xyz(lch, whiteReference)
  },
  hsv2cmyk: (hsv: [number, number, number]) => {
    const hsl = Channel.hsv2hsl(hsv)
    return Channel.hsl2cmyk(hsl)
  },
  hsv2hsluv: (
    hsv: [number, number, number],
    whiteReference: [number, number, number]
  ) => {
    const hsl = Channel.hsv2hsl(hsv)
    return Channel.hsl2hsluv(hsl, whiteReference)
  },
  hsv2lab: (
    hsv: [number, number, number],
    whiteReference: [number, number, number]
  ) => {
    const rgb = Channel.hsv2rgb(hsv)
    return Channel.rgb2lab(rgb, whiteReference)
  },
  hsv2lch: (
    hsv: [number, number, number],
    whiteReference: [number, number, number]
  ) => {
    const rgb = Channel.hsv2rgb(hsv)
    return Channel.rgb2lch(rgb, whiteReference)
  },
  hsv2luv: (
    hsv: [number, number, number],
    whiteReference: [number, number, number]
  ) => {
    const rgb = Channel.hsv2rgb(hsv)
    return Channel.rgb2luv(rgb, whiteReference)
  },
  hsv2rgb: (hsv: [number, number, number]) => {
    const hsl = Channel.hsv2hsl(hsv)
    return Channel.hsl2rgb(hsl)
  },
  hsv2xyz: (hsv: [number, number, number]) => {
    const hsl = Channel.hsv2hsl(hsv)
    return Channel.hsl2xyz(hsl)
  },
  lab2cmyk: (
    lab: [number, number, number],
    whiteReference: [number, number, number]
  ) => {
    const rgb = Channel.lab2rgb(lab, whiteReference)
    return Channel.rgb2cmyk(rgb)
  },
  lab2hsl: (
    lab: [number, number, number],
    whiteReference: [number, number, number]
  ) => {
    const rgb = Channel.lab2rgb(lab, whiteReference)
    return Channel.rgb2hsl(rgb)
  },
  lab2hsluv: (lab: [number, number, number]) => {
    const lch = Channel.lab2lch(lab)
    return Channel.lch2hsluv(lch)
  },
  lab2hsv: (
    lab: [number, number, number],
    whiteReference: [number, number, number]
  ) => {
    const rgb = Channel.lab2rgb(lab, whiteReference)
    return Channel.rgb2hsv(rgb)
  },
  lab2luv: (
    lab: [number, number, number],
    whiteReference: [number, number, number]
  ) => {
    const rgb = Channel.lab2rgb(lab, whiteReference)
    return Channel.rgb2luv(rgb, whiteReference)
  },
  lab2rgb: (
    lab: [number, number, number],
    whiteReference: [number, number, number]
  ) => {
    const xyz = Channel.lab2xyz(lab, whiteReference)
    return Channel.xyz2rgb(xyz)
  },
  lch2cmyk: (
    lch: [number, number, number],
    whiteReference: [number, number, number]
  ) => {
    const rgb = Channel.lch2rgb(lch, whiteReference)
    return Channel.rgb2cmyk(rgb)
  },
  lch2hsl: (
    lch: [number, number, number],
    whiteReference: [number, number, number]
  ) => {
    const rgb = Channel.lch2rgb(lch, whiteReference)
    return Channel.rgb2hsl(rgb)
  },
  lch2hsv: (
    lch: [number, number, number],
    whiteReference: [number, number, number]
  ) => {
    const rgb = Channel.lch2rgb(lch, whiteReference)
    return Channel.rgb2hsv(rgb)
  },
  lch2luv: (
    lch: [number, number, number],
    whiteReference: [number, number, number]
  ) => {
    const rgb = Channel.lch2rgb(lch, whiteReference)
    return Channel.rgb2luv(rgb, whiteReference)
  },
  lch2rgb: (
    lch: [number, number, number],
    whiteReference: [number, number, number]
  ) => {
    const xyz = Channel.lch2xyz(lch, whiteReference)
    return Channel.xyz2rgb(xyz)
  },
  lch2xyz: (
    lch: [number, number, number],
    whiteReference: [number, number, number]
  ) => {
    const lab = Channel.lch2lab(lch)
    return Channel.lab2xyz(lab, whiteReference)
  },
  luv2cmyk: (
    luv: [number, number, number],
    whiteReference: [number, number, number]
  ) => {
    const rgb = Channel.luv2rgb(luv, whiteReference)
    return Channel.rgb2cmyk(rgb)
  },
  luv2hsl: (
    luv: [number, number, number],
    whiteReference: [number, number, number]
  ) => {
    const rgb = Channel.luv2rgb(luv, whiteReference)
    return Channel.rgb2hsl(rgb)
  },
  luv2hsluv: (
    luv: [number, number, number],
    whiteReference: [number, number, number]
  ) => {
    const lch = Channel.luv2lch(luv, whiteReference)
    return Channel.lch2hsluv(lch)
  },
  luv2hsv: (
    luv: [number, number, number],
    whiteReference: [number, number, number]
  ) => {
    const rgb = Channel.luv2rgb(luv, whiteReference)
    return Channel.rgb2hsv(rgb)
  },
  luv2lab: (
    luv: [number, number, number],
    whiteReference: [number, number, number]
  ) => {
    const rgb = Channel.luv2rgb(luv, whiteReference)
    return Channel.rgb2lab(rgb, whiteReference)
  },
  luv2lch: (
    luv: [number, number, number],
    whiteReference: [number, number, number]
  ) => {
    const rgb = Channel.luv2rgb(luv, whiteReference)
    return Channel.rgb2lch(rgb, whiteReference)
  },
  luv2rgb: (
    luv: [number, number, number],
    whiteReference: [number, number, number]
  ) => {
    const xyz = Channel.luv2xyz(luv, whiteReference)
    return Channel.xyz2rgb(xyz)
  },
  rgb2hsluv: (
    rgb: [number, number, number],
    whiteReference: [number, number, number]
  ) => {
    const luv = Channel.rgb2luv(rgb, whiteReference)
    return Channel.luv2hsluv(luv, whiteReference)
  },
  rgb2hsv: (rgb: [number, number, number]) => {
    const hsl = Channel.rgb2hsl(rgb)
    return Channel.hsl2hsv(hsl)
  },
  rgb2lab: (
    rgb: [number, number, number],
    whiteReference: [number, number, number]
  ) => {
    const xyz = Channel.rgb2xyz(rgb)
    return Channel.xyz2lab(xyz, whiteReference)
  },
  rgb2lch: (
    rgb: [number, number, number],
    whiteReference: [number, number, number]
  ) => {
    const lab = Channel.rgb2lab(rgb, whiteReference)
    return Channel.lab2lch(lab)
  },
  rgb2luv: (
    rgb: [number, number, number],
    whiteReference: [number, number, number]
  ) => {
    const xyz = Direct.rgb2xyz(rgb)
    return Direct.xyz2luv(xyz, whiteReference)
  },
  xyz2cmyk: (xyz: [number, number, number]) => {
    const rgb = Channel.xyz2rgb(xyz)
    return Channel.rgb2cmyk(rgb)
  },
  xyz2hsl: (xyz: [number, number, number]) => {
    const rgb = Channel.xyz2rgb(xyz)
    return Channel.rgb2hsl(rgb)
  },
  xyz2hsluv: (
    xyz: [number, number, number],
    whiteReference: [number, number, number]
  ) => {
    const luv = Channel.xyz2luv(xyz, whiteReference)
    return Channel.luv2hsluv(luv, whiteReference)
  },
  xyz2hsv: (xyz: [number, number, number]) => {
    const rgb = Channel.xyz2rgb(xyz)
    return Channel.rgb2hsv(rgb)
  },
  xyz2lch: (
    xyz: [number, number, number],
    whiteReference: [number, number, number]
  ) => {
    const lab = Channel.xyz2lab(xyz, whiteReference)
    return Channel.lab2lch(lab)
  },
}

export function cmyk2luv(cmyk: CMYK, whiteReference = WHITE_REFERENCE): LUV {
  return LUV.ofChannels(Channel.cmyk2luv(cmyk.toChannels(), whiteReference))
}

export function cmyk2hsl(cmyk: CMYK): HSL {
  return HSL.ofChannels(Channel.cmyk2hsl(cmyk.toChannels()))
}

export function cmyk2hsluv(
  cmyk: CMYK,
  whiteReference = WHITE_REFERENCE
): HSLuv {
  return HSLuv.ofChannels(Channel.cmyk2hsluv(cmyk.toChannels(), whiteReference))
}

export function cmyk2hsv(cmyk: CMYK): HSV {
  return HSV.ofChannels(Channel.cmyk2hsv(cmyk.toChannels()))
}

export function cmyk2lab(cmyk: CMYK, whiteReference = WHITE_REFERENCE): LAB {
  return LAB.ofChannels(Channel.cmyk2lab(cmyk.toChannels(), whiteReference))
}

export function cmyk2lch(cmyk: CMYK, whiteReference = WHITE_REFERENCE): LCH {
  return LCH.ofChannels(Channel.cmyk2lch(cmyk.toChannels(), whiteReference))
}

export function cmyk2rgb(cmyk: CMYK): RGB {
  return RGB.ofChannels(Channel.cmyk2rgb(cmyk.toChannels()))
}

export function cmyk2srgb(cmyk: CMYK): SRGB {
  return SRGB.ofChannels(Channel.cmyk2rgb(cmyk.toChannels()))
}

export function cmyk2xyz(cmyk: CMYK): XYZ {
  return XYZ.ofChannels(Channel.cmyk2xyz(cmyk.toChannels()))
}

export function hsl2cmyk(hsl: HSL): CMYK {
  return CMYK.ofChannels(Channel.hsl2cmyk(hsl.toChannels()))
}

export function hsl2hsluv(hsl: HSL, whiteReference = WHITE_REFERENCE): HSLuv {
  return HSLuv.ofChannels(Channel.hsl2hsluv(hsl.toChannels(), whiteReference))
}

export function hsl2luv(hsl: HSL, whiteReference = WHITE_REFERENCE): LUV {
  return LUV.ofChannels(Channel.hsl2luv(hsl.toChannels(), whiteReference))
}

export function hsl2hsv(hsl: HSL): HSV {
  return HSV.ofChannels(Channel.hsl2hsv(hsl.toChannels()))
}

export function hsl2lab(hsl: HSL, whiteReference = WHITE_REFERENCE): LAB {
  return LAB.ofChannels(Channel.hsl2lab(hsl.toChannels(), whiteReference))
}

export function hsl2lch(hsl: HSL, whiteReference = WHITE_REFERENCE): LCH {
  return LCH.ofChannels(Channel.hsl2lch(hsl.toChannels(), whiteReference))
}

export function hsl2rgb(hsl: HSL): RGB {
  return RGB.ofChannels(Channel.hsl2rgb(hsl.toChannels()))
}

export function hsl2srgb(hsl: HSL): SRGB {
  return SRGB.ofChannels(Channel.hsl2rgb(hsl.toChannels()))
}

export function hsl2xyz(hsl: HSL): XYZ {
  return XYZ.ofChannels(Channel.hsl2xyz(hsl.toChannels()))
}

export function hsluv2cmyk(
  hsluv: HSLuv,
  whiteReference = WHITE_REFERENCE
): CMYK {
  return CMYK.ofChannels(Channel.hsluv2cmyk(hsluv.toChannels(), whiteReference))
}

export function hsluv2hsl(hsluv: HSLuv, whiteReference = WHITE_REFERENCE): HSL {
  return HSL.ofChannels(Channel.hsluv2hsl(hsluv.toChannels(), whiteReference))
}

export function hsluv2luv(hsluv: HSLuv, whiteReference = WHITE_REFERENCE): LUV {
  return LUV.ofChannels(Channel.hsluv2luv(hsluv.toChannels(), whiteReference))
}

export function hsluv2hsv(hsluv: HSLuv, whiteReference = WHITE_REFERENCE): HSV {
  return HSV.ofChannels(Channel.hsluv2hsv(hsluv.toChannels(), whiteReference))
}

export function hsluv2lab(hsluv: HSLuv): LAB {
  return LAB.ofChannels(Channel.hsluv2lab(hsluv.toChannels()))
}

export function hsluv2lch(hsluv: HSLuv): LCH {
  return LCH.ofChannels(Channel.hsluv2lch(hsluv.toChannels()))
}

export function hsluv2rgb(hsluv: HSLuv, whiteReference = WHITE_REFERENCE): RGB {
  return RGB.ofChannels(Channel.hsluv2rgb(hsluv.toChannels(), whiteReference))
}

export function hsluv2srgb(
  hsluv: HSLuv,
  whiteReference = WHITE_REFERENCE
): SRGB {
  return SRGB.ofChannels(Channel.hsluv2rgb(hsluv.toChannels(), whiteReference))
}

export function hsluv2xyz(hsluv: HSLuv, whiteReference = WHITE_REFERENCE): XYZ {
  return XYZ.ofChannels(Channel.hsluv2xyz(hsluv.toChannels(), whiteReference))
}

export function hsv2cmyk(hsv: HSV): CMYK {
  return CMYK.ofChannels(Channel.hsv2cmyk(hsv.toChannels()))
}

export function hsv2hsl(hsv: HSV): HSL {
  return HSL.ofChannels(Channel.hsv2hsl(hsv.toChannels()))
}

export function hsv2hsluv(hsv: HSV, whiteReference = WHITE_REFERENCE): HSLuv {
  return HSLuv.ofChannels(Channel.hsv2hsluv(hsv.toChannels(), whiteReference))
}

export function hsv2lab(hsv: HSV, whiteReference = WHITE_REFERENCE): LAB {
  return LAB.ofChannels(Channel.hsv2lab(hsv.toChannels(), whiteReference))
}

export function hsv2lch(hsv: HSV, whiteReference = WHITE_REFERENCE): LCH {
  return LCH.ofChannels(Channel.hsv2lch(hsv.toChannels(), whiteReference))
}

export function hsv2luv(hsv: HSV, whiteReference = WHITE_REFERENCE): LUV {
  return LUV.ofChannels(Channel.hsv2luv(hsv.toChannels(), whiteReference))
}

export function hsv2rgb(hsv: HSV): RGB {
  return RGB.ofChannels(Channel.hsv2rgb(hsv.toChannels()))
}

export function hsv2srgb(hsv: HSV): SRGB {
  return SRGB.ofChannels(Channel.hsv2rgb(hsv.toChannels()))
}

export function hsv2xyz(hsv: HSV): XYZ {
  return XYZ.ofChannels(Channel.hsv2xyz(hsv.toChannels()))
}

export function lab2cmyk(lab: LAB, whiteReference = WHITE_REFERENCE): CMYK {
  return CMYK.ofChannels(Channel.lab2cmyk(lab.toChannels(), whiteReference))
}

export function lab2hsl(lab: LAB, whiteReference = WHITE_REFERENCE): HSL {
  return HSL.ofChannels(Channel.lab2hsl(lab.toChannels(), whiteReference))
}

export function lab2hsluv(lab: LAB): HSLuv {
  return HSLuv.ofChannels(Channel.lab2hsluv(lab.toChannels()))
}

export function lab2hsv(lab: LAB, whiteReference = WHITE_REFERENCE): HSV {
  return HSV.ofChannels(Channel.lab2hsv(lab.toChannels(), whiteReference))
}

export function lab2lch(lab: LAB): LCH {
  return LCH.ofChannels(Channel.lab2lch(lab.toChannels()))
}

export function lab2luv(lab: LAB, whiteReference = WHITE_REFERENCE): LUV {
  return LUV.ofChannels(Channel.lab2luv(lab.toChannels(), whiteReference))
}

export function lab2rgb(lab: LAB, whiteReference = WHITE_REFERENCE): RGB {
  return RGB.ofChannels(Channel.lab2rgb(lab.toChannels(), whiteReference))
}

export function lab2srgb(lab: LAB, whiteReference = WHITE_REFERENCE): SRGB {
  return SRGB.ofChannels(Channel.lab2rgb(lab.toChannels(), whiteReference))
}

export function lab2xyz(lab: LAB, whiteReference = WHITE_REFERENCE): XYZ {
  return XYZ.ofChannels(Channel.lab2xyz(lab.toChannels(), whiteReference))
}

export function lch2cmyk(lch: LCH, whiteReference = WHITE_REFERENCE): CMYK {
  return CMYK.ofChannels(Channel.lch2cmyk(lch.toChannels(), whiteReference))
}

export function lch2hsl(lch: LCH, whiteReference = WHITE_REFERENCE): HSL {
  return HSL.ofChannels(Channel.lch2hsl(lch.toChannels(), whiteReference))
}

export function lch2hsluv(lch: LCH): HSLuv {
  const c = Channel.lch2hsluv(lch.toChannels())
  return HSLuv.ofChannels(c)
}

export function lch2hsv(lch: LCH, whiteReference = WHITE_REFERENCE): HSV {
  return HSV.ofChannels(Channel.lch2hsv(lch.toChannels(), whiteReference))
}

export function lch2lab(lch: LCH): LAB {
  return LAB.ofChannels(Channel.lch2lab(lch.toChannels()))
}

export function lch2luv(lch: LCH, whiteReference = WHITE_REFERENCE): LUV {
  return LUV.ofChannels(Channel.lch2luv(lch.toChannels(), whiteReference))
}

export function lch2rgb(lch: LCH, whiteReference = WHITE_REFERENCE): RGB {
  return RGB.ofChannels(Channel.lch2rgb(lch.toChannels(), whiteReference))
}

export function lch2srgb(lch: LCH, whiteReference = WHITE_REFERENCE): SRGB {
  return SRGB.ofChannels(Channel.lch2rgb(lch.toChannels(), whiteReference))
}

export function lch2xyz(lch: LCH, whiteReference = WHITE_REFERENCE): XYZ {
  return XYZ.ofChannels(Channel.lch2xyz(lch.toChannels(), whiteReference))
}

export function luv2cmyk(luv: LUV, whiteReference = WHITE_REFERENCE): CMYK {
  return CMYK.ofChannels(Channel.luv2cmyk(luv.toChannels(), whiteReference))
}

export function luv2hsl(luv: LUV, whiteReference = WHITE_REFERENCE): HSL {
  return HSL.ofChannels(Channel.luv2hsl(luv.toChannels(), whiteReference))
}

export function luv2hsluv(luv: LUV, whiteReference = WHITE_REFERENCE): HSLuv {
  return HSLuv.ofChannels(Channel.luv2hsluv(luv.toChannels(), whiteReference))
}

export function luv2hsv(luv: LUV, whiteReference = WHITE_REFERENCE): HSV {
  return HSV.ofChannels(Channel.luv2hsv(luv.toChannels(), whiteReference))
}

export function luv2lab(luv: LUV, whiteReference = WHITE_REFERENCE): LAB {
  return LAB.ofChannels(Channel.luv2lab(luv.toChannels(), whiteReference))
}

export function luv2lch(luv: LUV, whiteReference = WHITE_REFERENCE): LCH {
  return LCH.ofChannels(Channel.luv2lch(luv.toChannels(), whiteReference))
}

export function luv2rgb(luv: LUV, whiteReference = WHITE_REFERENCE): RGB {
  return RGB.ofChannels(Channel.luv2rgb(luv.toChannels(), whiteReference))
}

export function luv2srgb(luv: LUV, whiteReference = WHITE_REFERENCE): SRGB {
  return SRGB.ofChannels(Channel.luv2rgb(luv.toChannels(), whiteReference))
}

export function luv2xyz(luv: LUV, whiteReference = WHITE_REFERENCE): XYZ {
  return XYZ.ofChannels(Channel.luv2xyz(luv.toChannels(), whiteReference))
}

export function rgb2cmyk(rgb: RGB): CMYK {
  return CMYK.ofChannels(Channel.rgb2cmyk(rgb.toChannels()))
}

export function rgb2hsl(rgb: RGB): HSL {
  return HSL.ofChannels(Channel.rgb2hsl(rgb.toChannels()))
}

export function rgb2hsluv(rgb: RGB, whiteReference = WHITE_REFERENCE): HSLuv {
  return HSLuv.ofChannels(Channel.rgb2hsluv(rgb.toChannels(), whiteReference))
}

export function rgb2hsv(rgb: RGB): HSV {
  return HSV.ofChannels(Channel.rgb2hsv(rgb.toChannels()))
}

export function rgb2lab(rgb: RGB, whiteReference = WHITE_REFERENCE): LAB {
  return LAB.ofChannels(Channel.rgb2lab(rgb.toChannels(), whiteReference))
}

export function rgb2lch(rgb: RGB, whiteReference = WHITE_REFERENCE): LCH {
  return LCH.ofChannels(Channel.rgb2lch(rgb.toChannels(), whiteReference))
}

export function rgb2luv(rgb: RGB, whiteReference = WHITE_REFERENCE): LUV {
  return LUV.ofChannels(Channel.rgb2luv(rgb.toChannels(), whiteReference))
}

export function rgb2srgb(rgb: RGB): SRGB {
  const srgb = rgb.toChannels()
  return SRGB.ofChannels(srgb)
}

export function rgb2xyz(rgb: RGB): XYZ {
  return XYZ.ofChannels(Channel.rgb2xyz(rgb.toChannels()))
}

export function srgb2cmyk(srgb: SRGB): CMYK {
  return CMYK.ofChannels(Channel.rgb2cmyk(srgb.toChannels()))
}

export function srgb2hsv(srgb: SRGB): HSV {
  return HSV.ofChannels(Channel.rgb2hsv(srgb.toChannels()))
}

export function srgb2hsl(srgb: SRGB): HSL {
  return HSL.ofChannels(Channel.rgb2hsl(srgb.toChannels()))
}

export function srgb2hsluv(
  srgb: SRGB,
  whiteReference = WHITE_REFERENCE
): HSLuv {
  return HSLuv.ofChannels(Channel.rgb2hsluv(srgb.toChannels(), whiteReference))
}

export function srgb2lab(srgb: SRGB, whiteReference = WHITE_REFERENCE): LAB {
  return LAB.ofChannels(Channel.rgb2lab(srgb.toChannels(), whiteReference))
}

export function srgb2lch(srgb: SRGB, whiteReference = WHITE_REFERENCE): LCH {
  return LCH.ofChannels(Channel.rgb2lch(srgb.toChannels(), whiteReference))
}

export function srgb2luv(srgb: SRGB, whiteReference = WHITE_REFERENCE): LUV {
  return LUV.ofChannels(Channel.rgb2luv(srgb.toChannels(), whiteReference))
}

export function srgb2rgb(srgb: SRGB): RGB {
  const rgb = srgb.toChannels()
  return RGB.ofChannels(rgb)
}

export function srgb2xyz(srgb: SRGB): XYZ {
  return XYZ.ofChannels(Channel.rgb2xyz(srgb.toChannels()))
}

export function xyz2cmyk(xyz: XYZ): CMYK {
  return CMYK.ofChannels(Channel.xyz2cmyk(xyz.toChannels()))
}

export function xyz2hsl(xyz: XYZ): HSL {
  return HSL.ofChannels(Channel.xyz2hsl(xyz.toChannels()))
}

export function xyz2hsluv(xyz: XYZ, whiteReference = WHITE_REFERENCE): HSLuv {
  return HSLuv.ofChannels(Channel.xyz2hsluv(xyz.toChannels(), whiteReference))
}

export function xyz2hsv(xyz: XYZ): HSV {
  return HSV.ofChannels(Channel.xyz2hsv(xyz.toChannels()))
}

export function xyz2lab(xyz: XYZ, whiteReference = WHITE_REFERENCE): LAB {
  return LAB.ofChannels(Channel.xyz2lab(xyz.toChannels(), whiteReference))
}

export function xyz2lch(xyz: XYZ, whiteReference = WHITE_REFERENCE): LCH {
  return LCH.ofChannels(Channel.xyz2lch(xyz.toChannels(), whiteReference))
}

export function xyz2luv(xyz: XYZ, whiteReference = WHITE_REFERENCE): LUV {
  return LUV.ofChannels(Channel.xyz2luv(xyz.toChannels(), whiteReference))
}

export function xyz2rgb(xyz: XYZ): RGB {
  return RGB.ofChannels(Channel.xyz2rgb(xyz.toChannels()))
}

export function xyz2srgb(xyz: XYZ): SRGB {
  return SRGB.ofChannels(Channel.xyz2rgb(xyz.toChannels()))
}
