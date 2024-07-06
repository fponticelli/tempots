/**
 * @jsxImportSource ../src
 */

import { render, When, Unless, Prop } from '../src'

describe('When', () => {
  afterEach(() => {
    document.body.innerHTML = ''
    document.head.innerHTML = ''
  })

  test('when true/false', () => {
    const prop = Prop.of(true)
    const view = <When is={prop}><div>foo</div></When>
    render(view, document.body)
    expect(document.body.innerHTML).toBe('<div>foo</div>')
    prop.set(false)
    expect(document.body.innerHTML).toBe('')
  })

  test('unless true/false', () => {
    const prop = Prop.of(false)
    const view = <Unless is={prop}><div>foo</div></Unless>
    render(view, document.body)
    expect(document.body.innerHTML).toBe('<div>foo</div>')
    prop.set(true)
    expect(document.body.innerHTML).toBe('')
  })
})
