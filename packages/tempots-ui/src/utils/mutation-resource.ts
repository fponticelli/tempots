import { prop, Signal } from '@tempots/dom'
import { AsyncResult, NonLoading } from '@tempots/std'
import { makeResourceRunner } from './resource-runner'

/**
 * A write-side wrapper for async state around POST/PUT/PATCH/DELETE.
 * Mirrors AsyncResource but the action is explicit (execute), not implicit (reload).
 *
 * @typeParam Req - The request payload/type you send.
 * @typeParam Res - The response/value you get back on success.
 * @typeParam E   - The error type on failure.
 */
export interface MutationResource<Req, Res, E> {
  /** Current async status (Idle | Loading | Success | Failure). */
  readonly status: Signal<AsyncResult<Res, E>>
  /** Latest successful value (if any). */
  readonly value: Signal<Res | undefined>
  /** Latest error (if any). */
  readonly error: Signal<E | undefined>
  /** Whether a mutation is currently in flight. */
  readonly pending: Signal<boolean>

  /** Execute the mutation. */
  readonly execute: (
    request: Req,
    options?: MutationResourceExecuteOptions<Req, Res>
  ) => void

  /** Abort the current in-flight request (if any) and clean up. */
  readonly cancel: (newState?: NonLoading<Res, E>) => void

  /** Dispose of resources, aborting any in-flight request. */
  readonly dispose: () => void
}

/**
 * Options passed to the mutate function.
 *
 * @typeParam Req - The request payload/type.
 * @typeParam Res - The response/value type on success.
 * @typeParam E   - The error type on failure.
 * @public
 */
export interface MutationResourceLoadOptions<Req, Res, E> {
  /** The request to execute the mutation. */
  readonly request: Req
  /** Abort signal for this execution. */
  readonly abortSignal: AbortSignal
  /** The previous result of the mutation, if any. */
  readonly previous: AsyncResult<Res, E>
  /** Abort the current in-flight request and optionally set a new state. */
  readonly cancel: (newState?: NonLoading<Res, E>) => void
}

/**
 * Caller-controlled options for execute().
 * Useful for optimistic UI.
 *
 * @typeParam Req - The request payload/type.
 * @typeParam Res - The response/value type on success.
 * @public
 */
export interface MutationResourceExecuteOptions<Req, Res> {
  /**
   * Optionally provide an optimistic value to set immediately.
   * This will set status to Loading with value prefilled.
   */
  readonly optimisticValue?: Res

  /**
   * Optionally derive an optimistic value from the request.
   * Runs only if optimisticValue is not provided.
   */
  readonly optimisticFromRequest?: (req: Req) => Res
}

export const makeMutationResource = <Req, Res, E>({
  mutate,
  convertError,
  onSuccess,
  onError,
  onSettled,
}: {
  mutate: (options: MutationResourceLoadOptions<Req, Res, E>) => Promise<Res>
  convertError: (error: unknown) => E
  onSuccess?: (value: Res, req: Req) => void
  onError?: (error: E, req: Req) => void
  onSettled?: (result: AsyncResult<Res, E>, req: Req) => void
}): MutationResource<Req, Res, E> => {
  const status = prop<AsyncResult<Res, E>>(AsyncResult.notAsked)
  const value = status.map(r =>
    AsyncResult.isSuccess(r) ? r.value : undefined
  )
  const error = status.map(r =>
    AsyncResult.isFailure(r) ? r.error : undefined
  )
  const pending = status.map(r => AsyncResult.isLoading(r))
  const { run, cancel } = makeResourceRunner({
    status,
    load: mutate,
    convertError,
    onSuccess,
    onError,
    onSettled,
  })
  const execute = (
    request: Req,
    options?: MutationResourceExecuteOptions<Req, Res>
  ) =>
    run(
      request,
      () =>
        options?.optimisticValue ?? options?.optimisticFromRequest?.(request)
    )
  const dispose = () => status.dispose()

  return {
    status,
    value,
    error,
    pending,
    execute,
    cancel,
    dispose,
  }
}
