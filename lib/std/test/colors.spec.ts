import { describe, expect, test } from 'vitest'
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
  white_reference,
  xyz2hsl,
  xyz2hsluv,
  xyz2hsv,
  xyz2lab,
  xyz2lch,
  xyz2luv,
  xyz2rgb,
  xyz2srgb
} from '../src/colors/convert'
import { HSL } from '../src/colors/hsl'
import { HSLuv } from '../src/colors/hsluv'
import { HSV } from '../src/colors/hsv'
import { LAB } from '../src/colors/lab'
import { LCH } from '../src/colors/lch'
import { LUV } from '../src/colors/luv'
import { RGB } from '../src/colors/rgb'
import { SRGB } from '../src/colors/srgb'
import { XYZ } from '../src/colors/xyz'
import { nearEquals } from '../src/numbers'

expect.extend({
  toNearEqual(
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
  toNearEqualArray(
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
  },
  toColorEqual<
    T extends { equals: (other: T, tollerance?: number) => boolean }
  >(this: any, received: T, expected: T, tollerance = 0.001) {
    const pass = received.equals(expected, tollerance)
    const maybeNot = this.isNot ? 'not ' : ''
    return {
      message: () =>
        `expected ${received} ${maybeNot}to equal ${expected} with tollerance ${tollerance}`,
      pass
    }
  }
})

describe('Channel conversion', () => {
  test('cmyk2rgb', () => {
    expect(Channel.cmyk2rgb([0.6, 0.0, 0.08, 0.07])).toNearEqualArray([
      0.372, 0.93, 0.8556
    ])
  })
  test('hsl2hsv', () => {
    expect(Channel.hsl2hsv([172, 0.8, 0.65])).toNearEqualArray([
      172, 0.60215, 0.93
    ])
  })
  test('hsv2hsl', () => {
    expect(Channel.hsv2hsl([172, 0.60215, 0.93])).toNearEqualArray([
      172, 0.8, 0.65
    ])
  })
  test('hsl2lab', () => {
    expect(Channel.lch2lab([86.07, 42.79865, 183.0])).toNearEqualArray([
      86.07, -42.74, -2.24
    ])
  })
  test('hsl2rgb', () => {
    expect(Channel.hsl2rgb([172, 0.8, 0.65])).toNearEqualArray([
      0.37, 0.9299, 0.8553
    ])
  })
  test('lab2lch', () => {
    expect(Channel.lab2lch([86.07, -42.74, -2.24])).toNearEqualArray([
      86.07, 42.79865, 183.0
    ])
  })
  test('lab2xyz', () => {
    expect(
      Channel.lab2xyz([86.07, -42.74, -2.24], white_reference)
    ).toNearEqualArray([
      47.65533671728852, 68.12717437567908, 77.04768177230773
    ])
  })
  test('lch2lab', () => {
    expect(Channel.lch2lab([86, 42.699, 183.024])).toNearEqualArray([
      86.0, -42.64, -2.25
    ])
  })
  test('luv2xyz', () => {
    expect(
      Channel.luv2xyz([81.495, -60.109, 95.919], white_reference)
    ).toNearEqualArray([33.727, 59.37, 10.602])
  })
  test('rgb2cmyk', () => {
    expect(Channel.rgb2cmyk([0.372, 0.93, 0.8556])).toNearEqualArray([
      0.6, 0.0, 0.08, 0.07
    ])
  })
  test('rgb2hsl', () => {
    expect(Channel.rgb2hsl([0.37, 0.9299, 0.8553])).toNearEqualArray([
      172, 0.8, 0.65
    ])
  })
  test('rgb2xyz', () => {
    expect(Channel.rgb2xyz([100 / 255, 230 / 255, 25 / 255])).toNearEqualArray([
      33.727, 59.37, 10.602
    ])
  })
  test('xyz2lab', () => {
    expect(
      Channel.xyz2lab([47.6553, 68.1272, 77.0477], white_reference)
    ).toNearEqualArray([86.07001279, -42.74015717, -2.2399919])
  })
  test('xyz2luv', () => {
    expect(
      Channel.xyz2luv([33.727, 59.37, 10.602], white_reference)
    ).toNearEqualArray([81.495, -60.109, 95.919])
  })
  test('xyz2rgb', () => {
    expect(Channel.xyz2rgb([33.727, 59.37, 10.602])).toNearEqualArray([
      100 / 255,
      230 / 255,
      25 / 255
    ])
  })
})

const data: [string, HSL, HSLuv, HSV, LAB, LCH, LUV, RGB, SRGB, XYZ][] = [
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

describe.each(data)(
  'testing %s',
  (name, hsl, hsluv, hsv, lab, lch, luv, rgb, srgb, xyz) => {
    test(`Convert HSL ${name}`, () => {
      expect(hsl).toColorEqual(hsl)
      expect(hsl2hsluv(hsl)).toColorEqual(hsluv)
      expect(hsl2hsv(hsl)).toColorEqual(hsv)
      expect(hsl2lab(hsl)).toColorEqual(lab)
      expect(hsl2lch(hsl)).toColorEqual(lch)
      expect(hsl2luv(hsl)).toColorEqual(luv, 0.1)
      expect(hsl2rgb(hsl)).toColorEqual(rgb)
      expect(hsl2srgb(hsl)).toColorEqual(srgb)
      expect(hsl2xyz(hsl)).toColorEqual(xyz)
    })

    test(`Convert HSLuv ${name}`, () => {
      expect(hsluv).toColorEqual(hsluv)
      expect(hsluv2hsl(hsluv)).toColorEqual(hsl)
      expect(hsluv2hsv(hsluv)).toColorEqual(hsv)
      expect(hsluv2lab(hsluv)).toColorEqual(lab)
      expect(hsluv2lch(hsluv)).toColorEqual(lch)
      expect(hsluv2luv(hsluv)).toColorEqual(luv, 0.1)
      expect(hsluv2rgb(hsluv)).toColorEqual(rgb)
      expect(hsluv2srgb(hsluv)).toColorEqual(srgb)
      expect(hsluv2xyz(hsluv)).toColorEqual(xyz)
    })

    test(`Convert HSV ${name}`, () => {
      expect(hsv).toColorEqual(hsv)
      expect(hsv2hsl(hsv)).toColorEqual(hsl)
      expect(hsv2hsluv(hsv)).toColorEqual(hsluv)
      expect(hsv2lab(hsv)).toColorEqual(lab)
      expect(hsv2lch(hsv)).toColorEqual(lch)
      expect(hsv2luv(hsv)).toColorEqual(luv, 0.1)
      expect(hsv2rgb(hsv)).toColorEqual(rgb)
      expect(hsv2srgb(hsv)).toColorEqual(srgb)
      expect(hsv2xyz(hsv)).toColorEqual(xyz)
    })

    test(`Convert LAB ${name}`, () => {
      expect(lab).toColorEqual(lab)
      expect(lab2hsl(lab)).toColorEqual(hsl)
      expect(lab2hsluv(lab)).toColorEqual(hsluv)
      expect(lab2hsv(lab)).toColorEqual(hsv, 0.1)
      expect(lab2lch(lab)).toColorEqual(lch)
      expect(lab2luv(lab)).toColorEqual(luv, 0.1)
      expect(lab2rgb(lab)).toColorEqual(rgb)
      expect(lab2srgb(lab)).toColorEqual(srgb)
      expect(lab2xyz(lab)).toColorEqual(xyz, 0.1)
    })

    test(`Convert LCH ${name}`, () => {
      expect(lch).toColorEqual(lch)
      expect(lch2hsl(lch)).toColorEqual(hsl)
      expect(lch2hsluv(lch)).toColorEqual(hsluv)
      expect(lch2hsv(lch)).toColorEqual(hsv, 0.1)
      expect(lch2lab(lch)).toColorEqual(lab)
      expect(lch2luv(lch)).toColorEqual(luv, 0.1)
      expect(lch2rgb(lch)).toColorEqual(rgb)
      expect(lch2srgb(lch)).toColorEqual(srgb)
      expect(lch2xyz(lch)).toColorEqual(xyz, 0.1)
    })

    test(`Convert LUV ${name}`, () => {
      expect(luv).toColorEqual(luv)
      expect(luv2hsl(luv)).toColorEqual(hsl, 0.1)
      expect(luv2hsluv(luv)).toColorEqual(hsluv, 0.1)
      expect(luv2hsv(luv)).toColorEqual(hsv, 0.1)
      expect(luv2lab(luv)).toColorEqual(lab, 0.1)
      expect(luv2lch(luv)).toColorEqual(lch, 0.1)
      expect(luv2rgb(luv)).toColorEqual(rgb, 0.1)
      expect(luv2srgb(luv)).toColorEqual(srgb, 0.1)
      expect(luv2xyz(luv)).toColorEqual(xyz, 0.1)
    })

    test(`Convert RGB ${name}`, () => {
      expect(rgb).toColorEqual(rgb)
      expect(rgb2hsl(rgb)).toColorEqual(hsl, 0.2)
      expect(rgb2hsluv(rgb)).toColorEqual(hsluv, 0.2)
      expect(rgb2hsv(rgb)).toColorEqual(hsv, 0.2)
      expect(rgb2lab(rgb)).toColorEqual(lab, 0.2)
      expect(rgb2lch(rgb)).toColorEqual(lch, 0.2)
      expect(rgb2luv(rgb)).toColorEqual(luv, 0.5)
      expect(rgb2srgb(rgb)).toColorEqual(srgb, 0.2)
      expect(rgb2xyz(rgb)).toColorEqual(xyz, 0.2)
    })

    test(`Convert sRGB ${name}`, () => {
      expect(srgb).toColorEqual(srgb)
      expect(srgb2hsl(srgb)).toColorEqual(hsl)
      expect(srgb2hsluv(srgb)).toColorEqual(hsluv)
      expect(srgb2hsv(srgb)).toColorEqual(hsv)
      expect(srgb2lab(srgb)).toColorEqual(lab)
      expect(srgb2lch(srgb)).toColorEqual(lch)
      expect(srgb2luv(srgb)).toColorEqual(luv, 0.1)
      expect(srgb2rgb(srgb)).toColorEqual(rgb)
      expect(srgb2xyz(srgb)).toColorEqual(xyz)
    })

    test(`Convert XYZ ${name}`, () => {
      expect(xyz).toColorEqual(xyz)
      expect(xyz2hsl(xyz)).toColorEqual(hsl)
      expect(xyz2hsluv(xyz)).toColorEqual(hsluv)
      expect(xyz2hsv(xyz)).toColorEqual(hsv)
      expect(xyz2lab(xyz)).toColorEqual(lab)
      expect(xyz2lch(xyz)).toColorEqual(lch)
      expect(xyz2luv(xyz)).toColorEqual(luv, 0.1)
      expect(xyz2rgb(xyz)).toColorEqual(rgb)
      expect(xyz2srgb(xyz)).toColorEqual(srgb)
    })
  }
)
