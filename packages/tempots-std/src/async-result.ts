export interface Idle {
  type: 'idle'
}
export interface Loading {
  type: 'loading'
}
export interface Success<V> {
  type: 'success'
  value: V
}
export interface Failure<E> {
  type: 'failure'
  error: E
}

export type AsyncResult<V, E> = Idle | Loading | Success<V> | Failure<E>

export const AsyncResult = {
  idle: { type: 'idle' } satisfies AsyncResult<never, never>,
  loading: { type: 'loading' } satisfies AsyncResult<never, never>,
  success<V>(value: V): AsyncResult<V, never> {
    return { type: 'success', value }
  },
  failure<E>(error: E): AsyncResult<never, E> {
    return { type: 'failure', error }
  },
  isSuccess<V, E>(r: AsyncResult<V, E>): r is Success<V> {
    return r.type === 'success'
  },
  isFailure<V, E>(r: AsyncResult<V, E>): r is Failure<E> {
    return r.type === 'failure'
  },
  isIdle<V, E>(r: AsyncResult<V, E>): r is Idle {
    return r.type === 'idle'
  },
  isLoading<V, E>(r: AsyncResult<V, E>): r is Loading {
    return r.type === 'loading'
  },
  getOrElse<V, E>(r: AsyncResult<V, E>, alt: V): V {
    return AsyncResult.isSuccess(r) ? r.value : alt
  },
  getOrElseLazy<V, E>(r: AsyncResult<V, E>, altf: () => V): V {
    return AsyncResult.isSuccess(r) ? r.value : altf()
  },
  getOrNull<V, E>(r: AsyncResult<V, E>): V | null {
    return AsyncResult.isSuccess(r) ? r.value : null
  },
  getOrUndefined<V, E>(r: AsyncResult<V, E>): V | undefined {
    return AsyncResult.isSuccess(r) ? r.value : undefined
  },
  cmatch:
    <V1, V2, E>(
      success: (value: V1) => V2,
      failure: (error: E) => V2,
      loading: () => V2,
      idle: () => V2 = loading
    ) =>
    (r: AsyncResult<V1, E>): V2 => {
      if (AsyncResult.isSuccess(r)) {
        return success(r.value)
      } else if (AsyncResult.isFailure(r)) {
        return failure(r.error)
      } else if (AsyncResult.isIdle(r)) {
        return idle()
      } else {
        return loading()
      }
    },
  match: <V1, V2, E>(
    r: AsyncResult<V1, E>,
    success: (value: V1) => V2,
    failure: (error: E) => V2,
    loading: () => V2,
    idle: () => V2 = loading
  ): V2 => {
    if (AsyncResult.isSuccess(r)) {
      return success(r.value)
    } else if (AsyncResult.isFailure(r)) {
      return failure(r.error)
    } else if (AsyncResult.isIdle(r)) {
      return idle()
    } else {
      return loading()
    }
  },
  whenSuccess:
    <V, E>(apply: (v: V) => void) =>
    (r: AsyncResult<V, E>): AsyncResult<V, E> => {
      if (AsyncResult.isSuccess(r)) {
        apply(r.value)
      }
      return r
    },
  whenFailure:
    <V, E>(apply: (e: E) => void) =>
    (r: AsyncResult<V, E>): AsyncResult<V, E> => {
      if (AsyncResult.isFailure(r)) {
        apply(r.error)
      }
      return r
    },
}
