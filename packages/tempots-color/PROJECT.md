The @tempots/color library provides a set of immutable color classes and functions to convert between color spaces.

## Convert

This module provides functions to convert between color spaces.

To use it, import function(s) from the module:

```ts
import { hsl2rgb } from '@tempots/color/convert'
```

### Functions

```ts
function cmyk2luv(cmyk: CMYK, whiteReference = WHITE_REFERENCE): LUV
function cmyk2hsl(cmyk: CMYK): HSLfunction cmyk2hsluv(
  cmyk: CMYK,
  whiteReference = WHITE_REFERENCE
): HSLuv
function cmyk2hsv(cmyk: CMYK): HSV
function cmyk2lab(cmyk: CMYK, whiteReference = WHITE_REFERENCE): LAB
function cmyk2lch(cmyk: CMYK, whiteReference = WHITE_REFERENCE): LCH
function cmyk2rgb(cmyk: CMYK): RGB
function cmyk2srgb(cmyk: CMYK): SRGB
function cmyk2xyz(cmyk: CMYK): XYZ
function hsl2cmyk(hsl: HSL): CMYK
function hsl2hsluv(hsl: HSL, whiteReference = WHITE_REFERENCE): HSLuv
function hsl2luv(hsl: HSL, whiteReference = WHITE_REFERENCE): LUV
function hsl2hsv(hsl: HSL): HSV
function hsl2lab(hsl: HSL, whiteReference = WHITE_REFERENCE): LAB
function hsl2lch(hsl: HSL, whiteReference = WHITE_REFERENCE): LCH
function hsl2rgb(hsl: HSL): RGB
function hsl2srgb(hsl: HSL): SRGB
function hsl2xyz(hsl: HSL): XYZ
function hsluv2cmyk(
  hsluv: HSLuv,
  whiteReference = WHITE_REFERENCE
): CMYK
function hsluv2hsl(hsluv: HSLuv, whiteReference = WHITE_REFERENCE): HSL
function hsluv2luv(hsluv: HSLuv, whiteReference = WHITE_REFERENCE): LUV
function hsluv2hsv(hsluv: HSLuv, whiteReference = WHITE_REFERENCE): HSV
function hsluv2lab(hsluv: HSLuv): LAB
function hsluv2lch(hsluv: HSLuv): LCH
function hsluv2rgb(hsluv: HSLuv, whiteReference = WHITE_REFERENCE): RGB
function hsluv2srgb(
  hsluv: HSLuv,
  whiteReference = WHITE_REFERENCE
): SRGB
function hsluv2xyz(hsluv: HSLuv, whiteReference = WHITE_REFERENCE): XYZ
function hsv2cmyk(hsv: HSV): CMYK
function hsv2hsl(hsv: HSV): HSL
function hsv2hsluv(hsv: HSV, whiteReference = WHITE_REFERENCE): HSLuv
function hsv2lab(hsv: HSV, whiteReference = WHITE_REFERENCE): LAB
function hsv2lch(hsv: HSV, whiteReference = WHITE_REFERENCE): LCH
function hsv2luv(hsv: HSV, whiteReference = WHITE_REFERENCE): LUV
function hsv2rgb(hsv: HSV): RGB
function hsv2srgb(hsv: HSV): SRGB
function hsv2xyz(hsv: HSV): XYZ
function lab2cmyk(lab: LAB, whiteReference = WHITE_REFERENCE): CMYK
function lab2hsl(lab: LAB, whiteReference = WHITE_REFERENCE): HSL
function lab2hsluv(lab: LAB): HSLuv
function lab2hsv(lab: LAB, whiteReference = WHITE_REFERENCE): HSV
function lab2lch(lab: LAB): LCH
function lab2luv(lab: LAB, whiteReference = WHITE_REFERENCE): LUV
function lab2rgb(lab: LAB, whiteReference = WHITE_REFERENCE): RGB
function lab2srgb(lab: LAB, whiteReference = WHITE_REFERENCE): SRGB
function lab2xyz(lab: LAB, whiteReference = WHITE_REFERENCE): XYZ
function lch2cmyk(lch: LCH, whiteReference = WHITE_REFERENCE): CMYK
function lch2hsl(lch: LCH, whiteReference = WHITE_REFERENCE): HSL
function lch2hsluv(lch: LCH): HSLuv
function lch2hsv(lch: LCH, whiteReference = WHITE_REFERENCE): HSV
function lch2lab(lch: LCH): LAB
function lch2luv(lch: LCH, whiteReference = WHITE_REFERENCE): LUV
function lch2rgb(lch: LCH, whiteReference = WHITE_REFERENCE): RGB
function lch2srgb(lch: LCH, whiteReference = WHITE_REFERENCE): SRGB
function lch2xyz(lch: LCH, whiteReference = WHITE_REFERENCE): XYZ
function luv2cmyk(luv: LUV, whiteReference = WHITE_REFERENCE): CMYK
function luv2hsl(luv: LUV, whiteReference = WHITE_REFERENCE): HSL
function luv2hsluv(luv: LUV, whiteReference = WHITE_REFERENCE): HSLuv
function luv2hsv(luv: LUV, whiteReference = WHITE_REFERENCE): HSV
function luv2lab(luv: LUV, whiteReference = WHITE_REFERENCE): LAB
function luv2lch(luv: LUV, whiteReference = WHITE_REFERENCE): LCH
function luv2rgb(luv: LUV, whiteReference = WHITE_REFERENCE): RGB
function luv2srgb(luv: LUV, whiteReference = WHITE_REFERENCE): SRGB
function luv2xyz(luv: LUV, whiteReference = WHITE_REFERENCE): XYZ
function rgb2cmyk(rgb: RGB): CMYK
function rgb2hsl(rgb: RGB): HSL
function rgb2hsluv(rgb: RGB, whiteReference = WHITE_REFERENCE): HSLuv
function rgb2hsv(rgb: RGB): HSV
function rgb2lab(rgb: RGB, whiteReference = WHITE_REFERENCE): LAB
function rgb2lch(rgb: RGB, whiteReference = WHITE_REFERENCE): LCH
function rgb2luv(rgb: RGB, whiteReference = WHITE_REFERENCE): LUV
function rgb2srgb(rgb: RGB): SRGB
function rgb2xyz(rgb: RGB): XYZ
function srgb2cmyk(srgb: SRGB): CMYK
function srgb2hsv(srgb: SRGB): HSV
function srgb2hsl(srgb: SRGB): HSL
function srgb2hsluv(
  srgb: SRGB,
  whiteReference = WHITE_REFERENCE
): HSLuv
function srgb2lab(srgb: SRGB, whiteReference = WHITE_REFERENCE): LAB
function srgb2lch(srgb: SRGB, whiteReference = WHITE_REFERENCE): LCH
function srgb2luv(srgb: SRGB, whiteReference = WHITE_REFERENCE): LUV
function srgb2rgb(srgb: SRGB): RGB
function srgb2xyz(srgb: SRGB): XYZ
function xyz2cmyk(xyz: XYZ): CMYK
function xyz2hsl(xyz: XYZ): HSL
function xyz2hsluv(xyz: XYZ, whiteReference = WHITE_REFERENCE): HSLuv
function xyz2hsv(xyz: XYZ): HSV
function xyz2lab(xyz: XYZ, whiteReference = WHITE_REFERENCE): LAB
function xyz2lch(xyz: XYZ, whiteReference = WHITE_REFERENCE): LCH
function xyz2luv(xyz: XYZ, whiteReference = WHITE_REFERENCE): LUV
function xyz2rgb(xyz: XYZ): RGB
function xyz2srgb(xyz: XYZ): SRGB
```

