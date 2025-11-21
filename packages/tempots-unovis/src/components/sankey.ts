import type { Value } from '@tempots/core'
import type {
  SankeyConfigInterface,
  SankeyInputLink,
  SankeyInputNode,
} from '@unovis/ts'
import { Sankey } from '@unovis/ts'
import { componentRenderable } from '../factory'

export interface UVisSankeyOptions<
  N extends SankeyInputNode,
  L extends SankeyInputLink,
> {
  config?: Value<Partial<SankeyConfigInterface<N, L>>>
}

export type SankeyData<N extends SankeyInputNode, L extends SankeyInputLink> = {
  nodes: N[]
  links?: L[]
}

export const UVisSankey = <
  N extends SankeyInputNode = SankeyInputNode,
  L extends SankeyInputLink = SankeyInputLink,
>(
  options: UVisSankeyOptions<N, L> = {}
) =>
  componentRenderable<
    N,
    SankeyConfigInterface<N, L>,
    Sankey<N, L>,
    SankeyData<N, L>
  >(cfg => new Sankey<N, L>(cfg), options)
