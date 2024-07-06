/**
 * @jsxImportSource ../src
 */

import { match } from 'assert'
import { render, Prop, OneOf, Signal, OneOfLiteral, OneOfUnion, OneOfUnionType, OneOfUnionKind } from '../src'

interface Some<T> {
  type: 'Some'
  value: T
}

interface None {
  type: 'None'
}

type Option<T> = Some<T> | None

function some<T>(value: T): Some<T> {
  return { type: 'Some', value }
}

function none<T>(): None {
  return { type: 'None' }
}

interface Some2<T> {
  kind: 'Some'
  value: T
}

interface None2 {
  kind: 'None'
}

type Option2<T> = Some2<T> | None2

function some2<T>(value: T): Some2<T> {
  return { kind: 'Some', value }
}

function none2<T>(): None2 {
  return { kind: 'None' }
}

type OptionTag = "Some" | "None"

describe('OneOf', () => {
  afterEach(() => {
    document.body.innerHTML = ''
    document.head.innerHTML = ''
  })

  test('should work with union types mapped', () => {
    const maybe = Prop.of<Option<number>>(none())
    const view = <OneOf
      match={maybe.map(v => {
        switch (v.type) {
          case 'Some':
            return { some: v.value }
          case 'None':
            return { none: undefined }
        }
      })
      }
      some={(value: Signal<number>) => <div>{value}</div>}
      none={() => <span>none</span>}
    />
    const clear = render(view, document.body)
    expect(document.body.innerHTML).toBe('<span>none</span>')
    maybe.set(some(1))
    expect(document.body.innerHTML).toBe('<div>1</div>')
    maybe.set(some(2))
    expect(document.body.innerHTML).toBe('<div>2</div>')
    maybe.set(none())
    expect(document.body.innerHTML).toBe('<span>none</span>')
    clear()
    expect(document.body.innerHTML).toBe('')
  })

  test('should work with union type', () => {
    const maybe = Prop.of<Option<number>>(none())
    const view = <OneOfUnionType
      match={maybe}
      Some={(value: Signal<Some<number>>) => <div>{value.at('value')}</div>}
      None={() => <span>none</span>}
    />
    const clear = render(view, document.body)
    expect(document.body.innerHTML).toBe('<span>none</span>')
    maybe.set(some(1))
    expect(document.body.innerHTML).toBe('<div>1</div>')
    maybe.set(some(2))
    expect(document.body.innerHTML).toBe('<div>2</div>')
    maybe.set(none())
    expect(document.body.innerHTML).toBe('<span>none</span>')
    clear()
    expect(document.body.innerHTML).toBe('')
  })

  test('should work with union kind', () => {
    const maybe = Prop.of<Option2<number>>(none2())
    const view = <OneOfUnionKind
      match={maybe}
      Some={(value: Signal<Some2<number>>) => <div>{value.at('value')}</div>}
      None={() => <span>none</span>}
    />
    const clear = render(view, document.body)
    expect(document.body.innerHTML).toBe('<span>none</span>')
    maybe.set(some2(1))
    expect(document.body.innerHTML).toBe('<div>1</div>')
    maybe.set(some2(2))
    expect(document.body.innerHTML).toBe('<div>2</div>')
    maybe.set(none2())
    expect(document.body.innerHTML).toBe('<span>none</span>')
    clear()
    expect(document.body.innerHTML).toBe('')
  })

  test('should work with type literals', () => {
    const maybe = Prop.of<OptionTag>("None")
    const view = <OneOfLiteral
      match={maybe}
      Some={<div>some</div>}
      None={<span>none</span>}
    />
    const clear = render(view, document.body)
    expect(document.body.innerHTML).toBe('<span>none</span>')
    maybe.set("Some")
    expect(document.body.innerHTML).toBe('<div>some</div>')
    maybe.set("None")
    expect(document.body.innerHTML).toBe('<span>none</span>')
    clear()
    expect(document.body.innerHTML).toBe('')
  })
})
