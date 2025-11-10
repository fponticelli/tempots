import type { TNode, Clear, Renderable } from '../types/domain'
import { DOMContext } from '../dom/dom-context'
import { Prop, Signal, prop, signal } from '@tempots/core'
import { renderableOfTNode } from './element'
import { Empty } from './empty'
import { Value } from '@tempots/core'
import { handleValueOrSignal } from './utils'
import { domRenderable } from '../types/domain'

export type NillifyValue<T> =
  | Value<T | null | undefined>
  | Value<T | undefined>
  | Value<T | null>

export type Id<T> = {} & { [P in keyof T]: T[P] }
export type Merge<A, B> = Id<A & B>

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type NonNillable<T> = Merge<T, {}>

/**
 * Conditionally renders content based on whether a value is non-null/non-undefined.
 *
 * This function provides a type-safe way to handle nullable values in your UI. It only
 * renders the `then` content when the value is not null or undefined, and optionally
 * renders alternative content when the value is null/undefined.
 *
 * @example
 * ```typescript
 * // With a signal that might be null
 * const user = prop<User | null>(null)
 *
 * Ensure(user,
 *   (userSignal) => html.div('Welcome, ', userSignal.map(u => u.name)),
 *   () => html.div('Please log in')
 * )
 * ```
 *
 * @example
 * ```typescript
 * // With a literal value
 * const maybeData = getData() // returns string | null
 *
 * Ensure(maybeData,
 *   (dataSignal) => html.div('Data: ', dataSignal),
 *   () => html.div('No data available')
 * )
 * ```
 *
 * @typeParam T - The type of the value when it's not null/undefined
 * @param value - A signal or literal value that may be null or undefined
 * @param then - Function that receives a signal of the non-nullable value and returns content to render
 * @param otherwise - Optional function that returns content to render when value is null/undefined
 * @returns A renderable that conditionally displays content based on the value's nullability
 * @public
 */
export const Ensure = <T>(
  value: NillifyValue<T>,
  then: (value: Signal<NonNillable<T>>) => TNode,
  otherwise?: () => TNode
): Renderable => {
  function onSignal(valueSignal: Signal<T | null | undefined>) {
    return domRenderable((ctx: DOMContext) => {
      const newCtx = ctx.makeRef()
      let clear: Clear = () => {}
      let isNonNillRendered = false
      let feed: Prop<T> | null = null
      const clearSignal = valueSignal.on(value => {
        if (value == null) {
          clear(true)
          clear = renderableOfTNode(otherwise?.()).render(newCtx)
          isNonNillRendered = false
          feed?.dispose()
          feed = null
        } else {
          if (!isNonNillRendered) {
            feed = prop<T>(value)
            clear(true)
            clear = renderableOfTNode(
              then(feed as Signal<NonNillable<T>>)
            ).render(newCtx)
            isNonNillRendered = true
          } else {
            feed!.set(value)
          }
        }
      })
      return (removeTree: boolean) => {
        feed?.dispose()
        clearSignal()
        clear?.(removeTree)
        newCtx.clear(removeTree)
      }
    })
  }

  function onLiteral(literal: T | null | undefined) {
    if (literal == null) {
      const result = otherwise?.()
      if (result != null) {
        return renderableOfTNode(result)
      }
      return Empty
    }
    return renderableOfTNode(then(signal(literal)))
  }

  return handleValueOrSignal(
    value as Value<T | null | undefined>,
    onSignal,
    onLiteral
  )
}

/**
 * Conditionally renders content only when ALL provided values are non-null/non-undefined.
 *
 * This function is useful when you need multiple values to be present before rendering content.
 * It waits for all values to be non-null/non-undefined before calling the callback function.
 * If any value becomes null/undefined, it will render the `otherwise` content instead.
 *
 * @example
 * ```typescript
 * const user = prop<User | null>(null)
 * const profile = prop<Profile | null>(null)
 * const settings = prop<Settings | null>(null)
 *
 * EnsureAll(user, profile, settings)(
 *   (userSignal, profileSignal, settingsSignal) => html.div(
 *     html.h1('Dashboard'),
 *     html.div('User: ', userSignal.map(u => u.name)),
 *     html.div('Profile: ', profileSignal.map(p => p.bio)),
 *     html.div('Theme: ', settingsSignal.map(s => s.theme))
 *   ),
 *   () => html.div('Loading user data...')
 * )
 * ```
 *
 * @example
 * ```typescript
 * // Mix of signals and literal values
 * const apiData = prop<Data | null>(null)
 * const staticConfig = { theme: 'dark' }
 *
 * EnsureAll(apiData, staticConfig)(
 *   (dataSignal, configSignal) => html.div(
 *     'Data loaded with theme: ',
 *     configSignal.map(c => c.theme)
 *   ),
 *   () => html.div('Waiting for data...')
 * )
 * ```
 *
 * @typeParam T - Tuple type representing the types of all input values
 * @param signals - Variable number of values (signals or literals) that may be null/undefined
 * @returns A function that takes a callback and optional otherwise function, returning a renderable
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
  ): Renderable =>
    domRenderable((ctx: DOMContext) => {
      const newCtx = ctx.makeRef()
      // if any of the values is a literal null or undefined, we can skip the signal logic and always use the otherwise function
      const hasNillLiterals = signals.some(
        signal => !Signal.is(signal) && signal == null
      )

      if (hasNillLiterals) {
        /* c8 ignore next 3 */
        return (
          otherwise != null ? renderableOfTNode(otherwise?.()) : Empty
        ).render(newCtx)
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
          clear = renderableOfTNode(callback(...(feed as any))).render(newCtx)
        } else {
          /* c8 ignore next */
          clear = renderableOfTNode(otherwise?.() ?? Empty).render(newCtx)
        }
      })

      return (removeTree: boolean) => {
        feed.forEach(f => f?.dispose())
        allHadValues.dispose()
        clearFeeds.forEach(fn => fn())
        clear?.(removeTree)
        newCtx.clear(removeTree)
      }
    })
