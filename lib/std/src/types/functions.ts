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

export type Equality<T> = (a: T, b: T) => boolean

export interface Effect<T> {
  (value: T): void
}

export interface Proc {
  (): void
}

export type Lazy<T> = () => T
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Fun = (...args: any[]) => any
export type Fun1<A, T> = (a1: A) => T
export type Fun2<A, B, T> = (a1: A, a2: B) => T
export type Fun3<A, B, C, T> = (a1: A, a2: B, a3: C) => T
export type Fun4<A, B, C, D, T> = (a1: A, a2: B, a3: C, a4: D) => T
export type Fun5<A, B, C, D, E, T> = (a1: A, a2: B, a3: C, a4: D, a5: E) => T
export type Fun6<A, B, C, D, E, F, T> = (
  a1: A,
  a2: B,
  a3: C,
  a4: D,
  a5: E,
  a6: F
) => T

// eslint-disable-next-line @typescript-eslint/ban-types
export type AnyFunction = Fun | Function

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FirstArgument<F extends AnyFunction> = F extends (a: infer A) => any
  ? unknown extends A
    ? never
    : A
  : never

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type OnlyIfDoesNotReturnNever<F extends Fun> = F extends Fun1<any, never>
  ? never
  : F

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CheckFunctionsChain<In, Args extends Fun1<any, any>[]> = {
  empty: (i: In) => In
  one: FirstArgument<Args[0]> extends In ? Args[0] : never
  n: FirstArgument<Args[0]> extends In
    ? (
        arg: FirstArgument<Args[0]>
      ) => ReturnType<CheckFunctionsChain<ReturnType<Args[0]>, Tail<Args>>>
    : never
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}[Args extends [] ? 'empty' : Args extends [any] ? 'one' : 'n']

export type FunctionsChain<In, Args extends Fun[]> = OnlyIfDoesNotReturnNever<
  CheckFunctionsChain<In, Args>
>

// TYPE TESTS
import { Assert, Equals, Extends, AssertNot, IsNever } from './assert'
import { Tail } from './tuples'
type _procedure_is_AnyFunction = Assert<Extends<() => void, AnyFunction>>
// eslint-disable-next-line @typescript-eslint/ban-types
type _Function_is_AnyFunction = Assert<Extends<Function, AnyFunction>>
type _string_is_not_AnyFunction = AssertNot<Extends<string, AnyFunction>>

type _first_argument_matches_type = Assert<
  Equals<FirstArgument<(a: string) => number>, string>
>
type _first_argument_does_not_exist = Assert<
  IsNever<FirstArgument<() => number>>
>

type _chain_matches_first_arg_and_last_return_type = Assert<
  Equals<
    FunctionsChain<
      string,
      [(s: string) => boolean, (b: boolean) => number, (n: number) => Date]
    >,
    Fun1<string, Date>
  >
>

type _chain_is_never_when_does_not_check_out = Assert<
  IsNever<
    FunctionsChain<
      string,
      [(s: string) => boolean, (b: number) => number, (n: number) => Date]
    >
  >
>

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _TESTS_ =
  | _procedure_is_AnyFunction
  | _Function_is_AnyFunction
  | _string_is_not_AnyFunction
  | _first_argument_matches_type
  | _first_argument_does_not_exist
  | _chain_matches_first_arg_and_last_return_type
  | _chain_is_never_when_does_not_check_out
