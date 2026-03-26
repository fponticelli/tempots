import { prop, Signal, Value } from '@tempots/dom'
import { AsyncResult, NonLoading } from '@tempots/std'

/**
 * Represents an asynchronous query with its current status, value, error, and loading state.
 * Provides methods to reload the query and dispose of it.
 *
 * @typeParam Res - The type of the value when the query is successfully loaded.
 * @typeParam E - The type of the error when the query fails to load.
 * @public
 */
export interface QueryResource<Res, E> {
  /** The current status of the query as an AsyncResult. */
  readonly status: Signal<AsyncResult<Res, E>>
  /** Abort the current in-flight request (if any) and clean up. */
  readonly cancel: (newState?: NonLoading<Res, E>) => void
  /** Disposes of the query, aborting any ongoing requests and cleaning up. */
  readonly dispose: () => void
  /** The current value of the query, or undefined if not loaded or failed. */
  readonly value: Signal<Res | undefined>
  /** The current error of the query, or undefined if not failed. */
  readonly error: Signal<E | undefined>
  /** Whether the query is currently loading. */
  readonly loading: Signal<boolean>
  /** Reloads the query using the current request. */
  readonly reload: () => void
}

/**
 * Options for loading a query, including the request, abort signal, and previous result.
 *
 * @typeParam Req - The type of the request.
 * @typeParam Res - The type of the value when the query is successfully loaded.
 * @typeParam E - The type of the error when the query fails to load.
 * @public
 */
export interface QueryResourceLoadOptions<Req, Res, E> {
  /** The request to load the query. */
  readonly request: Req
  /** The signal to abort the loading process if needed. */
  readonly abortSignal: AbortSignal
  /** The previous result of the query loading, if any. */
  readonly previous: AsyncResult<Res, E>
  /** Abort the current in-flight request and optionally set a new state. */
  readonly cancel: (newState?: NonLoading<Res, E>) => void
}

/**
 * Creates an asynchronous query that can be loaded, reloaded, and disposed of.
 *
 * @typeParam R - The type of the request.
 * @typeParam V - The type of the value when the query is successfully loaded.
 * @typeParam E - The type of the error when the query fails to load.
 *
 * @param request - The request to load the query.
 * @param load - The function to load the query.
 * @param convertError - The function to convert an unknown error into a specific error type.
 * @returns The created asynchronous query.
 * @public
 */
export const makeQueryResource = <Req, Res, E>({
  request,
  load,
  convertError,
  onSuccess,
  onError,
  onSettled,
}: {
  request: Value<Req>
  load: (options: QueryResourceLoadOptions<Req, Res, E>) => Promise<Res>
  convertError: (error: unknown) => E
  onSuccess?: (value: Res, req: Req) => void
  onError?: (error: E, req: Req) => void
  onSettled?: (result: AsyncResult<Res, E>, req: Req) => void
}): QueryResource<Res, E> => {
  let abortController: AbortController | undefined
  const status = prop<AsyncResult<Res, E>>(AsyncResult.notAsked)
  const value = status.map(r =>
    AsyncResult.isSuccess(r) ? r.value : undefined
  )
  const error = status.map(r =>
    AsyncResult.isFailure(r) ? r.error : undefined
  )
  const loading = status.map(r => AsyncResult.isLoading(r))
  const abort = () => {
    /* c8 ignore next */
    abortController?.abort()
    abortController = undefined
  }
  const cancel = (newState?: NonLoading<Res, E>) => {
    abort()
    status.set(newState ?? AsyncResult.notAsked)
  }

  /**
   * Runs the load function with the given request, updating the status accordingly.
   *
   * @param {Req} req - The request to load the query.
   * @public
   */
  const runLoad = async (req: Req) => {
    abort()
    abortController = new AbortController()
    const abortSignal = abortController.signal
    const previous = status.get()
    status.set(AsyncResult.loading(AsyncResult.getOrUndefined(previous)))
    try {
      const result = await load({
        request: req,
        abortSignal,
        previous,
        cancel,
      })
      // Forces a microtask boundary when load resolves synchronously,
      // ensuring the Loading status propagates before being replaced by Success.
      await Promise.resolve()
      abortController = undefined
      status.set(AsyncResult.success(result))
      onSuccess?.(result, req)
    } catch (error) {
      abortController = undefined
      const converted = convertError(error)
      status.set(AsyncResult.failure(converted))
      onError?.(converted, req)
    }
    onSettled?.(status.get(), req)
  }

  /** Reloads the query using the current request. */
  const reload = () => runLoad(Value.get(request))

  /** Disposes of the query, aborting any ongoing requests and cleaning up. */
  const dispose = () => {
    /* c8 ignore next */
    abortController?.abort()
    abortController = undefined
    status.dispose()
  }

  status.onDispose(Value.on(request, runLoad))

  return {
    status,
    value,
    error,
    loading,
    cancel,
    reload,
    dispose,
  }
}
