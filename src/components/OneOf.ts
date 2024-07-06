import { Prop, type Signal } from '../prop'
import { type Clear } from '../clean'
import { type DOMContext } from '../dom-context'
import { type Renderable } from '../renderable'
import { type JSX } from '../jsx'
import { makeRenderable } from '../jsx-runtime'

export class OneOfImpl<T extends Record<string, unknown>> implements Renderable {
  constructor (
    private readonly match: Signal<T>,
    private readonly cases: {
      [KK in keyof T]: (value: Signal<T[KK]>) => JSX.DOMNode
    }) { }

  readonly appendTo = (ctx: DOMContext): Clear => {
    const pair = this.match.get()
    let key = Object.keys(pair)[0] as keyof T
    const value = pair[key]
    let prop = new Prop(value)
    let newCtx = ctx.makeReference()
    let clear = makeRenderable(this.cases[key](prop)).appendTo(newCtx)
    const cancel = this.match.subscribe((newPair) => {
      const newKey = Object.keys(newPair)[0] as keyof T
      const newValue = newPair[newKey]
      if (newKey !== key) {
        newCtx.requestClear(true, () => {
          newCtx = newCtx.makeReference()
          key = newKey
          prop.clean()
          prop = new Prop(newValue)
          clear(true)
          clear = makeRenderable(this.cases[key](prop)).appendTo(newCtx)
        })
      } else {
        prop.set(newValue)
      }
    })
    return (removeTree: boolean) => {
      newCtx.requestClear(removeTree, () => {
        clear(removeTree)
        cancel()
        prop.clean()
      })
    }
  }
}

export type OneOfProps<T extends Record<string, unknown>> = {
  match: Signal<T>
} & {
  [KK in keyof T]: (value: Signal<T[KK]>) => JSX.DOMNode
}

// <OneOf match={counter.map(v => v % 2 == 0 ? {1: "odd"} : {2: "even"})} 1={t => <b>{t}</b>} 2={t => <i>{t}</i>} /
export function OneOf<T extends Record<string, unknown>> (props: OneOfProps<T>): JSX.DOMNode {
  return new OneOfImpl(props.match, props)
}

export type OneOfLiteralProps<K extends string> = {
  match: Signal<K>
} & {
  [KK in K]: JSX.DOMNode
}

export function OneOfLiteral<K extends string> (props: OneOfLiteralProps<K>): JSX.DOMNode {
  const { match, ...cases } = props
  const keys = Object.keys(cases) as K[]
  const obj = keys.reduce<Record<K, (value: Signal<unknown>) => JSX.DOMNode>>((
    acc: Record<K, (value: Signal<unknown>) => JSX.DOMNode>,
    k: K) => {
    acc[k] = () => cases[k]
    return acc
  // eslint-disable-next-line @typescript-eslint/prefer-reduce-type-parameter, @typescript-eslint/consistent-type-assertions
  }, {} as Record<K, (value: Signal<unknown>) => JSX.DOMNode>)
  return new OneOfImpl(
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    match.map(k => ({ [k]: null } as Record<K, unknown>)),
    obj
  )
}

export type OneOfUnionProps<T extends { [_ in K]: string }, K extends string> = {
  match: Signal<T>
  using: K
} & {
  [KK in T[K]]: (value: Signal<T extends { [_ in K]: KK } ? T : never>) => JSX.DOMNode
}

export function OneOfUnion<T extends { [_ in K]: string }, K extends string> (props: OneOfUnionProps<T, K>): JSX.DOMNode {
  const { match, using, ...cases } = props
  return new OneOfImpl(
    match.map(t => ({ [t != null ? t[using] : '']: t })),
    cases as any
  )
}

export type OneOfUnionTypeProps<T extends { [_ in 'type']: string }> = {
  match: Signal<T>
} & {
  [KK in T['type']]: (value: Signal<T extends { [_ in 'type']: KK } ? T : never>) => JSX.DOMNode
}

export function OneOfUnionType<T extends { type: string }> (props: OneOfUnionTypeProps<T>): JSX.DOMNode {
  return OneOfUnion({ ...props, using: 'type' })
}

export type OneOfUnionKindProps<T extends { [_ in 'kind']: string }> = {
  match: Signal<T>
} & {
  [KK in T['kind']]: (value: Signal<T extends { [_ in 'kind']: KK } ? T : never>) => JSX.DOMNode
}
export function OneOfUnionKind<T extends { kind: string }> (props: OneOfUnionKindProps<T>): JSX.DOMNode {
  return OneOfUnion({ ...props, using: 'kind' })
}
