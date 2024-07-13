import { DOMContext } from '../dom/dom-context'
import { removeDOMNode } from '../dom/dom-utils'
import { Computed, Signal } from '../std/signal'
import { Renderable, Clear, TNode } from '../types/domain'
import { childToRenderable } from './element'

const oneOfRenderable =
  <T extends Record<string, unknown>>(
    match: Signal<T>,
    cases: { [KK in keyof T]: (value: Signal<T[KK]>) => TNode }
  ): Renderable =>
  (ctx: DOMContext) => {
    ctx = ctx.makeRef()
    let clearRenderable: Clear | undefined
    let matched: Computed<T[keyof T]> | undefined
    const keySignal = match.map(value => {
      return Object.keys(value)[0] as keyof T // the object only has one field
    })
    let currentKey: keyof T | undefined
    const clearSignal = keySignal.on(newKey => {
      if (newKey !== currentKey) {
        matched?.dispose()
        clearRenderable?.(true)
        matched = match.map(value => value[newKey])

        const child = cases[newKey](matched)
        clearRenderable = childToRenderable(child)(ctx)
        currentKey = newKey
      }
    })
    return (removeTree: boolean) => {
      clearSignal()
      if (removeTree && ctx.reference != null) {
        removeDOMNode(ctx.reference)
      }
      clearRenderable?.(true)
    }
  }

export const oneof = {
  bool: (
    match: Signal<boolean>,
    cases: { true: () => TNode; false: () => TNode }
  ) =>
    oneOfRenderable(
      match.map(v => (v ? { true: true } : { false: true })),
      cases
    ),
  field: <T extends { [_ in K]: string }, K extends string>(
    match: Signal<T>,
    field: K,
    cases: {
      [KK in T[K]]: (
        value: Signal<T extends { [_ in K]: KK } ? T : never>
      ) => TNode
    }
  ) =>
    oneOfRenderable(
      match.map(v => ({ [v[field]]: v })),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cases as any
    ),
  kind: <T extends { kind: string }>(
    match: Signal<T>,
    cases: {
      [KK in T['kind']]: (
        value: Signal<T extends { kind: KK } ? T : never>
      ) => TNode
    }
  ) => oneof.field(match, 'kind', cases),
  tuple: <T extends string, V>(
    match: Signal<[T, V]>,
    cases: {
      [KK in T]: (value: Signal<V>) => TNode
    }
  ) => {
    const matchRecord = match.map(([key, value]) => ({ [key]: value }))
    return oneOfRenderable(matchRecord, cases)
  },
  type: <T extends { type: string }>(
    match: Signal<T>,
    cases: {
      [KK in T['type']]: (
        value: Signal<T extends { type: KK } ? T : never>
      ) => TNode
    }
  ) => oneof.field(match, 'type', cases),
  value: <T extends symbol | number | string>(
    match: Signal<T>,
    cases: { [KK in T]: () => TNode }
  ) =>
    oneOfRenderable(
      match.map(v => ({ [v]: true })),
      cases
    ),
}
