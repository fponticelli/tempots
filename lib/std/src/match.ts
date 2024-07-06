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

import { Differentiate, DifferentiateAt } from './types/differentiate'
import { AnyKey } from './types/utility'
import { ObjectWithField, ObjectWithPath, TypeAtPath } from './types/objects'

export function matchLiteral<A extends AnyKey, B>(
  input: A,
  matcher: { [k in A]: B }
) {
  return matcher[input]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function match<F extends AnyKey, T extends ObjectWithField<F, any>, B>(
  input: T,
  field: F,
  matcher: { [k in T[F]]: (arg: Differentiate<F, T, k>) => B }
): B {
  const k = input[field]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return matcher[k](input as any)
}

export function deepMatch<
  Path extends AnyKey[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends ObjectWithPath<Path, any>,
  B
>(
  input: T,
  path: Path,
  matcher: {
    [k in TypeAtPath<Path, T>]: (arg: DifferentiateAt<Path, T, k>) => B
  }
): B {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const k = path.reduce((res: any, key) => res[key], input) as TypeAtPath<
    Path,
    T
  >
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return matcher[k](input as any)
}

export function createMatch<F extends AnyKey>(field: F) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <T extends ObjectWithField<F, any>, B>(
    input: T,
    matcher: { [k in T[F]]: (arg: Differentiate<F, T, k>) => B }
  ): B => {
    const k = input[field]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return matcher[k](input as any)
  }
}

export const createDeepMatch =
  <Path extends AnyKey[]>(...path: Path) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  <T extends ObjectWithPath<Path, any>, B>(
    input: T,
    matcher: {
      [k in TypeAtPath<Path, T>]: (arg: DifferentiateAt<Path, T, k>) => B
    }
  ): B => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const k = path.reduce((res: any, key) => res[key], input) as TypeAtPath<
      Path,
      T
    >
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return matcher[k](input as any)
  }

export const matchKind = createMatch('kind')
export const matchType = createMatch('type')
