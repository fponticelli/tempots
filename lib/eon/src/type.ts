import { Name } from "./name"

export const $typeSymbol = Symbol('type')

export type EONTypeString = 'string'
export type EONTypeBoolean = 'boolean'
export type EONTypeFloat = 'number'
export type EONTypeInt = 'int'

export type EONTypePrimitive =
  | EONTypeString
  | EONTypeBoolean
  | EONTypeFloat
  | EONTypeInt

export interface EONTypeArray {
  type: 'array'
  value: EONType
}

export interface EONTypeField {
  field: string
  type: EONType
}

export interface EONTypeRecord {
  type: 'record'
  fields: EONTypeField[]
}

export interface EONTypeMap {
  type: 'map'
  value: EONType
}

export interface EONTypeIntMap {
  type: 'intmap'
  value: EONType
}

export interface EONTypeOption {
  type: 'option'
  constructor: string
  value?: EONType
}

export type EONTypeOneOf = {
  type: 'oneof'
  options: EONTypeOption[]
}

export type EONTypeTypeArgument = {
  type: 'typeargument'
  name: string
}

export interface EONTypeParam {
  argument: string
  type: EONType
}

export interface EONTypeModel {
  type: 'model'
  name: Name
  definition: EONType
  params: string[]
}

export interface EONTypeRef {
  type: 'ref'
  name: Name
  params: EONTypeParam[]
}

export type EONType =
  | EONTypePrimitive
  | EONTypeArray
  | EONTypeMap
  | EONTypeIntMap
  | EONTypeRecord
  | EONTypeOneOf
  | EONTypeTypeArgument
  | EONTypeModel
  | EONTypeRef

// LocalDate https://github.com/fponticelli/thx.core/blob/master/src/thx/LocalDate.hx
// LocalMonthDay https://github.com/fponticelli/thx.core/blob/master/src/thx/LocalMonthDay.hx
// LocalYearMonth https://github.com/fponticelli/thx.core/blob/master/src/thx/LocalYearMonth.hx
// DateTime https://github.com/fponticelli/thx.core/blob/master/src/thx/DateTime.hx
// DateTimeUTC https://github.com/fponticelli/thx.core/blob/master/src/thx/DateTimeUtc.hx
// Time https://github.com/fponticelli/thx.core/blob/master/src/thx/Time.hx
// Timestamp https://github.com/fponticelli/thx.core/blob/master/src/thx/Timestamp.hx

export const EONType = {
  string: 'string' as EONTypeString,
  boolean: 'boolean' as EONTypeBoolean,
  float: 'number' as EONTypeFloat,
  int: 'int' as EONTypeInt,
  array: (value: EONType): EONTypeArray => ({ type: 'array', value }),
  map: (value: EONType): EONTypeMap => ({ type: 'map', value }),
  intMap: (value: EONType): EONTypeIntMap => ({ type: 'intmap', value }),
  record: (fields: EONTypeField[]): EONTypeRecord => ({
    type: 'record',
    fields
  }),
  oneOf: (...options: EONTypeOption[]): EONTypeOneOf => ({
    type: 'oneof',
    options
  }),
  typeArgument: (name: string): EONTypeTypeArgument => ({ type: 'typeargument', name }),
  model: (
    name: Name,
    definition: EONType,
    params: string[] = []
  ): EONTypeModel => ({
    type: 'model',
    name,
    definition,
    params
  }),
  ref: (
    name: Name,
    args: EONTypeParam[] = []
  ): EONTypeRef => ({
    type: 'ref',
    name,
    params: args
  }),
  param: (argument: string, type: EONType): EONTypeParam => ({ argument, type }),
  option: (
    name: string,
    value?: EONType
  ): EONTypeOption => ({ type: 'option', constructor: name, value }),
}
