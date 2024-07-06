/**
 * @jsxImportSource ../src
 */

import { render, If, Prop } from '../src'

describe('If', () => {
  afterEach(() => {
    document.body.innerHTML = ''
    document.head.innerHTML = ''
  })

  test('when true/false', () => {
    const prop = Prop.of(true)
    const view = <If is={prop} then={<div>foo</div>} otherwise={<span>bar</span>} />
    render(view, document.body)
    expect(document.body.innerHTML).toBe('<div>foo</div>')
    prop.set(false)
    expect(document.body.innerHTML).toBe('<span>bar</span>')
  })

  test('without false', () => {
    const prop = Prop.of(true)
    const view = <If is={prop} then={<div>foo</div>} />
    render(view, document.body)
    expect(document.body.innerHTML).toBe('<div>foo</div>')
    prop.set(false)
    expect(document.body.innerHTML).toBe('')
  })
})
