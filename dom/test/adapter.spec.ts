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

import { createContext } from './common'
import { div } from '../src/html'
import { adapter, PropagateArg } from '../src/adapter'
import { component } from '../src/component'
import { Store } from 'tempo-store/lib/store'

describe('adapter', () => {
  it('noOptions', () => {
    type InnerState = { inner: map; outer: map }

    const ctx = createContext(() => {})
    const store = Store.ofState({
      state: { inner: 'in', outer: 'out' },
      reducer: (state: InnerState) => {
        return state
      }
    })

    const template = adapter(
      {},
      component(
        { store },
        'inner: ',
        s => s.inner,
        ', outer: ',
        s => s.outer
      )
    )
    const view = template.render(ctx, { outer: 'out' })
    expect(ctx.doc.body.innerHTML).toEqual('inner: in, outer: out')
    view.change({ outer: 'OUT' })
    expect(ctx.doc.body.innerHTML).toEqual('inner: in, outer: out')
    view.destroy()
    expect(ctx.doc.body.innerHTML).toEqual('')
  })

  it('mergeStates', () => {
    type OuterState = { outer: map }
    type InnerState = { inner: map; outer: map }

    const ctx = createContext(() => {})
    const store = Store.ofState({
      state: { inner: 'in', outer: '' },
      reducer: (state: InnerState) => {
        return state
      }
    })
    const template = adapter(
      {
        mergeStates: ({
          outerState,
          innerState
        }: {
          outerState: OuterState
          innerState: InnerState
        }) => {
          return { ...outerState, inner: innerState.inner }
        }
      },
      component(
        { store },
        'inner: ',
        s => s.inner,
        ', outer: ',
        s => s.outer
      )
    )
    const view = template.render(ctx, { outer: 'out' })
    expect(ctx.doc.body.innerHTML).toEqual('inner: in, outer: out')
    view.change({ outer: 'OUT' })
    expect(ctx.doc.body.innerHTML).toEqual('inner: in, outer: OUT')
  })

  // TODO this test is almost impossible to follow and understand
  it('propagate', () => {
    const state = ['inner-state'] as map[]
    const store = Store.ofState<map[], map>({
      state,
      reducer: (s, a) => {
        if (a === 'inner-action') {
          didCallInnerDispatcher = true
          return s.concat([a])
        } else {
          return s.concat([a])
        }
      }
    })

    const comp = component(
      { store },
      div<map[], map>(
        { events: { click: (_s: map[], _: MouseEvent) => 'click' } },
        s => s.join(', ')
      )
    )

    let didCallPropagate = false
    let didCallOuterDispatcher = false
    let didCallInnerDispatcher = false

    const propagate = (args: PropagateArg<map, map[], map, map>) => {
      // dispatch it only once
      if (args.action === 'click') {
        didCallPropagate = true
        expect(args.innerState).toEqual(['inner-state', 'outer-state', 'click'])
        args.dispatchInner('inner-action')
      } else if (args.action === 'inner-action') {
        args.dispatchOuter('outer-action')
        expect(args.innerState).toEqual([
          'inner-state',
          'outer-state',
          'click',
          'inner-action'
        ])
        expect(args.outerState).toBe('outer-state')
      }
    }

    const mergeStates = ({
      outerState,
      innerState
    }: {
      outerState: map
      innerState: map[]
    }) => innerState.concat([outerState])

    const adapt = adapter({ propagate, mergeStates }, comp)

    const ctx = createContext((a: map) => {
      expect(a).toBe('outer-action')
      didCallOuterDispatcher = true
    })

    adapt.render(ctx, 'outer-state')

    expect(ctx.doc.body.innerHTML).toEqual(
      '<div>inner-state, outer-state</div>'
    )

    const el = ctx.doc.body.firstElementChild as HTMLDivElement
    el.click()
    expect(didCallPropagate).toBeTruthy()
    expect(didCallOuterDispatcher).toBeTruthy()
    expect(didCallInnerDispatcher).toBeTruthy()
    expect(ctx.doc.body.innerHTML).toEqual(
      '<div>inner-state, outer-state, click, inner-action</div>'
    )
  })
})
