export interface NotAsked {
  type: 'NotAsked'
}
export interface Loading<V> {
  type: 'Loading'
  previousValue?: V
}
export interface Success<V> {
  type: 'Success'
  value: V
}
export interface Failure<E> {
  type: 'Failure'
  error: E
}

export type AsyncResult<V, E> = NotAsked | Loading<V> | Success<V> | Failure<E>

export const AsyncResult = {
  notAsked: { type: 'NotAsked' } satisfies AsyncResult<never, never>,
  loading<V>(previousValue: V | undefined = undefined): AsyncResult<V, never> {
    return { type: 'Loading', previousValue }
  },
  success<V>(value: V): AsyncResult<V, never> {
    return { type: 'Success', value }
  },
  failure<E>(error: E): AsyncResult<never, E> {
    return { type: 'Failure', error }
  },
  isSuccess<V, E>(r: AsyncResult<V, E>): r is Success<V> {
    return r.type === 'Success'
  },
  isFailure<V, E>(r: AsyncResult<V, E>): r is Failure<E> {
    return r.type === 'Failure'
  },
  isNotAsked<V, E>(r: AsyncResult<V, E>): r is NotAsked {
    return r.type === 'NotAsked'
  },
  isLoading<V, E>(r: AsyncResult<V, E>): r is Loading<V> {
    return r.type === 'Loading'
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
      loading: (previousValue?: V1) => V2,
      idle: () => V2 = loading
    ) =>
    (r: AsyncResult<V1, E>): V2 => {
      if (AsyncResult.isSuccess(r)) {
        return success(r.value)
      } else if (AsyncResult.isFailure(r)) {
        return failure(r.error)
      } else if (AsyncResult.isNotAsked(r)) {
        return idle()
      } else {
        return loading(r.previousValue)
      }
    },
  match: <V1, V2, E>(
    r: AsyncResult<V1, E>,
    success: (value: V1) => V2,
    failure: (error: E) => V2,
    loading: (previousValue?: V1) => V2,
    idle: () => V2 = loading
  ): V2 => {
    if (AsyncResult.isSuccess(r)) {
      return success(r.value)
    } else if (AsyncResult.isFailure(r)) {
      return failure(r.error)
    } else if (AsyncResult.isNotAsked(r)) {
      return idle()
    } else {
      return loading(r.previousValue)
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
