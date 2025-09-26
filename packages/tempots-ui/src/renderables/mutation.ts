import { Fragment, OnDispose, Renderable, Signal, TNode } from '@tempots/dom'
import { AsyncResultView } from './async-result-view'
import { AsyncResult, NonLoading } from '@tempots/std'
import {
  makeMutationResource,
  MutationResource,
  MutationResourceExecuteOptions,
} from '../utils/mutation-resource'

/**
 * Options for displaying the different states of an asynchronous resource.
 *
 * @template Res - The type of the value when the resource is successfully loaded.
 * @template E - The type of the error when the resource fails to load.
 * @public
 */
export interface MutationDisplayOptions<Req, Res, E> {
  /** Function to render when the query is loading. */
  pending?: (options: {
    previous: Signal<Res | undefined>
    retry: () => void
    execute: (request: Req) => void
    cancel: (newState?: NonLoading<Res, E>) => void
  }) => TNode
  /** Function to render when the query has failed to load. */
  failure?: (options: {
    error: Signal<E>
    retry: () => void
    execute: (request: Req) => void
  }) => TNode
  /** Function to render when the query has successfully loaded. */
  success: (options: {
    value: Signal<Res>
    execute: (request: Req) => void
  }) => TNode
  notAsked: (options: { execute: (request: Req) => void }) => TNode
}

/**
 * Component to display an asynchronous mutation based on its current status.
 *
 * @template Req - The type of the request.
 * @template Res - The type of the value when the resource is successfully loaded.
 * @template E - The type of the error when the resource fails to load.
 *
 * @param {MutationResource<Req, Res, E>} resource - The asynchronous resource to display.
 * @param {MutationDisplayOptions<Req, Res, E>} options - The display options for the resource.
 * @returns {Renderable} A node representing the current state of the resource.
 * @public
 */
export const MutationDisplay = <Req, Res, E>(
  resource: MutationResource<Req, Res, E>,
  options: MutationDisplayOptions<Req, Res, E>
): Renderable => {
  const { status, dispose, execute } = resource
  const { pending, failure, success, notAsked } = options

  let lastRequest: Req | undefined
  const retry = () => {
    if (lastRequest != null) {
      execute(lastRequest)
    }
  }

  const executeWithRetry = (request: Req) => {
    lastRequest = request
    execute(request)
  }

  return Fragment(
    OnDispose(dispose),
    AsyncResultView(status, {
      loading:
        pending != null
          ? v =>
              pending({
                previous: v,
                retry,
                execute: executeWithRetry,
                cancel: resource.cancel,
              })
          : undefined,
      failure:
        failure != null
          ? e => failure({ error: e, retry, execute: executeWithRetry })
          : undefined,
      success: value => success({ value, execute: executeWithRetry }),
      notAsked: () => notAsked({ execute: executeWithRetry }),
    })
  )
}

/**
 * Creates a reactive mutation component for handling asynchronous data loading.
 *
 * This component provides a declarative way to handle async operations with proper
 * loading, success, and error states. It automatically manages the lifecycle of
 * async requests and provides reload functionality.
 *
 * @template Req - The type of the request.
 * @template Res - The type of the value when the resource is successfully loaded.
 * @template E - The type of the error when the resource fails to load.
 *
 * @param {MutationResource<Req, Res, E>} resource - The asynchronous resource to display.
 * @param {MutationDisplayOptions<Req, Res, E>} options - The display options for the resource.
 * @returns {Renderable} A node representing the current state of the resource.
 * @public
 */
export const Mutation = <Req, Res, E = unknown>({
  mutate,
  convertError = v => v as E,
  onSuccess,
  onError,
  onSettled,
  pending,
  failure,
  success,
  notAsked,
}: {
  mutate: (options: MutationResourceExecuteOptions<Req, Res, E>) => Promise<Res>
  convertError?: (error: unknown) => E
  onSuccess?: (value: Res, req: Req) => void
  onError?: (error: E, req: Req) => void
  onSettled?: (result: AsyncResult<Res, E>, req: Req) => void
} & MutationDisplayOptions<Req, Res, E>): Renderable => {
  const resource = makeMutationResource<Req, Res, E>({
    mutate,
    convertError,
    onSuccess,
    onError,
    onSettled,
  })
  return MutationDisplay(resource, {
    pending,
    failure,
    success,
    notAsked,
  })
}
