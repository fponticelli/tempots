import { Result } from './result'

/**
 * Represents a valid result.
 */
export interface Valid {
  type: 'valid'
}
/**
 * Represents an invalid value with an associated error.
 * @typeParam E - The type of the error.
 */
export interface Invalid<E> {
  type: 'invalid'
  error: E
}

/**
 * Represents a type that can either be `Valid` or `Invalid`.
 * @typeParam E - The type of the error associated with an `Invalid` value.
 */
export type Validation<E> = Valid | Invalid<E>

/**
 * Represents a promise that resolves to a `Validation` object.
 * @typeParam E - The type of the error value in the `Validation` object.
 */
export type PromiseValidation<E> = PromiseLike<Validation<E>>

/**
 * Utility functions for working with `Validation` types.
 */
export const Validation = {
  /**
   * Creates a valid `Validation`.
   * @returns A `Validation` that is `Valid`.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  valid: { type: 'valid' } satisfies Validation<any>,
  /**
   * Creates an invalid `Validation`.
   * @param error The error associated with the invalid value.
   * @returns A `Validation` that is `Invalid`.
   */
  invalid<E>(error: E): Validation<E> {
    return { type: 'invalid', error }
  },
  /**
   * Checks if a `Validation` is `Valid`.
   * @param r The `Validation` to check.
   * @returns `true` if the `Validation` is `Valid`, otherwise `false`.
   */
  isValid<E>(r: Validation<E>): r is Valid {
    return r.type === 'valid'
  },
  /**
   * Checks if a `Validation` is `Invalid`.
   * @param r The `Validation` to check.
   * @returns `true` if the `Validation` is `Invalid`, otherwise `false`.
   */
  isInvalid<E>(r: Validation<E>): r is Invalid<E> {
    return r.type === 'invalid'
  },
  /**
   * Maps the value of a `Validation` to a new value.
   * @param r The `Validation` to map.
   * @param valid The mapping function for a valid value.
   * @param invalid The mapping function for an invalid value.
   * @returns The mapped value.
   */
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
  /**
   * Maps the value of a `Validation` to a new `Validation`.
   * @param validation The `Validation` to map.
   * @param value The value to map.
   * @returns A new `Validation` with the mapped value.
   */
  toResult: <T, E>(validation: Validation<E>, value: T): Result<T, E> =>
    Validation.match(
      validation,
      () => Result.success<T>(value),
      (err: E) => Result.failure<E>(err)
    ),
  /**
   * Execute a function when the `Validation` is valid.
   *
   * @param r The `Validation` to check.
   * @param apply The function to execute when the `Validation` is valid.
   * @returns The `Validation` object.
   */
  whenValid: <E>(r: Validation<E>, apply: () => void): Validation<E> => {
    if (Validation.isValid(r)) {
      apply()
    }
    return r
  },
  /**
   * Execute a function when the `Validation` is invalid.
   *
   * @param r The `Validation` to check.
   * @param apply The function to execute when the `Validation` is invalid.
   * @returns The `Validation` object.
   */
  whenInvalid: <E>(r: Validation<E>, apply: (e: E) => void): Validation<E> => {
    if (Validation.isInvalid(r)) {
      apply(r.error)
    }
    return r
  },
}
