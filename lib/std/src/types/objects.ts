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
import { Tail } from './tuples'
import { AnyFunction } from './functions'

export type ObjectWithField<F extends AnyKey, V> = { [_ in F]: V }

export type ObjectWithPath<Path extends AnyKey[], V> = Path extends []
  ? // eslint-disable-next-line @typescript-eslint/ban-types
    {}
  : Path extends [infer T]
  ? T extends AnyKey
    ? { [_ in T]: V }
    : never
  : // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Path extends [infer K, ...any[]]
  ? K extends AnyKey
    ? Tail<Path> extends infer Rest
      ? Rest extends AnyKey[]
        ? { [_ in K]: ObjectWithPath<Rest, V> }
        : never
      : never
    : never
  : never

export type TypeAtPath<Path extends AnyKey[], O> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  next: Path extends [infer K, ...any[]]
    ? K extends AnyKey
      ? Tail<Path> extends infer Rest
        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
          O extends Record<AnyKey, any>
          ? Rest extends AnyKey[]
            ? TypeAtPath<Rest, O[K]>
            : never
          : never
        : never
      : never
    : never
  empty: O
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  done: O extends Record<AnyKey, any>
    ? Path extends [infer K]
      ? K extends AnyKey
        ? O[K]
        : never
      : never
    : never
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}[Path extends [] ? 'empty' : Path extends [any] ? 'done' : 'next']

export type WritableKeys<T> = {
  [K in keyof T]-?: WhenEquals<
    { [Q in K]: T[K] },
    { -readonly [Q in K]: T[K] },
    K
  >
}[keyof T]

export type ReadonlyKeys<T> = {
  [P in keyof T]-?: WhenEquals<
    { [Q in P]: T[P] },
    { -readonly [Q in P]: T[P] },
    never,
    P
  >
}[keyof T]

// eslint-disable-next-line @typescript-eslint/ban-types
export type Id<T> = {} & { [P in keyof T]: T[P] }

export type KeysWithFieldType<T, Condition> = {
  [K in keyof T]: WhenEquals<T[K], Condition, K>
}[keyof T]

export type KeysWithoutFieldType<T, Condition> = {
  [K in keyof T]: WhenEquals<T[K], Condition, never, K>
}[keyof T]

export type RemoveNullableFromFields<T> = {
  [K in keyof T]: NonNullable<T[K]>
}

export type WritableFields<T> = Pick<T, WritableKeys<T>>
export type ReadonlyFields<T> = Pick<T, ReadonlyKeys<T>>
export type ExcludeFunctionFields<T> = Pick<
  T,
  KeysWithoutFieldType<T, AnyFunction>
>

export type Merge<A, B> = Id<A & B>

// TYPE TESTS
import { Assert, Equals, AssertNot } from './assert'
import { WhenEquals } from './generic'

type _merged_ = Merge<{ a: string; c?: number }, { b?: boolean }>
type _merge_two_object_types_ = Assert<
  Equals<_merged_, { a: string; b?: boolean; c?: number }>
>

type _object_with_field_has_field = Assert<
  Equals<{ a: number }, ObjectWithField<'a', number>>
>
type _object_with_field_has_no_field = AssertNot<
  Equals<{ a: number }, ObjectWithField<'c', number>>
>

type _object_with_empty_path_is_empty_object = Assert<
  // eslint-disable-next-line @typescript-eslint/ban-types
  Equals<{}, ObjectWithPath<[], number>>
>
type _object_with_tuple_of_one_is_object = Assert<
  Equals<{ a: number }, ObjectWithPath<['a'], number>>
>
type _object_with_tuple_of_two_is_object = Assert<
  Equals<{ a: { b: number } }, ObjectWithPath<['a', 'b'], number>>
>
type _object_with_tuple_of_three_is_object = Assert<
  Equals<{ a: { b: { c: number } } }, ObjectWithPath<['a', 'b', 'c'], number>>
>

type _nested = { a: { b: boolean[]; c: number }; d: string }
type _type_at_empty_path_is_type_of_argument = Assert<
  Equals<_nested, TypeAtPath<[], _nested>>
>
type _type_at_level_1 = Assert<
  Equals<{ b: boolean[]; c: number }, TypeAtPath<['a'], _nested>>
>
type _type_at_level_2 = Assert<
  Equals<boolean[], TypeAtPath<['a', 'b'], _nested>>
>
type _type_at_level_3 = Assert<
  Equals<boolean, TypeAtPath<['a', 'b', number], _nested>>
>

// eslint-disable-next-line @typescript-eslint/ban-types
type _writable_keys_of_empty_is_never = Assert<Equals<WritableKeys<{}>, never>>
type _writable_keys_of_writable_is_keys = Assert<
  Equals<WritableKeys<{ a: string; b: string }>, 'a' | 'b'>
>
type _writable_keys_of_mixed_is_subset = Assert<
  Equals<WritableKeys<{ a: string; b: string; readonly c: number }>, 'a' | 'b'>
>

// eslint-disable-next-line @typescript-eslint/ban-types
type _readonly_keys_of_empty_is_never = Assert<Equals<ReadonlyKeys<{}>, never>>
type _readonly_keys_of_readonly_is_keys = Assert<
  Equals<ReadonlyKeys<{ readonly a: string; readonly b: string }>, 'a' | 'b'>
>
type _readonly_keys_of_mixed_is_subset = Assert<
  Equals<
    ReadonlyKeys<{ readonly a: string; readonly b: string; c: number }>,
    'a' | 'b'
  >
>

type _KeysWithFieldType_matches = Assert<
  Equals<KeysWithFieldType<{ a: string; b: number }, string>, 'a'>
>
type _KeysWithoutFieldType_matches = Assert<
  Equals<KeysWithoutFieldType<{ a: string; b: number }, number>, 'a'>
>
type _RemoveNullableFromFields_matches = Assert<
  Equals<
    RemoveNullableFromFields<{
      a: string | null | undefined
      b: number | null
      c: boolean
    }>,
    { a: string; b: number; c: boolean }
  >
>

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _TESTS_ =
  | _merge_two_object_types_
  | _object_with_field_has_field
  | _object_with_field_has_no_field
  | _object_with_empty_path_is_empty_object
  | _object_with_tuple_of_one_is_object
  | _object_with_tuple_of_two_is_object
  | _object_with_tuple_of_three_is_object
  | _type_at_empty_path_is_type_of_argument
  | _type_at_level_1
  | _type_at_level_2
  | _type_at_level_3
  | _writable_keys_of_empty_is_never
  | _writable_keys_of_writable_is_keys
  | _writable_keys_of_mixed_is_subset
  | _readonly_keys_of_empty_is_never
  | _readonly_keys_of_readonly_is_keys
  | _readonly_keys_of_mixed_is_subset
  | _KeysWithFieldType_matches
  | _KeysWithoutFieldType_matches
  | _RemoveNullableFromFields_matches
