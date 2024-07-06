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
 * Usage:
 *
 * ```ts
 * export interface Int extends Newtype<
 *   number,
 *   { readonly Int: unique symbol }
 * > {}
 *
 * export const Int = new class extends NewtypeClass<Int> {
 *   isValid(v: number) { return Number.isInteger(v) }
 * }()
 * ```
 */

import { Maybe } from './maybe'

export type TypeOfN<T extends Newtype<unknown, unknown>> = T['_T']

export interface Newtype<V, S> {
  readonly _T: V
  readonly _S: S
}

export abstract class NewtypeClass<T extends Newtype<unknown, unknown>> {
  abstract isValid(v: TypeOfN<T>): boolean
  unsafeOf(v: TypeOfN<T>): T {
    return v as unknown as T
  }
  of(v: TypeOfN<T>): Maybe<T> {
    return this.isValid(v) ? (v as unknown as T) : undefined
  }
  get(v: T): TypeOfN<T> {
    return v as unknown as TypeOfN<T>
  }
  modify(f: (v: TypeOfN<T>) => TypeOfN<T>): (value: T) => Maybe<T> {
    return (value: T) => this.of(f(this.get(value)))
  }
  unsafeModify(f: (v: TypeOfN<T>) => TypeOfN<T>): (value: T) => T {
    return (value: T) => this.unsafeOf(f(this.get(value)))
  }
}