## CMYK

The CMYK class represents a color in the Cyan/Magenta/Yellow/Black (CMYK)  color space. To use it, import the class:

```ts
import { CMYK } from '@tempots/color/cmyk'
```

The CMYK constructor takes four arguments: cyan, magenta, yellow, and black. Each argument is a number between 0 and 100.

```ts
class CMYK {
  static fromString(s: string): CMYK
  static ofChannels([cyan, magenta, yellow, black]: [
    cyan: number,
    magenta: number,
    yellow: number,
    black: number,
  ]): CMYK
  readonly cyan: number
  readonly magenta: number
  readonly yellow: number
  readonly black: number
  constructor(cyan: number, magenta: number, yellow: number, black: number)
  withCyan(cyan: number): CMYK
  withMagenta(magenta: number): CMYK
  withYellow(yellow: number): CMYK
  withBlack(black: number): CMYK
  toChannels(): [number, number, number, number]
  toString(): string
  equals(other: CMYK, tollerance = TOLLERANCE): boolean
}
```

## HSL

The HSL class represents a color in the Hue/Saturation/Lightness (HSL) color space. To use it, import the class:

```ts
import { HSL } from '@tempots/color/hsl'
```

The HSL constructor takes three arguments: hue, saturation, and lightness. Hue is an angle in degrees between 0 and 360, and saturation and lightness are numbers between 0 and 100.

