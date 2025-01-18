/**
 * Creates a deferred object. A deferred object is a promise that can be resolved or rejected.
 *
 * @returns A deferred object.
 * @example
 * ```ts
 * const { promise, resolve, reject } = deferred<number>()
 *
 * promise.then((value) => {
 *   console.warn(value)
 * })
 *
 * resolve(42)
 * ```
 * @public
 */
export const deferred = <T>() => {
  let resolve: (value: T) => void
  let reject: (reason?: unknown) => void
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })

  return { promise, resolve: resolve!, reject: reject! }
}
