/**
 * @jsxImportSource ../src
 */

import { render, If, Prop, TextContent, When } from '../src'

describe('TextContent', () => {
  afterEach(() => {
    document.body.innerHTML = ''
    document.head.innerHTML = ''
  })

  test('set', () => {
    const prop = Prop.of("foo")
    const view = <div><TextContent value={prop} /></div>
    render(view, document.body)
    expect(document.body.innerHTML).toBe('<div>foo</div>')
    prop.set("bar")
    expect(document.body.innerHTML).toBe('<div>bar</div>')
  })

  test('restore', () => {
    const cond = Prop.of(true)
    const prop = Prop.of("foo")
    document.body.textContent = "default"
    const view = <When is={cond}><TextContent value={prop} /></When>
    render(view, document.body)
    expect(document.body.innerHTML).toBe('foo')
    prop.set("bar")
    expect(document.body.innerHTML).toBe('bar')
    cond.set(false)
    expect(document.body.innerHTML).toBe('default')
  })

  test('set nullable', () => {
    const prop = Prop.of(undefined as string | undefined)
    const view = <div><TextContent value={prop} /></div>
    render(view, document.body)
    expect(document.body.innerHTML).toBe('<div></div>')
    prop.set("bar")
    expect(document.body.innerHTML).toBe('<div>bar</div>')
    prop.set(undefined)
    expect(document.body.innerHTML).toBe('<div></div>')
  })
})
