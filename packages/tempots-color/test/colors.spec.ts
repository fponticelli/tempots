import { describe, expect, test } from "vitest";
import {
  Channel,
  hsl2hsluv,
  hsl2hsv,
  hsl2lab,
  hsl2lch,
  hsl2luv,
  hsl2rgb,
  hsl2srgb,
  hsl2xyz,
  hsluv2hsl,
  hsluv2hsv,
  hsluv2lab,
  hsluv2lch,
  hsluv2luv,
  hsluv2rgb,
  hsluv2srgb,
  hsluv2xyz,
  hsv2hsl,
  hsv2hsluv,
  hsv2lab,
  hsv2lch,
  hsv2luv,
  hsv2rgb,
  hsv2srgb,
  hsv2xyz,
  lab2hsl,
  lab2hsluv,
  lab2hsv,
  lab2lch,
  lab2luv,
  lab2rgb,
  lab2srgb,
  lab2xyz,
  lch2hsl,
  lch2hsluv,
  lch2hsv,
  lch2lab,
  lch2luv,
  lch2rgb,
  lch2srgb,
  lch2xyz,
  luv2hsl,
  luv2hsluv,
  luv2hsv,
  luv2lab,
  luv2lch,
  luv2rgb,
  luv2srgb,
  luv2xyz,
  rgb2hsl,
  rgb2hsluv,
  rgb2hsv,
  rgb2lab,
  rgb2lch,
  rgb2luv,
  rgb2srgb,
  rgb2xyz,
  srgb2hsl,
  srgb2hsluv,
  srgb2hsv,
  srgb2lab,
  srgb2lch,
  srgb2luv,
  srgb2rgb,
  srgb2xyz,
  xyz2hsl,
  xyz2hsluv,
  xyz2hsv,
  xyz2lab,
  xyz2lch,
  xyz2luv,
  xyz2rgb,
  xyz2srgb
} from '../src/convert'
import { HSL } from '../src/hsl'
import { HSLuv } from '../src/hsluv'
import { HSV } from '../src/hsv'
import { LAB } from '../src/lab'
import { LCH } from '../src/lch'
import { LUV } from '../src/luv'
import { RGB } from '../src/rgb'
import { SRGB } from '../src/srgb'
import { XYZ } from '../src/xyz'
import { nearEquals, WHITE_REFERENCE } from '../src/math'

expect.extend({
  toNearEqual (
    this: any,
    received: number,
    expected: number,
    precision = 0.0001
  ) {
    const pass = nearEquals(received, expected, precision)
    if (pass) {
      return {
        message: () => `expected ${received} to be near ${expected}`,
        pass: true
      }
    } else {
      return {
        message: () => `expected ${received} to be near ${expected}`,
        pass: false
      }
    }
  },
  toNearEqualArray (
    this: any,
    received: number[],
    expected: number[],
    tollerance = 0.01
  ) {
    const values = received.map((v, i) =>
      nearEquals(v, expected[i], tollerance)
    )
    const pass = values.every(v => v)
    const maybeNot = this.isNot ? 'not ' : ''
    return {
      message: () => `expected ${received} ${maybeNot}to equal ${expected}`,
      pass
    }
  }
})