```ts
class HSL {
  static fromString(s: string): HSL
  static ofChannels([hue, saturation, lightness]: [
    hue: number,
    saturation: number,
    lightness: number,
  ]): HSL
  readonly hue: number
  readonly saturation: number
  readonly lightness: number
  constructor(hue: number, saturation = 50, lightness = 50)
  withHue(hue: number): HSL
  withSaturation(saturation: number): HSL
  withLightness(lightness: number): HSL
  toChannels(): [number, number, number]
  toString(): string
  equals(other: HSL, tollerance = TOLLERANCE): boolean
}
```

## HSLA

The HSLA class represents a color in the Hue/Saturation/Lightness/Alpha (HSLA) color space. To use it, import the class:

```ts
import { HSLA } from '@tempots/color/hsla'
```

The HSLA constructor takes four arguments: hue, saturation, lightness, and alpha. Hue is an angle in degrees between 0 and 360, and saturation, lightness, and alpha are numbers between 0 and 100. Alpha is the transparency of the color, with 0 being fully transparent and 100 being fully opaque.

```ts
class HSLA extends HSL {
  readonly alpha: number
  constructor(hue: number, saturation = 50, lightness = 50, alpha = 100)
  override withHue(hue: number): HSLA
  override withSaturation(saturation: number): HSLA
  override withLightness(lightness: number): HSLA
  withAlpha(alpha: number): HSLA
  override toString(): string
  override equals(other: HSLA, tollerance = TOLLERANCE): boolean
}
```

## HSLuv

The HSLuv class represents a color in the HSLuv color space. To use it, import the class:

```ts
import { HSLuv } from '@tempots/color/hsluv'
```

The HSLuv constructor takes three arguments: hue, saturation, and lightness. Hue is an angle in degrees between 0 and 360, and saturation and lightness are numbers between 0 and 100.

```ts
class HSLuv {
  static fromString(s: string): HSLuv
  static ofChannels([hue, saturation, lightness]: [
    hue: number,
    saturation: number,
    lightness: number,
  ]): HSLuv
  readonly hue: number
  readonly saturation: number
  readonly lightness: number
  constructor(hue: number, saturation: number, lightness: number)
  withHue(hue: number): HSLuv
  withSaturation(saturation: number): HSLuv
  withLightness(lightness: number): HSLuv
  toChannels(): [number, number, number]
  toString(): string
  equals(other: HSLuv, tollerance = TOLLERANCE): boolean
}
```

## HSV

The HSV class represents a color in the Hue/Saturation/Value (HSV) color space. To use it, import the class:

```ts
import { HSV } from '@tempots/color/hsv'
```

The HSV constructor takes three arguments: hue, saturation, and value. Hue is an angle in degrees between 0 and 360, and saturation and value are numbers between 0 and 100.

```ts
class HSV {
  static fromString(s: string): HSV
  static ofChannels([hue, saturation, value]: [
    hue: number,
    saturation: number,
    value: number,
  ]): HSV
  readonly hue: number
  readonly saturation: number
  readonly value: number
  constructor(hue: number, saturation: number, value: number)
  withHue(h: number): HSV
  withSaturation(s: number): HSV
  withValue(v: number): HSV
  toChannels(): [number, number, number]
  toString(): string
  equals(other: HSV, tollerance = TOLLERANCE): boolean
}
```

## LAB

The LAB class represents a color in the CIE 1976 (L*, a*, b*) color space. To use it, import the class:

```ts
import { LAB } from '@tempots/color/lab'
```

The LAB constructor takes three arguments: lightness, a, and b. Lightness is a number between 0 and 100, and a and b are numbers between -128 and 127.

```ts
class LAB {
  static fromString(s: string): LAB
  static ofChannels([lightness, a, b]: [
    lightness: number,
    a: number,
    b: number,
  ]): LAB
  readonly lightness: number
  readonly a: number
  readonly b: number
  constructor(lightness: number, a: number, b: number)
  withL(l: number): LAB
  withA(a: number): LAB
  withB(b: number): LAB
  toChannels(): [number, number, number]
  toString(): string
  equals(other: LAB, tollerance = TOLLERANCE): boolean
}
```

