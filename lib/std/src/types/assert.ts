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

import { Pointer } from './generic'

export type Assert<A extends true> = A extends never
  ? 'FAIL'
  : A extends true
  ? 'PASS'
  : 'FAIL'
export type AssertNot<A extends false> = A extends never
  ? 'FAIL'
  : A extends false
  ? 'PASS'
  : 'FAIL'

export type Extends<A, B> = A extends B ? true : false

// do not use with `any`
export type Same<A, B> = Pointer<A> extends Pointer<B>
  ? Pointer<B> extends Pointer<A>
    ? true
    : false
  : false

export type NotSame<A, B> = Pointer<A> extends Pointer<B>
  ? Pointer<B> extends Pointer<A>
    ? false
    : true
  : true

// does not work comparing intersection types with literals. Use `Same` for that.
export type Equals<A, B> = (<T>() => T extends A ? 1 : 2) extends <
  T
>() => T extends B ? 1 : 2
  ? true
  : false

export type NotEquals<A, B> = Equals<A, B> extends true ? false : true

export type IsNever<T> = Pointer<T> extends Pointer<never> ? true : false

// TYPE TESTS
type _primitives_are_not_equals = AssertNot<Equals<number, string>>
type _primitives_are_not_same = AssertNot<Same<number, string>>
type _literals_are_equals = Assert<Equals<1, 1>>
type _literals_are_same = Assert<Same<1, 1>>
type _literals_are_notsame = Assert<NotSame<1, 2>>
type _any_is_not_equal_to_literal = Assert<NotEquals<any, 1>>
type _any_is_equal_to_any = Assert<Equals<any, any>>
type _union_is_not_equal_to_member = Assert<NotEquals<1 | 2, 1>>
type _any_is_not_equal_to_never = Assert<NotEquals<any, never>>
type _any_is_not_same_as_never = Assert<NotEquals<any, never>>
type _same_tuple_elements_match = Assert<Equals<[number], [number]>>
type _different_tuple_elements_do_not_match = Assert<NotEquals<[any], [string]>>
type _intersection_objects_are_same_as_literal = Assert<
  Same<{ x: 1 } & { y: 2 }, { x: 1; y: 2 }>
>
type _intersection_objects_not_equal_to_literal = Assert<
  NotEquals<{ x: 1 } & { y: 2 }, { x: 1; y: 2 }>
>
type _string_is_not_never = AssertNot<IsNever<string>>
type _never_is_never = Assert<IsNever<never>>

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _TESTS_ =
  | _primitives_are_not_equals
  | _primitives_are_not_same
  | _literals_are_equals
  | _literals_are_same
  | _literals_are_notsame
  | _any_is_not_equal_to_literal
  | _any_is_equal_to_any
  | _union_is_not_equal_to_member
  | _any_is_not_equal_to_never
  | _any_is_not_same_as_never
  | _same_tuple_elements_match
  | _different_tuple_elements_do_not_match
  | _intersection_objects_are_same_as_literal
  | _intersection_objects_not_equal_to_literal
  | _string_is_not_never
  | _never_is_never
