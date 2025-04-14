import type { TNode, Clear, Renderable } from '../types/domain'
import { DOMContext } from '../dom/dom-context'
import { Prop, Signal, prop, signal } from '../std/signal'
import { renderableOfTNode } from './element'
import { Empty } from './empty'
import { Value } from '../std/value'

export type NillifyValue<T> =
  | Value<T | null | undefined>
  | Value<T | undefined>
  | Value<T | null>

export type Id<T> = {} & { [P in keyof T]: T[P] }
export type Merge<A, B> = Id<A & B>

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type NonNillable<T> = Merge<T, {}>

/**
 * Represents a function that ensures a signal has a value before rendering a TNode.
 *
 * @typeParam T - The type of the signal value.
 * @param value - The signal or literal that may hold a value of type T or null or undefined.
 * @param then - The function that returns a TNode when the signal has a value. It takes a signal of the non-nullable type of T.
 * @param otherwise - The function that returns a TNode when the signal does not have a value.
 * @returns A renderable function that ensures the signal has a value before rendering a TNode.
 * @public
 */
export const Ensure = <T>(
  value: NillifyValue<T>,
  then: (value: Signal<NonNillable<T>>) => TNode,
  otherwise?: () => TNode
): Renderable => {
  if (Signal.is(value as Value<T | null | undefined>)) {
    const signal = value as Signal<T | null | undefined>
    return (ctx: DOMContext) => {
      const newCtx = ctx.makeRef()
      let clear: Clear = () => {}
      let hadValue = false
      let feed: Prop<T> | null = null
      const clearSignal = signal.on(value => {
        if (value == null) {
          clear(true)
          clear = renderableOfTNode(otherwise?.() ?? Empty)(newCtx)
          hadValue = false
          feed?.dispose()
          feed = null
        } else {
          if (feed == null) {
            feed = prop<T>(value)
          } else {
            feed.value = value
          }
          if (!hadValue) {
            clear(true)
            clear = renderableOfTNode(then(feed as Signal<NonNillable<T>>))(
              newCtx
            )
            hadValue = true
          }
        }
      })
      return (removeTree: boolean) => {
        feed?.dispose()
        clearSignal()
        clear?.(removeTree)
        newCtx.clear(removeTree)
      }
    }
  } else {
    const literal = value as T | null | undefined
    if (literal == null) {
      const result = otherwise?.()
      if (result != null) {
        return renderableOfTNode(result)
      }
      return Empty
    }
    return renderableOfTNode(then(signal(literal)))
  }
}

/**
 * Ensures that all signals have a value before rendering a TNode.
 *
 * @param signals - The signals to ensure have a value.
 * @returns A renderable function that ensures all signals have a value before rendering a TNode.
 * @public
 */
export const EnsureAll =
  <
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    T extends readonly Value<any>[],
  >(
    ...signals: { [K in keyof T]: NillifyValue<T[K]> }
  ) =>
  (
    callback: (
      ...values: {
        [K in keyof T]: Signal<
          NonNillable<T[K] extends Value<infer U> ? U : never>
        >
      }
    ) => TNode,
    otherwise?: () => TNode
  ): Renderable => {
    return (ctx: DOMContext) => {
      const newCtx = ctx.makeRef()
      // if any of the values is a literal null or undefined, we can skip the signal logic and always use the otherwise function
      const hasNillLiterals = signals.some(
        signal => !Signal.is(signal) && signal == null
      )

      if (hasNillLiterals) {
        return (otherwise != null ? renderableOfTNode(otherwise?.()) : Empty)(
          newCtx
        )
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const feed: (null | Prop<any>)[] = signals.map(() => null)
      const feedValues: boolean[] = signals.map(v =>
        Signal.is(v) ? v.value != null : v != null
      )
      let clear: Clear | null = null
      const allHadValues = prop(feedValues.every(v => v))

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const makeOrAssignSignal = (signal: Signal<any>, index: number) => {
        if (signal.value != null) {
          if (feed[index] == null) {
            const newSignal = prop(signal.value)
            feed[index] = newSignal
          } else {
            feed[index].value = signal.value
          }
          feedValues[index] = true
        } else {
          feedValues[index] = false
        }
      }

      let counter = signals.length - 1
      const clearFeeds = signals.map((signal, index) => {
        if (!Signal.is(signal)) {
          const litSignal = prop(signal as NonNillable<T[number]>)
          feed[index] = litSignal
          return () => {}
        }

        return signal.on(() => {
          makeOrAssignSignal(signal, index)

          if (counter === 0) {
            allHadValues.value = feedValues.every(v => v)
          } else {
            counter--
          }
        })
      })

      allHadValues.on(allNonNullable => {
        clear?.(true)
        clear = null
        if (allNonNullable) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          clear = renderableOfTNode(callback(...(feed as any)))(newCtx)
        } else {
          clear = renderableOfTNode(otherwise?.() ?? Empty)(newCtx)
        }
      })

      return (removeTree: boolean) => {
        feed.forEach(f => f?.dispose())
        allHadValues.dispose()
        clearFeeds.forEach(fn => fn())
        clear?.(removeTree)
        newCtx.clear(removeTree)
      }
    }
  }
