import { DOMContext } from '../dom/dom-context'
import { Computed, makeSignal, Signal } from '../std/signal'
import { Value } from '../std/value'
import { Renderable, Clear, TNode } from '../types/domain'
import { renderableOfTNode } from './element'

/**
 * Represents a set of options for a one-of type.
 * @typeParam T - The type of the options.
 * @public
 */
export type OneOfOptions<T extends Record<string, unknown>> = {
  [KK in keyof T]: (value: Signal<T[KK]>) => TNode
}

/**
 * Creates a renderable function that renders different components based on the value of a signal.
 *
 * The signal value should be an object with a single key that matches one of the keys in the `cases` object.
 *
 * @typeParam T - The type of the signal value.
 * @param match - The signal or value to match against.
 * @param cases - An object containing the different cases to render based on the signal value.
 * @returns A renderable function that renders the appropriate component based on the signal value.
 * @public
 */
export const OneOf = <T extends Record<string, unknown>>(
  match: Value<T>,
  cases: OneOfOptions<T>
): Renderable => {
  if (Signal.is(match)) {
    return (ctx: DOMContext) => {
      const newCtx = ctx.makeRef()
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
          clearRenderable = renderableOfTNode(child)(newCtx)
          currentKey = newKey
        }
      })
      return (removeTree: boolean) => {
        clearSignal()
        newCtx.clear(removeTree)
        clearRenderable?.(removeTree)
      }
    }
  }
  const key = Object.keys(match)[0] as keyof T
  return renderableOfTNode(cases[key](makeSignal(match[key])))
}

/**
 * Represents the options for a one-of field.
 *
 * @typeParam T - The type containing the one-of field.
 * @typeParam K - The key of the one-of field in the type.
 * @public
 */
export type OneOfFieldOptions<
  T extends {
    [_ in K]: string
  },
  K extends string,
> = {
  [KK in T[K]]: (
    value: Signal<
      T extends {
        [_ in K]: KK
      }
        ? T
        : never
    >
  ) => TNode
}

/**
 * Creates a renderable that renders different components based on the value of the specified field.
 *
 * @typeParam T - The type containing the one-of field.
 * @typeParam K - The type of the one-of field key.
 * @param match - The signal or value that emits the object containing the one-of field.
 * @param field - The key of the one-of field.
 * @param cases - The options for the different cases of rendering based on the one-of field value.
 * @returns - The renderable field representing the one-of field.
 * @public
 */
export const OneOfField = <T extends { [_ in K]: string }, K extends string>(
  match: Value<T>,
  field: K,
  cases: OneOfFieldOptions<T, K>
) =>
  OneOf(
    Value.map(match, v => ({ [v[field]]: v })),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cases as any
  )

/**
 * The options for a one-of kind field.
 *
 * @typeParam T - The type that contains the `kind` property.
 * @public
 */
export type OneOfKindOptions<
  T extends {
    kind: string
  },
> = {
  [KK in T['kind']]: (
    value: Signal<
      T extends {
        kind: KK
      }
        ? T
        : never
    >
  ) => TNode
}

/**
 * Creates a renderable field that matches the value of the `kind` property in the provided `match` signal.
 *
 * It uses the `cases` object to determine the appropriate field to render based on the value of `kind`.
 *
 * @typeParam T - The type of the object with a `kind` property.
 * @param match - The signal containing the object to match against.
 * @param cases - The object containing the cases to match against.
 * @returns - The renderable field that matches the value of `kind`.
 * @public
 */
export const OneOfKind = <T extends { kind: string }>(
  match: Value<T>,
  cases: OneOfKindOptions<T>
) => OneOfField(match, 'kind', cases)

/**
 * Represents a mapping of keys to functions that accept a value of type `Signal<V>`
 * and return a `TNode`.
 *
 * @typeParam T - The union type of keys.
 * @typeParam V - The type of the value accepted by the functions.
 * @public
 */
export type OneOfTupleOptions<T extends string, V> = {
  [KK in T]: (value: Signal<V>) => TNode
}

/**
 * Creates a tuple-based one-of component that matches a signal value with a set of cases.
 *
 * The signal value should be a tuple with the first element being the key to match against.
 *
 * @param match - The signal containing the value to match.
 * @param cases - The options for the one-of component.
 * @returns The result of matching the signal value with the cases.
 * @public
 */
export const OneOfTuple = <T extends string, V>(
  match: Value<[T, V]>,
  cases: OneOfTupleOptions<T, V>
) => {
  const matchRecord = Value.map(match, ([key, value]) => ({ [key]: value }))
  return OneOf(matchRecord, cases)
}

/**
 * Represents a mapping of types to rendering functions.
 * @typeParam T - The type that contains a `type` property.
 * @public
 */
export type OneOfTypeOptions<T extends { type: string }> = {
  /**
   * Represents a rendering function for a specific type.
   * @param value - The value of type `T` or `never` if the type doesn't match.
   * @returns The rendered node.
   */
  [KK in T['type']]: (
    value: Signal<T extends { type: KK } ? T : never>
  ) => TNode
}

/**
 * Creates a field that renders one of the provided cases based on the value of the `type` property.
 *
 * It uses the `cases` object to determine the appropriate field to render based on the value of `type`.
 *
 * @typeParam T - The type of the object with a `type` property.
 * @param match - The signal that contains the object with the `type` property.
 * @param cases - The options for rendering each case based on the `type` property.
 * @returns - The rendered field.
 * @public
 */
export const OneOfType = <T extends { type: string }>(
  match: Value<T>,
  cases: OneOfTypeOptions<T>
) => OneOfField(match, 'type', cases)

/**
 * Represents a set of options for a one-of value.
 * @typeParam T - The type of the one-of value.
 * @public
 */
export type OneOfValueOptions<T extends symbol | number | string> = {
  [KK in T]: () => TNode
}

/**
 * Creates a renderable value that represents one of the provided cases based on the given match signal.
 *
 * The match signal should emit a value that matches one of the keys in the `cases` object.
 *
 * @typeParam T - The type of the match signal value.
 * @param match - The match signal.
 * @param cases - The options for the one-of value.
 * @returns - The renderable value representing one of the cases.
 * @public
 */
export const OneOfValue = <T extends symbol | number | string>(
  match: Value<T>,
  cases: OneOfValueOptions<T>
) =>
  OneOf(
    Value.map(match, v => ({ [v]: true })),
    cases
  )
