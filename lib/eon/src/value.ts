export type EONString = string
export type EONBoolean = boolean
export type EONFloat = number
export type EONInt = bigint

export type EONPrimitive = EONString | EONBoolean | EONFloat | EONInt

export type EONArray = EONValue[]

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface EONRecord extends Record<string, EONValue> {}
export type EONMap = Map<string, EONValue> // TODO restrict string to simple tokens [a-z][a-zA-Z0-9]*
export type EONIntMap = Map<bigint, EONValue>
export interface EONOneOfOption {
  $constructor: string;
  value?: EONValue
}
export interface EONInvalid {
  $isInvalid: true
  message: string
}

export type EONData = EONArray | EONRecord | EONMap | EONIntMap | EONOneOfOption

export type EONValue = EONData | EONPrimitive | EONInvalid

export const EONValue = {
  invalid(message: string): EONInvalid {
    return { $isInvalid: true, message }
  },
  option(constructor: string, value?: EONValue): EONOneOfOption {
    return { $constructor: constructor, value }
  },
  isInvalid(value: EONValue): value is EONInvalid {
    return value != null && (value as EONInvalid).$isInvalid
  },
  isOneOfOption(value: EONValue): value is EONOneOfOption {
    return value != null && (value as EONOneOfOption).$constructor != null
  }
}
