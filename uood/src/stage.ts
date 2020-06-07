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

import {
  ElProperties,
  ElBlockProperties,
  ElLifecycleProperties,
  ElContainerProperties,
  container
} from 'tempo-ui/lib/ui'
import { Theme } from './theme'
import { Uood } from './uood'
import { DOMChild } from 'tempo-dom/lib/template'
import { Size } from 'tempo-ui/lib/ui_attributes'

export function stage<State, Action, Query = unknown, T = unknown>(
  props: {
    theme?: Theme<State>
  } & ElProperties &
    ElBlockProperties<State> &
    ElLifecycleProperties<State, Action, Query, T> &
    ElContainerProperties<State>,
  ...children: DOMChild<State, Action, Query>[]
) {
  const stage = props.theme?.stage
  const dStage = Uood.theme?.stage
  return container<State, Action, Query, T>(
    {
      elementName: 'div',
      orientation: props.orientation ?? 'col',
      alignament: props.alignament ?? 'center',
      distribution: props.distribution ?? 'center',
      padding: stage?.padding ?? dStage?.padding,
      width: stage?.width ?? dStage?.width ?? Size.fill(1),
      height: stage?.height ?? dStage?.height ?? Size.fill(1),
      borderRadius: stage?.borderRadius ?? dStage?.borderRadius,
      background: stage?.background ?? dStage?.background,
      spacing: stage?.spacing ?? dStage?.spacing,
      border: stage?.border ?? dStage?.border,
      shadow: stage?.shadow ?? dStage?.shadow
    },
    ...children
  )
}
