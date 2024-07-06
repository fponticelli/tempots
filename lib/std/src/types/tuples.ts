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

import { Pointer, DeRef } from './generic'

export type Tail<T extends any[]> = ((...args: T) => void) extends (
  _: any,
  ...rest: infer Rest
) => void
  ? Rest
  : never

type DropNImpl<N extends number, T extends any[], I extends any[]> = {
  return: T
  next: DropNImpl<N, Tail<T>, Prepend<any, I>>
}[Length<I> extends N ? 'return' : 'next']

export type DropN<N extends number, T extends any[]> = DropNImpl<N, T, []>

type ReverseImpl<T extends any[], R extends any[], I extends any[]> = {
  return: DeRef<Pointer<R>>
  next: ReverseImpl<T, Prepend<T[Length<I>], R>, Prepend<any, I>>
}[Length<I> extends Length<T> ? 'return' : 'next']

export type Reverse<T extends any[]> = ReverseImpl<T, [], []>

export type Head<T extends any[]> = T extends [infer H, ...any[]] ? H : never

export type Last<T extends any[]> = {
  n: Last<Tail<T>>
  one: T extends [infer H] ? H : never
  empty: never
}[T extends [] ? 'empty' : T extends [any] ? 'one' : 'n']

export type TupleToUnion<T extends any[]> = T[number]

export type Prepend<Insert, Tail extends any[]> = [Insert, ...Tail]

export type Append<Tuple extends any[], Element> = [...Tuple, Element]

export type Length<T extends any[]> = T['length']

// export type Concat<A extends any[], B extends any[]> =
//   ReverseImpl<Cast<ReverseImpl<A, [], []>, any[]>, B, []>

// export type Append<A extends any[], B> = Concat<A, [B]>

// export type Pop<A extends any[]> = Head<Reverse<A>>

export type LoseLastImpl<A extends any[], B extends any[]> = {
  empty: A
  next: LoseLastImpl<Prepend<B[0], A>, Tail<B>>
}[B extends [] ? 'empty' : B extends [any] ? 'empty' : 'next']

export type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never

type LastOf<T> = UnionToIntersection<
  T extends any ? () => T : never
> extends () => infer R
  ? R
  : never

export type Push<T extends any[], V> = [...T, V]

export type UnionToTuple<
  T,
  L = LastOf<T>,
  N = [T] extends [never] ? true : false
> = true extends N ? [] : Push<UnionToTuple1<Exclude<T, L>>, L>
type UnionToTuple1<
  T,
  L = LastOf<T>,
  N = [T] extends [never] ? true : false
> = true extends N ? [] : Push<UnionToTuple2<Exclude<T, L>>, L>
type UnionToTuple2<
  T,
  L = LastOf<T>,
  N = [T] extends [never] ? true : false
> = true extends N ? [] : Push<UnionToTuple3<Exclude<T, L>>, L>
type UnionToTuple3<
  T,
  L = LastOf<T>,
  N = [T] extends [never] ? true : false
> = true extends N ? [] : Push<UnionToTuple4<Exclude<T, L>>, L>
type UnionToTuple4<
  T,
  L = LastOf<T>,
  N = [T] extends [never] ? true : false
> = true extends N ? [] : Push<UnionToTuple5<Exclude<T, L>>, L>
type UnionToTuple5<
  T,
  L = LastOf<T>,
  N = [T] extends [never] ? true : false
> = true extends N ? [] : Push<UnionToTuple6<Exclude<T, L>>, L>
type UnionToTuple6<
  T,
  L = LastOf<T>,
  N = [T] extends [never] ? true : false
> = true extends N ? [] : Push<UnionToTuple7<Exclude<T, L>>, L>
type UnionToTuple7<
  T,
  L = LastOf<T>,
  N = [T] extends [never] ? true : false
> = true extends N ? [] : Push<UnionToTuple8<Exclude<T, L>>, L>
type UnionToTuple8<
  T,
  L = LastOf<T>,
  N = [T] extends [never] ? true : false
> = true extends N ? [] : Push<UnionToTuple9<Exclude<T, L>>, L>
type UnionToTuple9<
  T,
  L = LastOf<T>,
  N = [T] extends [never] ? true : false
> = true extends N ? [] : Push<UnionToTupleX<Exclude<T, L>>, L>
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type UnionToTupleX<T> = never

// export type LoseLast<A extends any[]> = Reverse<LoseLastImpl<[], A>>

// TYPE TESTS
import { Assert, Equals, AssertNot, NotEquals } from './assert'

type _head = Head<[number, string]>
type _tail = Tail<[number, string, boolean]>
type _head_is_number = Assert<Equals<_head, number>>
type _tail_is_string_boolean = Assert<Equals<_tail, [string, boolean]>>
type _head_is_not_string = AssertNot<Equals<Head<[number, string]>, boolean>>
type _last_is_boolean = Assert<Equals<Last<[number, string, boolean]>, boolean>>
type _last_is_not_string = Assert<NotEquals<Last<[number, string]>, boolean>>
type _tuple_to_union_of_empty_is_never = Assert<Equals<TupleToUnion<[]>, never>>
type _tuple_to_union_of_not_empty_is_list = Assert<
  Equals<TupleToUnion<[string, 1]>, string | 1>
