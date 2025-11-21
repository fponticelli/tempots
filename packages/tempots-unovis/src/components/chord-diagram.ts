import type { Value } from '@tempots/core'
import type {
  ChordDiagramConfigInterface,
  ChordDiagramData,
  ChordInputLink,
  ChordInputNode,
} from '@unovis/ts'
import { ChordDiagram } from '@unovis/ts'
import { componentRenderable } from '../factory'

export interface UVisChordDiagramOptions<
  N extends ChordInputNode,
  L extends ChordInputLink,
> {
  config?: Value<Partial<ChordDiagramConfigInterface<N, L>>>
}

export const UVisChordDiagram = <
  N extends ChordInputNode = ChordInputNode,
  L extends ChordInputLink = ChordInputLink,
>(
  options: UVisChordDiagramOptions<N, L> = {}
) =>
  componentRenderable<
    N,
    ChordDiagramConfigInterface<N, L>,
    ChordDiagram<N, L>,
    ChordDiagramData<N, L>
  >(cfg => new ChordDiagram<N, L>(cfg), options)
