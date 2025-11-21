import type { Value } from '@tempots/core'
import type {
  GraphConfigInterface,
  GraphInputData,
  GraphInputLink,
  GraphInputNode,
} from '@unovis/ts'
import { Graph } from '@unovis/ts'
import { componentRenderable } from '../factory'

export interface UVisGraphOptions<
  N extends GraphInputNode,
  L extends GraphInputLink,
> {
  config?: Value<Partial<GraphConfigInterface<N, L>>>
}

export const UVisGraph = <
  N extends GraphInputNode = GraphInputNode,
  L extends GraphInputLink = GraphInputLink,
>(
  options: UVisGraphOptions<N, L> = {}
) =>
  componentRenderable<
    N,
    GraphConfigInterface<N, L>,
    Graph<N, L>,
    GraphInputData<N, L>
  >(cfg => new Graph<N, L>(cfg), options)
