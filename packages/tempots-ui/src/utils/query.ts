import { prop, Signal, Value } from '@tempots/dom'
import { AsyncResult } from '@tempots/std'

/**
 * Represents an asynchronous query with its current status, value, error, and loading state.
 * Provides methods to reload the query and dispose of it.
 *
 * @template V - The type of the value when the query is successfully loaded.
 * @template E - The type of the error when the query fails to load.
 * @public
 */
export interface Query<V, E> {
  /** The current status of the query as an AsyncResult. */
  readonly status: Signal<AsyncResult<V, E>>
  /** Disposes of the query, aborting any ongoing requests and cleaning up. */
  readonly dispose: () => void
  /** The current value of the query, or undefined if not loaded or failed. */
  readonly value: Signal<V | undefined>
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
 * @template R - The type of the request.
 * @template V - The type of the value when the query is successfully loaded.
 * @template E - The type of the error when the query fails to load.
 * @public
 */
export interface QueryLoadOptions<R, V, E> {
  /** The request to load the query. */
  readonly request: R
  /** The signal to abort the loading process if needed. */
  readonly abortSignal: AbortSignal
  /** The previous result of the query loading, if any. */
  readonly previous: AsyncResult<V, E>
}

/**
 * Creates an asynchronous query that can be loaded, reloaded, and disposed of.
 *
 * @template R - The type of the request.
 * @template V - The type of the value when the query is successfully loaded.
 * @template E - The type of the error when the query fails to load.
 *
 * @param request - The request to load the query.
 * @param load - The function to load the query.
 * @param convertError - The function to convert an unknown error into a specific error type.
 * @returns The created asynchronous query.
 * @public
 */
export const makeQuery = <R, V, E>(
  request: Value<R>,
  load: (options: QueryLoadOptions<R, V, E>) => Promise<V>,
  convertError: (error: unknown) => E
): Query<V, E> => {
  const status = prop<AsyncResult<V, E>>(AsyncResult.notAsked)
  const value = status.map(r =>
    AsyncResult.isSuccess(r) ? r.value : undefined
  )
  const error = status.map(r =>
    AsyncResult.isFailure(r) ? r.error : undefined
  )
  const loading = status.map(r => AsyncResult.isLoading(r))

  let abortController: AbortController | undefined

  /**
   * Runs the load function with the given request, updating the status accordingly.
   *
   * @param {R} req - The request to load the query.
   * @public
   */
  const runLoad = async (req: R) => {
    /* c8 ignore next */
    abortController?.abort()
    abortController = new AbortController()
    const abortSignal = abortController.signal
    const previous = status.get()
    status.set(AsyncResult.loading(AsyncResult.getOrUndefined(previous)))
    try {
      const result = await load({ request: req, abortSignal, previous })
      // forces a delay when load is synchronous
      // without this, the status.set(Loading) gets triggered again with an undefined value
      // TODO: not sure if this is the best solution
      await Promise.resolve()
      abortController = undefined
      status.set(AsyncResult.success(result))
    } catch (error) {
      abortController = undefined
      status.set(AsyncResult.failure(convertError(error)))
    }
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
    reload,
    dispose,
  }
}
