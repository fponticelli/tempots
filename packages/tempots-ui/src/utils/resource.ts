import { makeProp, Signal } from '@tempots/dom'
import { AsyncResult } from '@tempots/std'

export interface AsyncResource<V, E> {
  readonly status: Signal<AsyncResult<V, E>>
  readonly dispose: () => void
  readonly value: Signal<V | undefined>
  readonly error: Signal<E | undefined>
  readonly loading: Signal<boolean>
  readonly reload: () => void
}

export interface ResourceLoadOptions<R, V, E> {
  readonly request: R
  readonly abortSignal: AbortSignal
  readonly previous: AsyncResult<V, E>
}

export interface MakeResourceOptions<R, V, E> {
  readonly request: Signal<R>
  readonly load: (options: ResourceLoadOptions<R, V, E>) => Promise<V>
  readonly convertError: (error: unknown) => E
}

export const makeResource = <R, V, E>({
  request,
  load,
  convertError,
}: MakeResourceOptions<R, V, E>): AsyncResource<V, E> => {
  const status = makeProp<AsyncResult<V, E>>(AsyncResult.notAsked)
  const value = status.map(r =>
    AsyncResult.isSuccess(r) ? r.value : undefined
  )
  const error = status.map(r =>
    AsyncResult.isFailure(r) ? r.error : undefined
  )
  const loading = status.map(r => AsyncResult.isLoading(r))

  let abortController: AbortController | undefined

  const runLoad = async (req: R) => {
    abortController?.abort()
    abortController = new AbortController()
    const abortSignal = abortController.signal
    const previous = status.get()
    status.set(AsyncResult.loading(AsyncResult.getOrUndefined(previous)))
    try {
      const result = await load({ request: req, abortSignal, previous })
      abortController = undefined
      status.set(AsyncResult.success(result))
    } catch (error) {
      abortController = undefined
      status.set(AsyncResult.failure(convertError(error)))
    }
  }

  const reload = () => runLoad(request.get())
  const dispose = () => {
    abortController?.abort()
    abortController = undefined
    status.dispose()
  }

  status.onDispose(request.on(runLoad))

  return {
    status,
    value,
    error,
    loading,
    reload,
    dispose,
  }
}
