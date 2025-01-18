import { Fragment, OnDispose, Renderable, Signal, TNode } from '@tempots/dom'
import {
  AsyncResource,
  makeResource,
  ResourceLoadOptions,
} from '../utils/resource'
import { AsyncResultView } from './async-result-view'

/**
 * Options for displaying the different states of an asynchronous resource.
 *
 * @template V - The type of the value when the resource is successfully loaded.
 * @template E - The type of the error when the resource fails to load.
 * @public
 */
export interface ResourceDisplayOptions<V, E> {
  /** Function to render when the resource is loading. */
  loading?: (previous: Signal<V | undefined>, reload: () => void) => TNode
  /** Function to render when the resource has failed to load. */
  failure?: (error: Signal<E>, reload: () => void) => TNode
  /** Function to render when the resource has successfully loaded. */
  success: (value: Signal<V>, reload: () => void) => TNode
}

/**
 * Component to display an asynchronous resource based on its current status.
 *
 * @template V - The type of the value when the resource is successfully loaded.
 * @template E - The type of the error when the resource fails to load.
 *
 * @param {AsyncResource<V, E>} resource - The asynchronous resource to display.
 * @param {ResourceDisplayOptions<V, E>} options - The display options for the resource.
 * @returns {TNode} A node representing the current state of the resource.
 * @public
 */
export const ResourceDisplay = <V, E>(
  resource: AsyncResource<V, E>,
  options: ResourceDisplayOptions<V, E>
) => {
  const { status, dispose, reload } = resource
  const { loading, failure: error, success } = options

  return Fragment(
    OnDispose(dispose),
    AsyncResultView(status, {
      loading: loading != null ? v => loading(v, reload) : undefined,
      failure: error != null ? e => error(e, reload) : undefined,
      success: v => success(v, reload),
    })
  )
}

/**
 * Creates and displays an asynchronous resource.
 *
 * @template R - The type of the request.
 * @template V - The type of the value when the resource is successfully loaded.
 * @template E - The type of the error when the resource fails to load.
 *
 * @param request - The request to load the resource.
 * @param load - The function to load the resource.
 * @param convertError - The function to convert an unknown error into a specific error type.
 * @returns A function that takes display options and returns a node representing the current state of the resource.
 * @public
 */
export const Resource = <R, V, E = unknown>({
  request,
  load,
  mapError = v => v as E,
}: {
  request: Signal<R>
  load: (options: ResourceLoadOptions<R, V, E>) => Promise<V>
  mapError?: (error: unknown) => E
}): ((displayOptions: ResourceDisplayOptions<V, E>) => Renderable) => {
  const resource = makeResource(request, load, mapError)
  return (displayOptions: ResourceDisplayOptions<V, E>): Renderable =>
    ResourceDisplay(resource, displayOptions)
}
