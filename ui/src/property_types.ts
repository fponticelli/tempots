// PADDING

export type Padding =
  | { kind: 'PaddingAll', value: number }
  | { kind: 'PaddingHV', h: number, v: number }
  | { kind: 'PaddingEach', top: number, right: number, bottom: number, left: number }

export function paddingAll(value: number): Padding {
  return { kind: 'PaddingAll', value }
}
export function paddingHV(h: number, v: number): Padding {
  return { kind: 'PaddingHV', h, v }
}
export function paddingEach(
  top: number,
  right: number = top,
  bottom: number = top,
  left: number = right
): Padding {
  return { kind: 'PaddingEach', top, right, bottom, left }
}

// LENGTH

export type Length =
  | { kind: 'LengthPx', value: number }
  | { kind: 'LengthShrink' }
  | { kind: 'LengthFill' }
  | { kind: 'LengthFillPortion', portion: number }
  | { kind: 'LengthMax', max: number, length: Length }
  | { kind: 'LengthMin', min: number, length: Length }

export function px(value: number): Length {
  return { kind: 'LengthPx', value }
}
export const shrink: Length = { kind: 'LengthShrink' }
export const fill: Length = { kind: 'LengthFill' }
export function fillPortion(portion: number): Length {
  return { kind: 'LengthFillPortion', portion }
}
export function maxLength(max: number, length: Length): Length {
  return { kind: 'LengthMax', max, length }
}
export function minLength(min: number, length: Length): Length {
  return { kind: 'LengthMin', min, length }
}
