import { makeProp, Signal } from '@tempots/dom'
import { AsyncResult } from '@tempots/std'

/**
 * Represents an asynchronous resource with its current status, value, error, and loading state.
 * Provides methods to reload the resource and dispose of it.
 *
 * @template V - The type of the value when the resource is successfully loaded.
 * @template E - The type of the error when the resource fails to load.
 * @public
 */
export interface AsyncResource<V, E> {
  /** The current status of the resource as an AsyncResult. */
  readonly status: Signal<AsyncResult<V, E>>
  /** Disposes of the resource, aborting any ongoing requests and cleaning up. */
  readonly dispose: () => void
  /** The current value of the resource, or undefined if not loaded or failed. */
  readonly value: Signal<V | undefined>
  /** The current error of the resource, or undefined if not failed. */
  readonly error: Signal<E | undefined>
  /** Whether the resource is currently loading. */
  readonly loading: Signal<boolean>
  /** Reloads the resource using the current request. */
  readonly reload: () => void
}

/**
 * Options for loading a resource, including the request, abort signal, and previous result.
 *
 * @template R - The type of the request.
 * @template V - The type of the value when the resource is successfully loaded.
 * @template E - The type of the error when the resource fails to load.
 * @public
 */
export interface ResourceLoadOptions<R, V, E> {
  /** The request to load the resource. */
  readonly request: R
  /** The signal to abort the loading process if needed. */
  readonly abortSignal: AbortSignal
  /** The previous result of the resource loading, if any. */
  readonly previous: AsyncResult<V, E>
}

/**
 * Creates an asynchronous resource that can be loaded, reloaded, and disposed of.
 *
 * @template R - The type of the request.
 * @template V - The type of the value when the resource is successfully loaded.
 * @template E - The type of the error when the resource fails to load.
 *
 * @param request - The request to load the resource.
 * @param load - The function to load the resource.
 * @param convertError - The function to convert an unknown error into a specific error type.
 * @returns The created asynchronous resource.
 * @public
 */
export const makeResource = <R, V, E>(
  request: Signal<R>,
  load: (options: ResourceLoadOptions<R, V, E>) => Promise<V>,
  convertError: (error: unknown) => E
): AsyncResource<V, E> => {
  const status = makeProp<AsyncResult<V, E>>(AsyncResult.notAsked)
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
   * @param {R} req - The request to load the resource.
   * @public
   */
  const runLoad = async (req: R) => {
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

  /** Reloads the resource using the current request. */
  const reload = () => runLoad(request.get())

  /** Disposes of the resource, aborting any ongoing requests and cleaning up. */
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
