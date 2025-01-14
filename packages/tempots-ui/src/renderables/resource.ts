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

export interface ResourceDisplayOptions<V, E> {
  notAsked?: (reload: () => void) => TNode
  loading?: (previous: Signal<V | undefined>, reload: () => void) => TNode
  error?: (error: Signal<E>, reload: () => void) => TNode
  success: (value: Signal<V>, reload: () => void) => TNode
}

export interface ResourceOptions<R, V, E>
  extends MakeResourceOptions<R, V, E>,
    ResourceDisplayOptions<V, E> {}

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

export const Resource = <R, V, E>(options: ResourceOptions<R, V, E>) => {
  const resource = makeResource(options)
  return ResourceDisplay(resource, options)
}
