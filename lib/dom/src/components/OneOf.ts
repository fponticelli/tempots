import { Prop, Signal } from "../prop";
import { Clear } from "../types/clean";
import { IDOMContext } from "../types/idom-context";
import { Renderable } from "../types/renderable";
import { JSX } from "../jsx";
import { makeRenderable } from "../jsx-runtime";

export type AnyKey = string | number | symbol
export class OneOfImpl<T extends [AnyKey, unknown]> implements Renderable {
  constructor(
    private match: Signal<T>,
    private cases: {
      [KK in T[0]]: (value: Signal<T[1]>) => JSX.DOMNode
    }) { }

  readonly appendTo = (ctx: IDOMContext): Clear => {
    const pair: [T[0], T[1]] = this.match.get()
    let key = pair[0]
    const value = pair[1]
    const prop = new Prop(value)
    let newCtx = ctx.makeReference()
    let clear = makeRenderable(this.cases[key](prop)).appendTo(newCtx)
    const cancel = this.match.subscribe(([newKey, newValue]) => {
      if (newKey !== key) {
        newCtx.requestClear(true, () => {
          clear(true)
          newCtx = newCtx.makeReference()
          key = newKey
          prop.set(newValue)
          clear = makeRenderable(this.cases[key](prop)).appendTo(newCtx)
        })
      } else {
        prop.set(newValue)
      }
    })
    return (removeTree: boolean) => {
      newCtx.requestClear(removeTree, () => {
        console.log('clearing')
        cancel()
        prop.clean()
      })
    }
  }
}

export type OneOfProps<T extends [AnyKey, unknown]> = {
  match: Signal<T>
} & {
    [KK in T[0]]: (value: Signal<T[1]>) => JSX.DOMNode
  }

// <OneOf match={counter.map(v => v % 2 == 0 ? [1, "odd"] : [2, "even"])} 1={t => <b>{t}</b>} 2={t => <i>{t}</i>} /
export function OneOf<T extends [AnyKey, unknown]>(props: OneOfProps<T>): JSX.DOMNode {
  return new OneOfImpl(props.match, props)
}
