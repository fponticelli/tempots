import { Result } from './result'

export interface Valid {
  type: 'valid'
}
export interface Invalid<E> {
  type: 'invalid'
  error: E
}

export type Validation<E> = Valid | Invalid<E>

export type PromiseValidation<E> = PromiseLike<Validation<E>>

export const Validation = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  valid: { type: 'valid' } as Validation<any>,
  invalid<E>(error: E): Validation<E> {
    return { type: 'invalid', error }
  },
  isValid<E>(r: Validation<E>): r is Valid {
    return r.type === 'valid'
  },
  isInvalid<E>(r: Validation<E>): r is Invalid<E> {
    return r.type === 'invalid'
  },
  cmatch:
    <V, E>(valid: () => V, invalid: (error: E) => V) =>
    (r: Validation<E>): V => {
      if (Validation.isValid(r)) {
        return valid()
      } else {
        return invalid(r.error)
      }
    },
  match: <V, E>(
    r: Validation<E>,
    valid: () => V,
    invalid: (error: E) => V
  ): V => {
    if (Validation.isValid(r)) {
      return valid()
    } else {
      return invalid(r.error)
    }
  },
  toResult: <T, E>(value: T): ((validation: Validation<E>) => Result<T, E>) =>
    Validation.cmatch(
      () => Result.success<T>(value),
      (err: E) => Result.failure<E>(err)
    ),
  whenValid:
    <E>(apply: () => void) =>
    (r: Validation<E>): Validation<E> => {
      if (Validation.isValid(r)) {
        apply()
      }
      return r
    },
  whenInvalid:
    <E>(apply: (e: E) => void) =>
    (r: Validation<E>): Validation<E> => {
      if (Validation.isInvalid(r)) {
        apply(r.error)
      }
      return r
    }
}
