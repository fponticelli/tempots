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

export enum Ordering {
  LT = -1,
  EQ = 0,
  GT = 1
}

export type CompareOrd<T> = (a: T, b: T) => Ordering
export type Compare<T> = (a: T, b: T) => number

export class Ord<T> {
  static fromNumberComparison<T>(compare: (a: T, b: T) => number) {
    return new Ord<T>(fromNumberComparison(compare))
  }

  constructor(readonly compare: CompareOrd<T>) {}

  max(a: T, b: T) {
    switch (this.compare(a, b)) {
      case Ordering.LT:
      case Ordering.EQ:
        return a
      case Ordering.GT:
        return b
    }
  }

  min(a: T, b: T) {
    switch (this.compare(a, b)) {
      case Ordering.GT:
      case Ordering.EQ:
        return a
      case Ordering.LT:
        return b
    }
  }

  equals(a: T, b: T) {
    switch (this.compare(a, b)) {
      case Ordering.EQ:
        return true
      default:
        return false
    }
  }

  contramap<B>(f: (b: B) => T): Ord<B> {
    return new Ord((b0: B, b1: B) => this.compare(f(b0), f(b1)))
  }

  inverse(): Ord<T> {
    return new Ord((a0: T, a1: T) => this.compare(a1, a0))
  }

  numberComparison(a0: T, a1: T): number {
    return this.compare(a0, a1)
  }
}

export function fromNumberComparison<A>(f: (a: A, b: A) => number) {
  return function compare(a: A, b: A) {
    const r = f(a, b)
    if (r < 0) return Ordering.LT
    else if (r === 0) return Ordering.EQ
    else return Ordering.GT
  }
}