describe('Channel conversion', () => {
  test('cmyk2rgb', () => {
    (expect(Channel.cmyk2rgb([0.6, 0.0, 0.08, 0.07])) as any).toNearEqualArray([
      0.372, 0.93, 0.8556
    ])
  })
  test('hsl2hsv', () => {
    (expect(Channel.hsl2hsv([172, 0.8, 0.65])) as any).toNearEqualArray([
      172, 0.60215, 0.93
    ])
  })
  test('hsv2hsl', () => {
    (expect(Channel.hsv2hsl([172, 0.60215, 0.93])) as any).toNearEqualArray([
      172, 0.8, 0.65
    ])
  })
  test('hsl2lab', () => {
    (expect(Channel.lch2lab([86.07, 42.79865, 183.0])) as any).toNearEqualArray([
      86.07, -42.74, -2.24
    ])
  })
  test('hsl2rgb', () => {
    (expect(Channel.hsl2rgb([172, 0.8, 0.65])) as any).toNearEqualArray([
      0.37, 0.9299, 0.8553
    ])
  })
  test('lab2lch', () => {
    (expect(Channel.lab2lch([86.07, -42.74, -2.24])) as any).toNearEqualArray([
      86.07, 42.79865, 183.0
    ])
  })
  test('lab2xyz', () => {
    (expect(
      Channel.lab2xyz([86.07, -42.74, -2.24], WHITE_REFERENCE)
    ) as any).toNearEqualArray([
      47.65533671728852, 68.12717437567908, 77.04768177230773
    ])
  })
  test('lch2lab', () => {
    (expect(Channel.lch2lab([86, 42.699, 183.024])) as any).toNearEqualArray([
      86.0, -42.64, -2.25
    ])
  })
  test('luv2xyz', () => {
    (expect(
      Channel.luv2xyz([81.495, -60.109, 95.919], WHITE_REFERENCE)
    ) as any).toNearEqualArray([33.727, 59.37, 10.602])
  })
  test('rgb2cmyk', () => {
    (expect(Channel.rgb2cmyk([0.372, 0.93, 0.8556])) as any).toNearEqualArray([
      0.6, 0.0, 0.08, 0.07
    ])
  })
  test('rgb2hsl', () => {
    (expect(Channel.rgb2hsl([0.37, 0.9299, 0.8553])) as any).toNearEqualArray([
      172, 0.8, 0.65
    ])
  })
  test('rgb2xyz', () => {
    (expect(Channel.rgb2xyz([100 / 255, 230 / 255, 25 / 255])) as any).toNearEqualArray([
      33.727, 59.37, 10.602
    ])
  })
  test('xyz2lab', () => {
    (expect(
      Channel.xyz2lab([47.6553, 68.1272, 77.0477], WHITE_REFERENCE)
    ) as any).toNearEqualArray([86.07001279, -42.74015717, -2.2399919])
  })
  test('xyz2luv', () => {
    (expect(
      Channel.xyz2luv([33.727, 59.37, 10.602], WHITE_REFERENCE)
    ) as any).toNearEqualArray([81.495, -60.109, 95.919])
  })
  test('xyz2rgb', () => {
    (expect(Channel.xyz2rgb([33.727, 59.37, 10.602])) as any).toNearEqualArray([
      100 / 255,
      230 / 255,
      25 / 255
    ])
  })
})

