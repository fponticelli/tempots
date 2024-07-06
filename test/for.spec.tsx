/**
 * @jsxImportSource ../src
 */

import { render, PositionProps, Prop, For, Signal, conjuctions } from '../src'
import { ForWithPosition } from '../src/components/For'

describe('For', () => {
  afterEach(() => {
    document.body.innerHTML = ''
    document.head.innerHTML = ''
  })

  test('without separator', () => {
    const prop = Prop.of([1, 2, 3])
    const view = <For of={prop}>{(v: Signal<number>) => v}</For>
    const clear = render(view, document.body)
    expect(document.body.innerHTML).toBe('123')
    prop.set([4, 5])
    expect(document.body.innerHTML).toBe('45')
    prop.set([])
    expect(document.body.innerHTML).toBe('')
    prop.set([9, 8, 7, 6, 5, 4, 3, 2, 1])
    expect(document.body.innerHTML).toBe('987654321')
    prop.set([])
    expect(document.body.innerHTML).toBe('')
  })

  test('with separator', () => {
    const prop = Prop.of([1, 2, 3])
    const view = <For
      of={prop}
      separator={conjuctions(',', '!', ':')}
    >{(v: Signal<number>) => v}</For>
    const clear = render(view, document.body)
    expect(document.body.innerHTML).toBe('1:2!3')
    prop.set([4, 5])
    expect(document.body.innerHTML).toBe('4!5')
    prop.set([6])
    expect(document.body.innerHTML).toBe('6')
    prop.set([])
    expect(document.body.innerHTML).toBe('')
    prop.set([9, 8, 7, 6, 5, 4, 3, 2, 1])
    expect(document.body.innerHTML).toBe('9:8,7,6,5,4,3,2!1')
    prop.set([])
    expect(document.body.innerHTML).toBe('')
  })

  test('with separator (dom element)', () => {
    const prop = Prop.of([1, 2, 3])
    const view = <For
      of={prop}
      separator={() => (<hr />)}
    >{(v: Signal<number>) => v}</For>
    const clear = render(view, document.body)
    expect(document.body.innerHTML).toBe('1<hr>2<hr>3')
    prop.set([4, 5])
    expect(document.body.innerHTML).toBe('4<hr>5')
    prop.set([6])
    expect(document.body.innerHTML).toBe('6')
    prop.set([])
    expect(document.body.innerHTML).toBe('')
  })

  test('without separator check position', () => {
    const prop = Prop.of([1, 2, 3])
    const view = <ForWithPosition
      of={prop}
    >{(v: Signal<{ value: number, pos: PositionProps}>) => v.map(({ value, pos: { index, first, last }}) => {
      return `${value}${index}${first}${last}`
    })}</ForWithPosition>
    const clear = render(view, document.body)
    expect(document.body.innerHTML).toBe('10truefalse21falsefalse32falsetrue')
    prop.set([4, 5])
    expect(document.body.innerHTML).toBe('40truefalse51falsetrue')
    prop.set([6])
    expect(document.body.innerHTML).toBe('60truetrue')
    prop.set([])
    expect(document.body.innerHTML).toBe('')
    clear()
    expect(document.body.innerHTML).toBe('')
  })

  test('with separator check position', () => {
    const prop = Prop.of([1, 2, 3])
    const view = <ForWithPosition
      of={prop}
      separator={() => (<hr />)}
    >{(v: Signal<{ value: number, pos: PositionProps}>) => v.map(({ value, pos: { index, first, last }}) => {
      return `${value}${index}${first}${last}`
    })}</ForWithPosition>
    const clear = render(view, document.body)
    expect(document.body.innerHTML).toBe('10truefalse<hr>21falsefalse<hr>32falsetrue')
    prop.set([4, 5])
    expect(document.body.innerHTML).toBe('40truefalse<hr>51falsetrue')
    prop.set([6])
    expect(document.body.innerHTML).toBe('60truetrue')
    prop.set([])
    expect(document.body.innerHTML).toBe('')
    prop.set([])
    expect(document.body.innerHTML).toBe('')
  })

  test('with separator (dom element with conjunctions)', () => {
    const prop = Prop.of([1, 2, 3])
    const view = <For
      of={prop}
      separator={conjuctions(<hr />)}
    >{(v: Signal<number>) => v}</For>
    const clear = render(view, document.body)
    expect(document.body.innerHTML).toBe('1<hr>2<hr>3')
    prop.set([4, 5])
    expect(document.body.innerHTML).toBe('4<hr>5')
    prop.set([6])
    expect(document.body.innerHTML).toBe('6')
    prop.set([])
    expect(document.body.innerHTML).toBe('')
    prop.set([])
    expect(document.body.innerHTML).toBe('')
  })
})
