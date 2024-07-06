export type Maybe<T> = Just<T> | Nothing

export type Nothing = undefined | null
export type Just<T> = NonNullable<T>

export const Maybe = {
  nothing: undefined as Maybe<never>,
  just: <T>(value: T): Maybe<T> => value as Maybe<T>,
  isNothing: <T>(maybe: Maybe<T>): maybe is Nothing => maybe == null,
  isJust: <T>(maybe: Maybe<T>): maybe is Just<T> => maybe != null,
}
