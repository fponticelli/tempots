export type Union1 = { type: 'Union1'; v1: number }
export type Union2 = { type: 'Union2'; v2: boolean }
export type Union3 = { type: 'Union3'; v3: string }

export type Union = Union1 | Union2 | Union3

export const makeUnion1 = (v1: number): Union1 => ({ type: 'Union1', v1 })
export const makeUnion2 = (v2: boolean): Union2 => ({ type: 'Union2', v2 })
export const makeUnion3 = (v3: string): Union3 => ({ type: 'Union3', v3 })
