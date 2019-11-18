/*
Copyright 2018 Google LLC
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
import { DOMText } from '../src/text'
import { DynamicView } from '@tempo/core/lib/view'

describe('dom_text', () => {
  it('create static undefined', () => {
    const ctx = createContext()
    const nodeUndefined = new DOMText(undefined as any).render(ctx, 1)
    expect(ctx.doc.body.innerHTML).toEqual('')
    nodeUndefined.destroy()
    expect(ctx.doc.body.innerHTML).toEqual('')
  })

  it('create static with literal value', () => {
    const ctx = createContext()
    const node = new DOMText('abc').render(ctx, 1)
    expect(ctx.doc.body.innerHTML).toEqual('abc')
    node.destroy()
    expect(ctx.doc.body.innerHTML).toEqual('')
  })

  it('create static with function value', () => {
    const ctx = createContext()
    const node = new DOMText((r: string) => r).render(ctx, 'abc') as DynamicView<string | undefined>
    expect(ctx.doc.body.innerHTML).toEqual('abc')
    node.change('abc')
    expect(ctx.doc.body.innerHTML).toEqual('abc')
    node.change(undefined)
    expect(ctx.doc.body.innerHTML).toEqual('')
    node.change('xyz')
    expect(ctx.doc.body.innerHTML).toEqual('xyz')
    node.destroy()
    expect(ctx.doc.body.innerHTML).toEqual('')
    const t = new DOMText((r: string) => r)
    t.render(ctx, undefined as any)
    expect(ctx.doc.body.innerHTML).toEqual('')
  })
})
