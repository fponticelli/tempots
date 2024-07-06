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

import { Prop } from '@tempots/dom'
import { State, Filter } from './types'

const STORE_KEY = 'todomvc-tempo'

export class DataStore {
  static get(): State {
    const store = localStorage.getItem(STORE_KEY)
    return (
      (store && JSON.parse(store)) || {
        filter: Filter.All,
        todos: [],
        completed: 0
      }
    )
  }

  static set(data: State) {
    return localStorage.setItem(STORE_KEY, JSON.stringify(data))
  }
}

export const useDataStoreFlow = (): Prop<State> => {
  const state = Prop.of(DataStore.get())
  state.subscribe(DataStore.set)
  return state
}
