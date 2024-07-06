/* eslint-disable @typescript-eslint/no-explicit-any */
/*
Copyright 2019 Google LLC
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    https://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

/**
 *
 */

import { AnyKey } from './utility'
import { ObjectWithField } from './objects'
import { Tail } from './tuples'

export type Differentiate<
  Field extends AnyKey,
  State extends ObjectWithField<Field, any>,
  ExpectedType extends State[Field]
> = State extends ObjectWithField<Field, ExpectedType> ? State : never

export type DifferentiateByKind<
  State extends { kind: any },
  K extends State['kind']
> = Differentiate<'kind', State, K>

export type DifferentiateAt<
  Path extends AnyKey[],
  State,
  ExpectedType
> = Path extends []
  ? State
  : Path extends [infer T]
  ? T extends keyof State
    ? ExpectedType extends State[T]
      ? Differentiate<T, State, ExpectedType>
      : never
    : never
  : Path extends [infer K, ...any[]]
  ? K extends keyof State
    ? Tail<Path> extends infer Rest
      ? Rest extends AnyKey[]
        ? State & { [k in K]: DifferentiateAt<Rest, State[k], ExpectedType> }
        : never
      : never
    : never
  : never

// TYPE TESTS
import { Assert, AssertNot, Equals, Same } from './assert'

type A = { kind: 'A'; a: string }
type B = { kind: 'B'; b: string }
type AB = A | B

// DifferentiateByKind
type T0 = Differentiate<'kind', AB, 'A'>

type _T0_should_only_include_A = Assert<Equals<T0, A>>
type _T0_should_not_include_B = AssertNot<Equals<T0, B>>

// DifferentiateByKind
type T1 = DifferentiateByKind<AB, 'A'>

type _T1_should_only_include_A = Assert<Equals<T1, A>>
type _T1_should_not_include_B = AssertNot<Equals<T1, B>>

// DifferentiateAt
type C = { ab: AB; c: string }
type T2 = DifferentiateAt<['ab', 'kind'], C, 'A'>

type _T2_should_only_include_A = Assert<
  Same<T2, { ab: { kind: 'A'; a: string }; c: string }>
>

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _TESTS_ =
  | _T0_should_only_include_A
  | _T0_should_not_include_B
  | _T1_should_only_include_A
  | _T1_should_not_include_B
  | _T2_should_only_include_A