const data: Array<[string, HSL, HSLuv, HSV, LAB, LCH, LUV, RGB, SRGB, XYZ]> = [
  [
    'white',
    new HSL(0, 0, 100),
    new HSLuv(0, 0, 100),
    new HSV(0, 0, 100),
    new LAB(100.0, 0.00526049995830391, -0.010408184525267927),
    new LCH(100, 0.011662039483869973, 296.81292623674057),
    new LUV(100, 0.0008906695967064726, -0.01710795288980549), // ?
    new RGB(0xffffff),
    new SRGB(100, 100, 100),
    new XYZ(95.047, 100.00001, 108.883)
  ],
  [
    'black',
    new HSL(0, 0, 0),
    new HSLuv(0, 0, 0),
    new HSV(0, 0, 0),
    new LAB(0, 0, 0),
    new LCH(0, 0, 0),
    new LUV(0, 0, 0), // ?
    new RGB(0x000000),
    new SRGB(0, 0, 0),
    new XYZ(0, 0, 0)
  ],
  [
    'red',
    new HSL(0, 100, 50),
    new HSLuv(39.99901061253295, 130.2942612189005, 53.24079414130722),
    new HSV(0, 100, 100),
    new LAB(53.24079414130722, 80.09245959641109, 67.20319651585301),
    new LCH(53.24079414130722, 104.55176567686985, 39.99901061253295),
    new LUV(53.23711, 175.00981, 37.7651),
    new RGB(0xff0000),
    new SRGB(100, 0, 0),
    new XYZ(41.24564, 21.26729, 1.93339)
  ],
  [
    'blue',
    new HSL(240, 100, 50),
    new HSLuv(306.2849380699878, 180.58923065120075, 32.297010932850725),
    new HSV(240, 100, 100),
    new LAB(32.297010932850725, 79.18751984512224, -107.8601617541481),
    new LCH(32.297010932850725, 133.80761485376166, 306.2849380699878),
    new LUV(32.30087, -9.40241, -130.35109), // ?
    new RGB(0x0000ff),
    new SRGB(0, 0, 100),
    new XYZ(18.04375, 7.2175, 95.03041)
  ],
  [
    'orange',
    new HSL(25, 100, 50),
    new HSLuv(53.47833595850165, 111.817148741431, 63.03279007232754),
    new HSV(25, 100, 100),
    new LAB(63.03279007232754, 53.11047037606681, 71.71795303124753),
    new LCH(63.03279007232754, 89.24229294767866, 53.47833595850165),
    new LUV(63.03017, 124.01539, 54.82948), // ?
    new RGB(0xff6a00),
    new SRGB(100, 41.66666666666667, 0),
    new XYZ(46.42513, 31.62627, 3.659886)
  ],
  [
    'magenta',
    new HSL(300, 100, 50),
    new HSLuv(328.23496466690494, 98.52676527397858, 60.32421212836874),
    new HSV(300, 100, 100),
    new LAB(60.32421212836874, 98.23431188800397, -60.82489220885008),
    new LCH(60.32421212836874, 115.54067484798533, 328.23496466690494),
    new LUV(60.32273, 84.05559, -108.69637), // ?
    new RGB(0xff00ff),
    new SRGB(100, 0, 100),
    new XYZ(59.28939, 28.48479, 96.9638)
  ]
]

function expectColorEqual<T extends { equals: (other: T, tollerance?: number) => boolean }>(
  received: T,
  expected: T,
  delta: number = 0.01
) {
  expect(received.equals(expected, delta)).toBe(true)
}

