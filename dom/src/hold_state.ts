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

import { DOMTemplate, DOMChild } from './template'
import { DOMContext } from './context'
import { map as mapA, each } from 'tempo-std/lib/arrays'
import { domChildToTemplate } from './utils/dom'

// TODO candidate to be converted to Attribute
export function holdMappedState<State, HeldState>(props: {
  map: (s: State) => HeldState
}) {
  let counter = 0
  const stateCache = new Map<number, HeldState>()
  const capture = <Action, Query>(
    ...children: DOMChild<State, Action, Query>[]
  ): DOMTemplate<State, Action, Query> => {
    const childTemplates = mapA(children, domChildToTemplate)
    return {
      render(ctx: DOMContext<Action>, state: State) {
        const views = mapA(childTemplates, t => t.render(ctx, state))
        const id = ++counter
        return {
          change(state: State) {
            stateCache.set(id, props.map(state))
            each(views, v => v.change(state))
          },
          destroy() {
            stateCache.delete(id)
            each(views, v => v.destroy())
          },
          request(query: Query) {
            each(views, v => v.request(query))
          }
        }
      }
    }
  }

  const release = <InnerState, InnerAction, InnerQuery>(
    ...children: DOMChild<[HeldState, InnerState], InnerAction, InnerQuery>[]
  ): DOMTemplate<InnerState, InnerAction, InnerQuery> => {
    const childTemplates = mapA(children, domChildToTemplate)
    return {
      render(ctx: DOMContext<InnerAction>, state: InnerState) {
        const id = counter // TODO this is not a very robust solution
        const heldState = stateCache.get(id)
        if (typeof heldState === 'undefined')
          throw 'held state is not available at render, make sure that your `release` template is nested inside `capture`.'
        const combinedState = [heldState, state] as [HeldState, InnerState]
        const views = mapA(childTemplates, t => t.render(ctx, combinedState))
        return {
          change(state: InnerState) {
            const heldState = stateCache.get(id)
            if (typeof heldState === 'undefined')
              throw 'held state is not available at change, make sure that your `release` template is nested inside `capture`.'
            const combinedState = [heldState, state] as [HeldState, InnerState]
            each(views, v => v.change(combinedState))
          },
          destroy() {
            each(views, v => v.destroy())
          },
          request(query: InnerQuery) {
            each(views, v => v.request(query))
          }
        }
      }
    }
  }

  return { capture, release }
}

export function holdState<State>() {
  return holdMappedState<State, State>({ map: a => a })
}