## LCH

The LCH class represents a color in the CIE LCh color space. To use it, import the class:

```ts
import { LCH } from '@tempots/color/lch'
```

The LCH constructor takes three arguments: luminance, chroma, and hue. Luminance is a number between 0 and 100, and chroma and hue are numbers between 0 and 100.

```ts
class LCH {
  static ofChannels([l, c, h]: [l: number, c: number, h: number]): LCH
  readonly luminance: number
  readonly chroma: number
  readonly hue: number
  constructor(luminance: number, chroma: number, hue: number)
  withLightness(l: number): LCH
  withChroma(c: number): LCH
  withHue(h: number): LCH
  toChannels(): [number, number, number]
  toString(): string
  equals(other: LCH, tollerance = TOLLERANCE): boolean
}
```

## LUV

The LUV class represents a color in the CIE 1976 (L*, u*, v*) color space. To use it, import the class:

```ts
import { LUV } from '@tempots/color/luv'
```

The LUV constructor takes three arguments: lightness, u, and v. Lightness is a number between 0 and 100, and u and v are numbers between -128 and 127.

```ts
class LUV {
  static ofChannels([l, u, v]: [l: number, u: number, v: number]): LUV
  readonly l: number
  readonly u: number
  readonly v: number
  constructor(l: number, u: number, v: number)
  withL(l: number): LUV
  withU(u: number): LUV
  withV(v: number): LUV
  toChannels(): [number, number, number]
  toString(): string
  equals(other: LUV, tollerance = TOLLERANCE): boolean
}
```

## RGB

The RGB class represents a color in the Red/Green/Blue (RGB) color space. To use it, import the class:

```ts
import { RGB } from '@tempots/color/rgb'
```

The RGB constructor takes a single argument: a number that represents the color as a 24-bit integer.

```ts
class RGB {
  static fromString(s: string): RGB
  static fromRGB(r: number, g: number, b: number): RGB
  static ofChannels([r, g, b]: [r: number, g: number, b: number]): RGB
  constructor(readonly value: number)
  get red(): number
  get green(): number
  get blue(): number
  toChannels(): [number, number, number]
  toString(): string
  equals(other: RGB): boolean
}
```

## RGBA

The RGBA class represents a color in the Red/Green/Blue/Alpha (RGBA) color space. To use it, import the class:

```ts
import { RGBA } from '@tempots/color/rgba'
```

The RGBA constructor takes a single argument: a number that represents the color as a 32-bit integer.

```ts
class RGBA {
  static fromString(s: string): RGBA
  static fromRGBA(r: number, g: number, b: number, a: number): RGBA
  constructor(readonly value: number)
  get red(): number
  get green(): number
  get blue(): number  get alpha(): number
  toString(): string
  equals(other: RGBA): boolean
}
```

## SRGB

The SRGB class represents a color in the Standard RGB (sRGB) color space. To use it, import the class:

```ts
import { SRGB } from '@tempots/color/srgb'
```

The SRGB constructor takes three arguments: red, green, and blue. Each argument is a number between 0 and 255.

```ts
class SRGB {
  static fromString(s: string): SRGB
  static ofChannels([red, blue, green]: [
    red: number,
    blue: number,
    green: number,
  ]): SRGB
  readonly red: number
  readonly blue: number
  readonly green: number
  constructor(red: number, blue: number, green: number)
  withRed(red: number): SRGB
  withBlue(blue: number): SRGB
  withGreen(green: number): SRGB
  toString(): string
  toChannels(): [number, number, number]
  equals(other: SRGB, tollerance = TOLLERANCE): boolean
}
```

## XYZ

The XYZ class represents a color in the CIE 1931 (X, Y, Z) color space. To use it, import the class:

```ts
import { XYZ } from '@tempots/color/xyz'
```

The XYZ constructor takes three arguments: x, y, and z. Each argument is a number.

```ts
class XYZ {
  static ofChannels([x, y, z]: [x: number, y: number, z: number]): XYZ
  readonly x: number
  readonly y: number
  readonly z: number
  constructor(x: number, y: number, z: number)
  withX(x: number): XYZ
  withY(y: number): XYZ
  withZ(z: number): XYZ
  toString(): string
  toChannels(): [number, number, number]
  equals(other: XYZ, tollerance = TOLLERANCE): boolean
}
```
