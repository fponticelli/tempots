import { attr, html, prop } from '@tempots/dom'
import { UnovisSingleContainer, UVisSankey } from '@tempots/unovis'
import type { Renderable } from '@tempots/dom'
import type { SankeyLinkDatum, SankeyNodeDatum } from '../types'
import { ChartTrigger } from '../components/chart-trigger'

const sankeySeries = () => {
  const nodes: SankeyNodeDatum[] = [
    { id: 'Research', group: 'Stage' },
    { id: 'Design', group: 'Stage' },
    { id: 'Prototype', group: 'Stage' },
    { id: 'Build', group: 'Stage' },
    { id: 'QA', group: 'Stage' },
    { id: 'Deploy', group: 'Stage' },
    { id: 'Launch', group: 'Stage' },
    { id: 'Support', group: 'Stage' },
    { id: 'Team A', group: 'Team' },
    { id: 'Team B', group: 'Team' },
    { id: 'Team C', group: 'Team' },
    { id: 'Team D', group: 'Team' },
    { id: 'Design Ops', group: 'Team' },
    { id: 'Data', group: 'Team' },
    { id: 'Security', group: 'Team' },
  ]
  const jitter = (base: number, span: number) =>
    Math.max(1, Math.round(base + (Math.random() - 0.5) * span))
  const links: SankeyLinkDatum[] = [
    { source: 'Team A', target: 'Research', value: jitter(9, 8) },
    { source: 'Team B', target: 'Research', value: jitter(7, 8) },
    { source: 'Team A', target: 'Design', value: jitter(8, 6) },
    { source: 'Team B', target: 'Design', value: jitter(7, 6) },
    { source: 'Team C', target: 'Prototype', value: jitter(8, 6) },
    { source: 'Design Ops', target: 'Prototype', value: jitter(6, 5) },
    { source: 'Prototype', target: 'Build', value: jitter(10, 6) },
    { source: 'Team A', target: 'Build', value: jitter(10, 6) },
    { source: 'Team B', target: 'Build', value: jitter(8, 6) },
    { source: 'Team C', target: 'QA', value: jitter(9, 6) },
    { source: 'Security', target: 'QA', value: jitter(6, 4) },
    { source: 'Design', target: 'QA', value: jitter(5, 4) },
    { source: 'Build', target: 'QA', value: jitter(8, 6) },
    { source: 'QA', target: 'Deploy', value: jitter(9, 6) },
    { source: 'Deploy', target: 'Launch', value: jitter(7, 5) },
    { source: 'Data', target: 'Deploy', value: jitter(5, 4) },
    { source: 'Data', target: 'Support', value: jitter(4, 4) },
    { source: 'Security', target: 'Deploy', value: jitter(5, 4) },
    { source: 'Launch', target: 'Support', value: jitter(6, 4) },
    { source: 'Team D', target: 'Support', value: jitter(7, 6) },
  ]
  return { nodes, links }
}

export const SankeyBlock = (): Renderable => {
  const sankeyData = prop(sankeySeries())
  const refresh = () => sankeyData.set(sankeySeries())

  return html.div(
    ChartTrigger('Sankey', 'Shuffle', refresh),
    html.div(
      attr.class('chart single wide'),
      UnovisSingleContainer<
        SankeyNodeDatum,
        { nodes: SankeyNodeDatum[]; links: SankeyLinkDatum[] }
      >(
        {
          data: sankeyData,
          config: { margin: { top: 12, right: 12, bottom: 12, left: 12 } },
        },
        UVisSankey<SankeyNodeDatum, SankeyLinkDatum>({
          config: {
            label: (d: SankeyNodeDatum) => d.id,
            nodeColor: (d: { group?: string }) =>
              d.group === 'Stage' ? '#38bdf8' : '#22c55e',
            linkColor: (l: { source?: { group?: string } }) =>
              l.source?.group === 'Team' ? '#22c55e' : '#60a5fa',
            nodePadding: 18,
            nodeWidth: 16,
          },
        })
      )
    )
  )
}
