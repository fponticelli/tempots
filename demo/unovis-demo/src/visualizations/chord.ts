import { attr, html, prop } from '@tempots/dom'
import { UVisChordDiagram, UnovisSingleContainer } from '@tempots/unovis'
import type { Renderable } from '@tempots/dom'
import type { ChordLinkDatum, ChordRegion } from '../types'
import { colorForKey } from '../shared'
import { ChartTrigger } from '../components/chart-trigger'
import { ChordNodeDatum } from '@unovis/ts'

const chordSeries = () => {
  const nodes: ChordRegion[] = [
    { id: 'North', name: 'North' },
    { id: 'South', name: 'South' },
    { id: 'West', name: 'West' },
    { id: 'East', name: 'East' },
  ]
  const randomFlow = () => Math.round(10 + Math.random() * 22)
  const links: ChordLinkDatum[] = [
    { source: 'North', target: 'South', value: randomFlow() },
    { source: 'North', target: 'West', value: randomFlow() },
    { source: 'South', target: 'East', value: randomFlow() },
    { source: 'South', target: 'North', value: randomFlow() },
    { source: 'West', target: 'East', value: randomFlow() },
    { source: 'East', target: 'North', value: randomFlow() },
  ]
  return { nodes, links }
}

export const ChordBlock = (): Renderable => {
  const chordData = prop(chordSeries())
  const refresh = () => chordData.set(chordSeries())

  return html.div(
    ChartTrigger('Chord', 'Shuffle', refresh),
    html.div(
      attr.class('chart'),
      UnovisSingleContainer<ChordRegion, ReturnType<typeof chordSeries>>(
        {
          data: chordData as unknown as ReturnType<typeof chordSeries>,
          config: { margin: { top: 12, right: 12, bottom: 12, left: 12 } },
        },
        UVisChordDiagram<ChordRegion, ChordLinkDatum>({
          config: {
            nodeLabel: (d: ChordNodeDatum<ChordRegion>) =>
              'name' in d
                ? (d.name ?? d.id ?? '')
                : 'key' in d
                  ? (d.key ?? '')
                  : '',
            nodeColor: (d: ChordNodeDatum<ChordRegion>) => {
              const id = 'id' in d ? d.id : 'key' in d ? d.key : ''
              return colorForKey(id ?? '')
            },
            linkColor: (l: ChordLinkDatum) => {
              const source =
                (l.source as { id?: string } | undefined)?.id ??
                String(l.source ?? '')
              return colorForKey(source)
            },
          },
        })
      )
    )
  )
}
