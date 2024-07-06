/**
 * @jsxImportSource ../src
 */

import { render, Prop, InnerHTML, When } from '../src'

describe('InnerHTML', () => {
  afterEach(() => {
    document.body.innerHTML = ''
    document.head.innerHTML = ''
  })

  test('set', () => {
    const prop = Prop.of("<b>foo</b>")
    const view = <div><InnerHTML html={prop} /></div>
    render(view, document.body)
    expect(document.body.innerHTML).toBe('<div><b>foo</b></div>')
    prop.set("<i>bar</i>")
    expect(document.body.innerHTML).toBe('<div><i>bar</i></div>')
  })

  test('restore', () => {
    const cond = Prop.of(true)
    const prop = Prop.of("foo")
    document.body.textContent = "default"
    const view = <When is={cond}><InnerHTML html={prop} /></When>
    render(view, document.body)
    expect(document.body.innerHTML).toBe('foo')
    prop.set("bar")
    expect(document.body.innerHTML).toBe('bar')
    cond.set(false)
    expect(document.body.innerHTML).toBe('default')
  })

  test('set nullable', () => {
    const prop = Prop.of(undefined as string | undefined)
    const view = <div><InnerHTML html={prop} /></div>
    render(view, document.body)
    expect(document.body.innerHTML).toBe('<div></div>')
    prop.set("bar")
    expect(document.body.innerHTML).toBe('<div>bar</div>')
    prop.set(undefined)
    expect(document.body.innerHTML).toBe('<div></div>')
  })
})
