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

import { Equals, NotEquals } from './assert'

export type Pointer<T> = () => T
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DeRef<T extends () => any> = T extends () => infer Ret ? Ret : never

export type WhenEquals<X, Y, A = X, B = never> = Equals<X, Y> extends true
  ? A
  : B

export type WhenNotEquals<X, Y, A = X, B = never> = NotEquals<X, Y> extends true
  ? A
  : B

export type Cast<A, B> = A extends B ? A : B

// TYPE TESTS
import { Assert } from './assert'

type _when_true_returns_A = Assert<
  Equals<WhenEquals<string, string, number, boolean>, number>
>
type _when_false_returns_B = Assert<
  Equals<WhenEquals<string, number, number, boolean>, boolean>
>

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _TESTS_ = _when_true_returns_A | _when_false_returns_B
