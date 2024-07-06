/**
 * @jsxImportSource ../src
 */

import { render, Show, Prop, Signal } from '../src'

describe('Show', () => {
  afterEach(() => {
    document.body.innerHTML = ''
    document.head.innerHTML = ''
  })

  test('when null or not null', () => {
    const prop = Prop.of(null as null | number)
    const view = <Show when={prop}>{(p: Signal<number>) => <div>{p}</div>}</Show>
    const clear = render(view, document.body)
    expect(document.body.innerHTML).toBe('')
    prop.set(1)
    expect(document.body.innerHTML).toBe('<div>1</div>')
    prop.set(2)
    expect(document.body.innerHTML).toBe('<div>2</div>')
    prop.set(null)
    expect(document.body.innerHTML).toBe('')
    prop.set(3)
    expect(document.body.innerHTML).toBe('<div>3</div>')
    clear()
    expect(document.body.innerHTML).toBe('')
  })
})
