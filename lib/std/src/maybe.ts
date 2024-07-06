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

export type Maybe<T> = Just<T> | Nothing

export type Nothing = undefined | null
export type Just<T> = T

export const Maybe = {
  nothing: undefined as Maybe<never>,
  just: <T>(value: T): Maybe<T> => {
    return value
  },

  isNothing: <T>(maybe: Maybe<T>): maybe is Nothing => {
    return maybe == null
  },
  isJust: <T>(maybe: Maybe<T>): maybe is Just<T> => {
    return maybe != null
  }
}
