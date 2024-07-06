import { css, CSSObject } from '@emotion/css'
import { Signal } from '@tempots/dom'

export type CSSObjectOfProperties = {
  [K in keyof CSSObject]: Signal<CSSObject[K]> | CSSObject[K]
}

export type SX =
  | Signal<CSSObject>
  | CSSObjectOfProperties

export const objectOfPropertiesToSignalOfObject = (
  sx: CSSObjectOfProperties
): Signal<CSSObject> => {
  const keys = Object.keys(sx)
  const values = keys.map(k => sx[k])
  return keys.reduce((acc: Signal<CSSObject>, k: string, i: number) => {
    const field = values[i]
    if (field == null) return acc
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const value = Signal.wrap<any>(field)
    return acc.combine(value, (a, v) => ({ ...a, [k]: v }))
  }, Signal.of({} as CSSObject))
}

export const sxToSignal = (sx: SX): Signal<CSSObject> => {
  if (typeof sx === "object" && Signal.isSignal(sx)) {
    return sx as Signal<CSSObject>
  } else {
    sx = Signal.isSignal<CSSObjectOfProperties>(sx as CSSObjectOfProperties)
      ? (sx as unknown as Signal<CSSObjectOfProperties>).get()
      : sx
    return objectOfPropertiesToSignalOfObject(sx as CSSObjectOfProperties)
  }
}

export const sxToClassProp = (
  sx: SX
): Signal<string | undefined> => {
  return sxToSignal(sx).map(v => css(v) as string | undefined)
}
