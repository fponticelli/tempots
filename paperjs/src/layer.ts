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

import { Layer } from 'paper'
import { PaperAttribute } from './value'
import {
  WritableFields,
  ExcludeFunctionFields,
  RemoveNullableFromFields,
  Merge
} from 'tempo-std/lib/types/objects'
import { Props } from './value'
import { ItemEvents, createItem } from './item'
import { PaperTemplate } from './template'

type WritableLayer = ExcludeFunctionFields<
  RemoveNullableFromFields<WritableFields<Layer>>
>

type WritableLayerOptionKeys = keyof WritableLayer

type WritableLayerProps<State> = {
  [K in WritableLayerOptionKeys]?: PaperAttribute<State, WritableLayer[K]>
}

type LayerProps<State, Action, Query, T> = Partial<
  Merge<
    { args?: {} },
    Merge<
      Merge<WritableLayerProps<State>, Props<State, Action, Query, Layer, T>>,
      ItemEvents<State, Action, Layer>
    >
  >
>

export function layer<State, Action, Query = unknown, T = unknown>(
  props: LayerProps<State, Action, Query, T>,
  ...children: PaperTemplate<State, Action, Query>[]
) {
  return createItem<
    State,
    Action,
    Query,
    Layer,
    T,
    LayerProps<State, Action, Query, T>
  >(
    (_: State) =>
      typeof props.args !== 'undefined' ? new Layer(props.args) : new Layer([]),
    props,
    children
  )
}
