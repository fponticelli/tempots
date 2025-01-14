import {
  Empty,
  Ensure,
  Fragment,
  OnDispose,
  OneOfType,
  Signal,
  TNode,
} from '@tempots/dom'
import {
  MakeResourceOptions,
  AsyncResource,
  makeResource,
} from '../utils/resource'

/**
 * Options for displaying the different states of an asynchronous resource.
 *
 * @template V - The type of the value when the resource is successfully loaded.
 * @template E - The type of the error when the resource fails to load.
 * @public
 */
export interface ResourceDisplayOptions<V, E> {
  /** Function to render when the resource has not been requested yet. */
  notAsked?: (reload: () => void) => TNode
  /** Function to render when the resource is loading. */
  loading?: (previous: Signal<V | undefined>, reload: () => void) => TNode
  /** Function to render when the resource has failed to load. */
  error?: (error: Signal<E>, reload: () => void) => TNode
  /** Function to render when the resource has successfully loaded. */
  success: (value: Signal<V>, reload: () => void) => TNode
}

/**
 * Options for creating and displaying an asynchronous resource.
 *
 * @template R - The type of the request.
 * @template V - The type of the value when the resource is successfully loaded.
 * @template E - The type of the error when the resource fails to load.
 * @public
 */
export interface ResourceOptions<R, V, E>
  extends MakeResourceOptions<R, V, E>,
    ResourceDisplayOptions<V, E> {}

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
  const { notAsked, loading, error, success } = options

  return Fragment(
    OnDispose(dispose),
    OneOfType(status, {
      NotAsked: () => (notAsked != null ? notAsked(reload) : undefined),
      Loading: v =>
        loading != null
          ? loading(v.$.previousValue, reload)
          : Ensure(
              v.$.previousValue,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              ((v: Signal<V>) => success(v, reload)) as any, // TODO unsure why this is needed
              () => Empty
            ),
      AsyncFailure: v => (error != null ? error(v.$.error, reload) : undefined),
      AsyncSuccess: v => success(v.$.value, reload),
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
 * @param {ResourceOptions<R, V, E>} options - The options for creating and displaying the resource.
 * @returns {TNode} A node representing the current state of the resource.
 * @public
 */
export const Resource = <R, V, E>(options: ResourceOptions<R, V, E>) => {
  const resource = makeResource(options)
  return ResourceDisplay(resource, options)
}