describe.each(data)(
  'testing %s',
  (name, hsl, hsluv, hsv, lab, lch, luv, rgb, srgb, xyz) => {
    test(`Convert HSL ${name}`, () => {
      expectColorEqual(hsl, hsl)
      expectColorEqual(hsl2hsluv(hsl), hsluv)
      expectColorEqual(hsl2hsv(hsl), hsv)
      expectColorEqual(hsl2lab(hsl), lab)
      expectColorEqual(hsl2lch(hsl), lch)
      expectColorEqual(hsl2luv(hsl), luv, 0.1)
      expectColorEqual(hsl2rgb(hsl), rgb)
      expectColorEqual(hsl2srgb(hsl), srgb)
      expectColorEqual(hsl2xyz(hsl), xyz)
    })

    test(`Convert HSLuv ${name}`, () => {
      expectColorEqual(hsluv, hsluv)
      expectColorEqual(hsluv2hsl(hsluv), hsl)
      expectColorEqual(hsluv2hsv(hsluv), hsv)
      expectColorEqual(hsluv2lab(hsluv), lab)
      expectColorEqual(hsluv2lch(hsluv), lch)
      expectColorEqual(hsluv2luv(hsluv), luv, 0.1)
      expectColorEqual(hsluv2rgb(hsluv), rgb)
      expectColorEqual(hsluv2srgb(hsluv), srgb)
      expectColorEqual(hsluv2xyz(hsluv), xyz)
    })

    test(`Convert HSV ${name}`, () => {
      expectColorEqual(hsv, hsv)
      expectColorEqual(hsv2hsl(hsv), hsl)
      expectColorEqual(hsv2hsluv(hsv), hsluv)
      expectColorEqual(hsv2lab(hsv), lab)
      expectColorEqual(hsv2lch(hsv), lch)
      expectColorEqual(hsv2luv(hsv), luv, 0.1)
      expectColorEqual(hsv2rgb(hsv), rgb)
      expectColorEqual(hsv2srgb(hsv), srgb)
      expectColorEqual(hsv2xyz(hsv), xyz)
    })

    test(`Convert LAB ${name}`, () => {
      expectColorEqual(lab, lab)
      expectColorEqual(lab2hsl(lab), hsl)
      expectColorEqual(lab2hsluv(lab), hsluv)
      expectColorEqual(lab2hsv(lab), hsv, 0.1)
      expectColorEqual(lab2lch(lab), lch)
      expectColorEqual(lab2luv(lab), luv, 0.1)
      expectColorEqual(lab2rgb(lab), rgb)
      expectColorEqual(lab2srgb(lab), srgb)
      expectColorEqual(lab2xyz(lab), xyz, 0.1)
    })

    test(`Convert LCH ${name}`, () => {
      expectColorEqual(lch, lch)
      expectColorEqual(lch2hsl(lch), hsl)
      expectColorEqual(lch2hsluv(lch), hsluv)
      expectColorEqual(lch2hsv(lch), hsv, 0.1)
      expectColorEqual(lch2lab(lch), lab)
      expectColorEqual(lch2luv(lch), luv, 0.1)
      expectColorEqual(lch2rgb(lch), rgb)
      expectColorEqual(lch2srgb(lch), srgb)
      expectColorEqual(lch2xyz(lch), xyz, 0.1)
    })

    test(`Convert LUV ${name}`, () => {
      expectColorEqual(luv, luv)
      expectColorEqual(luv2hsl(luv), hsl, 0.1)
      expectColorEqual(luv2hsluv(luv), hsluv, 0.1)
      expectColorEqual(luv2hsv(luv), hsv, 0.1)
      expectColorEqual(luv2lab(luv), lab, 0.1)
      expectColorEqual(luv2lch(luv), lch, 0.1)
      expectColorEqual(luv2rgb(luv), rgb, 0.1)
      expectColorEqual(luv2srgb(luv), srgb, 0.1)
      expectColorEqual(luv2xyz(luv), xyz, 0.1)
    })

    test(`Convert RGB ${name}`, () => {
      expectColorEqual(rgb, rgb)
      expectColorEqual(rgb2hsl(rgb), hsl, 0.2)
      expectColorEqual(rgb2hsluv(rgb), hsluv, 0.2)
      expectColorEqual(rgb2hsv(rgb), hsv, 0.2)
      expectColorEqual(rgb2lab(rgb), lab, 0.2)
      expectColorEqual(rgb2lch(rgb), lch, 0.2)
      expectColorEqual(rgb2luv(rgb), luv, 0.5)
      expectColorEqual(rgb2srgb(rgb), srgb, 0.2)
      expectColorEqual(rgb2xyz(rgb), xyz, 0.2)
    })

    test(`Convert sRGB ${name}`, () => {
      expectColorEqual(srgb, srgb)
      expectColorEqual(srgb2hsl(srgb), hsl)
      expectColorEqual(srgb2hsluv(srgb), hsluv)
      expectColorEqual(srgb2hsv(srgb), hsv)
      expectColorEqual(srgb2lab(srgb), lab)
      expectColorEqual(srgb2lch(srgb), lch)
      expectColorEqual(srgb2luv(srgb), luv, 0.1)
      expectColorEqual(srgb2rgb(srgb), rgb)
      expectColorEqual(srgb2xyz(srgb), xyz)
    })

    test(`Convert XYZ ${name}`, () => {
      expectColorEqual(xyz, xyz)
      expectColorEqual(xyz2hsl(xyz), hsl)
      expectColorEqual(xyz2hsluv(xyz), hsluv)
      expectColorEqual(xyz2hsv(xyz), hsv)
      expectColorEqual(xyz2lab(xyz), lab)
      expectColorEqual(xyz2lch(xyz), lch)
      expectColorEqual(xyz2luv(xyz), luv, 0.1)
      expectColorEqual(xyz2rgb(xyz), rgb)
      expectColorEqual(xyz2srgb(xyz), srgb)
    })
  }
)