>
type _union_to_tuple_of_not_empty_set_is_list = Assert<
  Equals<UnionToTuple<string | 1>, [string, 1]>
>
type _prepend_works_on_empty_tail = Assert<
  Equals<Prepend<string, []>, [string]>
>
type _prepend_works_on_non_empty_tail = Assert<
  Equals<Prepend<string, [number]>, [string, number]>
>
type _prepend_fails_on_mismatching_types = Assert<
  NotEquals<Prepend<string, [boolean]>, [string, number]>
>
type _append_works_on_empty_list = Assert<Equals<Append<[], string>, [string]>>
type _append_works_on_non_empty_list = Assert<
  Equals<Append<[number], string>, [number, string]>
>
type _append_works_on_non_empty_list2 = Assert<
  Equals<Append<[number, boolean], string>, [number, boolean, string]>
>
type _append_fails_on_mismatching_types = Assert<
  NotEquals<Append<[boolean], string>, [string, number]>
>
type _length_works_with_empty = Assert<Equals<Length<[]>, 0>>
type _length_works_with_one = Assert<Equals<Length<[1]>, 1>>
type _length_works_with_tewo = Assert<Equals<Length<[1, 2]>, 2>>
type _length_works_with_three = Assert<Equals<Length<[1, 2, 3]>, 3>>
type _length_works_with_four = Assert<Equals<Length<[1, 2, 3, 4]>, 4>>

type _DropN_works_dropping_1_of_2 = Assert<Equals<DropN<1, [1, 2]>, [2]>>
type _DropN_works_dropping_2_of_4 = Assert<
  Equals<DropN<2, [1, 2, 3, 4]>, [3, 4]>
>
type _DropN_works_dropping_4_of_4 = Assert<Equals<DropN<4, [1, 2, 3, 4]>, []>>

type _reverse_empty_works = Assert<Equals<Reverse<[]>, []>>
type _reverse_one_works = Assert<Equals<Reverse<[1]>, [1]>>
type _reverse_two_works = Assert<Equals<Reverse<[1, 2]>, [2, 1]>>
type _reverse_three_works = Assert<Equals<Reverse<[1, 2, 3]>, [3, 2, 1]>>
type _reverse_four_works = Assert<Equals<Reverse<[1, 2, 3, 4]>, [4, 3, 2, 1]>>

// type _Concat_0_0 = Assert<Equals<Concat<[], []>, []>>
// type _Concat_0_1 = Assert<Equals<Concat<[], [1]>, [1]>>
// type _Concat_1_0 = Assert<Equals<Concat<[1], []>, [1]>>
// type _Concat_2_3 = Assert<Equals<Concat<[1, 2], [3, 4, 5]>, [1, 2, 3, 4, 5]>>

// type _Pop_1 = Assert<Equals<Pop<[1]>, 1>>
// type _Pop_2 = Assert<Equals<Pop<[1, 2]>, 2>>
// type _LoseLast_1 = Assert<Equals<LoseLast<[1]>, []>>
// type _LoseLast_2 = Assert<Equals<LoseLast<[1, 2]>, [1]>>
// type _LoseLast_3 = Assert<Equals<LoseLast<[1, 2, 3]>, [1, 2]>>
// type _LoseLast_4 = Assert<Equals<LoseLast<[1, 2, 3, 4]>, [1, 2, 3]>>

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _TESTS_ =
  | _head_is_number
  | _tail_is_string_boolean
  | _head_is_not_string
  | _last_is_boolean
  | _last_is_not_string
  | _tuple_to_union_of_empty_is_never
  | _tuple_to_union_of_not_empty_is_list
  | _union_to_tuple_of_not_empty_set_is_list
  | _prepend_works_on_empty_tail
  | _prepend_works_on_non_empty_tail
  | _prepend_fails_on_mismatching_types
  | _append_works_on_empty_list
  | _append_works_on_non_empty_list
  | _append_works_on_non_empty_list2
  | _append_fails_on_mismatching_types
  | _length_works_with_empty
  | _length_works_with_one
  | _length_works_with_tewo
  | _length_works_with_three
  | _length_works_with_four
  | _DropN_works_dropping_1_of_2
  | _DropN_works_dropping_2_of_4
  | _DropN_works_dropping_4_of_4
  | _reverse_empty_works
  | _reverse_one_works
  | _reverse_two_works
  | _reverse_three_works
  | _reverse_four_works
// | _Concat_0_0
// | _Concat_0_1
// | _Concat_1_0
// | _Concat_2_3
// | _Pop_1
// | _Pop_2
// | _LoseLast_1
// | _LoseLast_2
// | _LoseLast_3
// | _LoseLast_4
