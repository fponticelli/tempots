import { Name } from "./name"
import { EONType } from "./type"
import { EONValue } from "./value"

export interface FRef {
  kind: "ref"
  name: Name
}

export interface FValue {
  kind: "value"
  value: EONValue
  type: EONType
}

export interface FSum {
  kind: "sum"
  left: Formula
  right: Formula
}

export type Formula = FRef | FValue | FSum

