import { beforeEach, describe, expect, test, vi } from "vitest";
import { prop, render, html, WithElement, OneOf, OneOfType, OneOfValue, OneOfTuple, OneOfField, OneOfKind } from "../src";
import { sleep } from "./helper";
const { div } = html

export interface A {
  type: 'A'
  text: string
}

export interface B {
  type: 'B'
  num: number
}

export type Letter = A | B

describe("OneOf", () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })
  test("type", async () => {
    const p = prop<Letter>({ type: "A", text: "a" });
    const spyMountA = vi.fn()
    const spyMountB = vi.fn()
    render(
      OneOfType(
        p,
        {
          'A': (s) => div(
            WithElement(spyMountA),
            s.at('text')
          ),
          'B': (s) => div(
            WithElement(spyMountB),
            'num:', s.at('num').map(String)
          )
        }
      ),
      document.body
    );
    expect(spyMountA).toBeCalledTimes(1)
    expect(spyMountB).toBeCalledTimes(0)
    expect(document.body.innerHTML).toStrictEqual('<div>a</div>');
    p.set({ type: "A", text: "b" })
    await sleep()
    expect(spyMountA).toBeCalledTimes(1)
    expect(spyMountB).toBeCalledTimes(0)
    p.set({ type: "B", num: 1 })
    await sleep()
    expect(spyMountA).toBeCalledTimes(1)
    expect(spyMountB).toBeCalledTimes(1)
    expect(document.body.innerHTML).toStrictEqual('<div>num:1</div>');
    p.set({ type: "B", num: 2 })
    await sleep()
    expect(spyMountA).toBeCalledTimes(1)
    expect(spyMountB).toBeCalledTimes(1)
    expect(document.body.innerHTML).toStrictEqual('<div>num:2</div>');
    p.set({ type: "A", text: "c" })
    await sleep()
    expect(spyMountA).toBeCalledTimes(2)
    expect(spyMountB).toBeCalledTimes(1)
    expect(document.body.innerHTML).toStrictEqual('<div>c</div>');
  });

  test("value", async () => {
    const mode = prop<'view' | 'edit'>('view')
    render(
      OneOfValue(mode, {
        view: () => div('Viewing'),
        edit: () => div('Editing')
      }),
      document.body
    )
    expect(document.body.innerHTML).toStrictEqual('<div>Viewing</div>')
    mode.set('edit')
    await sleep()
    expect(document.body.innerHTML).toStrictEqual('<div>Editing</div>')
  })

  test("tuple", async () => {
    const pair = prop(['A', 1] as ['A' | 'B', number])
    render(
      OneOfTuple(pair, {
        A: n => div('A:', n.map(String)),
        B: n => div('B:', n.map(String))
      }),
      document.body
    )
    expect(document.body.innerHTML).toStrictEqual('<div>A:1</div>')
    pair.set(['B', 2])
    await sleep()
    expect(document.body.innerHTML).toStrictEqual('<div>B:2</div>')
  })

  test("field", async () => {
    type State =
      | { state: 'loading' }
      | { state: 'error', message: string }
      | { state: 'ready', content: string }
    const state = prop<State>({ state: 'loading' })
    render(
      OneOfField(state, 'state', {
        loading: () => div('Loading...'),
        error: s => div('Error:', s.$.message),
        ready: s => div('Ready:', s.$.content)
      }),
      document.body
    )
    expect(document.body.innerHTML).toStrictEqual('<div>Loading...</div>')
    state.set({ state: 'ready', content: 'Ok' })
    await sleep()
    expect(document.body.innerHTML).toStrictEqual('<div>Ready:Ok</div>')
    state.set({ state: 'error', message: 'Oops' })
    await sleep()
    expect(document.body.innerHTML).toStrictEqual('<div>Error:Oops</div>')
  })

  test("kind", async () => {
    type MyType = { kind: 'A', text: string } | { kind: 'B', value: number }
    const value = prop<MyType>({ kind: 'A', text: 'Hello, World!' })
    render(
      OneOfKind(value, {
        A: v => div('A:', v.$.text),
        B: v => div('B:', v.$.value.map(String))
      }),
      document.body
    )
    expect(document.body.innerHTML).toStrictEqual('<div>A:Hello, World!</div>')
    value.set({ kind: 'B', value: 5 })
    await sleep()
    expect(document.body.innerHTML).toStrictEqual('<div>B:5</div>')
  })

  test("oneof", async () => {
    type Status = { loading: true } | { error: string }
    const status = prop<Status>({ loading: true })
    render(
      OneOf<Status>(status, {
        loading: () => div('Loading...'),
        error: e => div('Error:', e)
      }),
      document.body
    )
    expect(document.body.innerHTML).toStrictEqual('<div>Loading...</div>')
    status.set({ error: 'Oops' })
    await sleep()
    expect(document.body.innerHTML).toStrictEqual('<div>Error:Oops</div>')
  })
});
