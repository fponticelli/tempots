import { attr, html, prop } from '@tempots/dom'
import type { GraphConfigInterface } from '@unovis/ts'
import { GraphLayoutType } from '@unovis/ts'
import { UVisGraph, UnovisSingleContainer } from '@tempots/unovis'
import type { Renderable } from '@tempots/dom'
import type { GraphLink, GraphNode } from '../types'
import { colorForKey } from '../shared'
import { ChartTrigger } from '../components/chart-trigger'

const graphSeries = () => {
  const jitter = (base: number, span: number) =>
    Math.max(8, Math.round(base + (Math.random() - 0.5) * span))
  const nodes: GraphNode[] = [
    { id: 'API', group: 'Service', size: jitter(18, 10) },
    { id: 'Auth', group: 'Service', size: jitter(16, 10) },
    { id: 'Billing', group: 'Service', size: jitter(14, 8) },
    { id: 'DB', group: 'Data', size: jitter(20, 10) },
    { id: 'Cache', group: 'Data', size: jitter(12, 6) },
    { id: 'Search', group: 'Data', size: jitter(15, 8) },
    { id: 'Web', group: 'Client', size: jitter(16, 8) },
    { id: 'Mobile', group: 'Client', size: jitter(16, 8) },
    { id: 'Queue', group: 'Infra', size: jitter(14, 8) },
    { id: 'Worker', group: 'Infra', size: jitter(14, 8) },
    { id: 'Monitor', group: 'Infra', size: jitter(12, 6) },
  ]

  const coreLinks: GraphLink[] = [
    { source: 'Web', target: 'API', intensity: jitter(8, 4) },
    { source: 'Mobile', target: 'API', intensity: jitter(7, 4) },
    { source: 'API', target: 'Auth', intensity: jitter(6, 4) },
    { source: 'API', target: 'Billing', intensity: jitter(5, 4) },
    { source: 'API', target: 'DB', intensity: jitter(9, 6) },
    { source: 'API', target: 'Cache', intensity: jitter(9, 6) },
    { source: 'API', target: 'Search', intensity: jitter(4, 3) },
    { source: 'Billing', target: 'DB', intensity: jitter(7, 4) },
    { source: 'Billing', target: 'Queue', intensity: jitter(5, 3) },
    { source: 'Queue', target: 'Worker', intensity: jitter(6, 4) },
    { source: 'Worker', target: 'DB', intensity: jitter(5, 3) },
    { source: 'Worker', target: 'Monitor', intensity: jitter(3, 2) },
    { source: 'Auth', target: 'DB', intensity: jitter(6, 3) },
    { source: 'Auth', target: 'Cache', intensity: jitter(5, 3) },
    { source: 'Search', target: 'DB', intensity: jitter(4, 3) },
    { source: 'Search', target: 'Cache', intensity: jitter(4, 3) },
  ]

  const extraLinks: GraphLink[] = [
    { source: 'Web', target: 'Cache', intensity: jitter(4, 3) },
    { source: 'Mobile', target: 'Search', intensity: jitter(4, 3) },
    { source: 'Monitor', target: 'API', intensity: jitter(3, 2) },
    { source: 'Queue', target: 'Monitor', intensity: jitter(4, 2) },
    { source: 'Worker', target: 'Search', intensity: jitter(3, 2) },
  ].filter(() => Math.random() > 0.45)

  return { nodes, links: [...coreLinks, ...extraLinks] }
}

const makeGraphConfig = (): Partial<
  GraphConfigInterface<GraphNode, GraphLink>
> => {
  const layoutOptions = [
    GraphLayoutType.Elk,
    GraphLayoutType.Force,
    GraphLayoutType.Concentric,
  ]
  const layoutType =
    layoutOptions[Math.floor(Math.random() * layoutOptions.length)]
  const elkDirections: Array<'RIGHT' | 'DOWN' | 'UP'> = ['RIGHT', 'DOWN', 'UP']
  const layoutElkSettings =
    layoutType === GraphLayoutType.Elk
      ? {
          'elk.direction':
            elkDirections[Math.floor(Math.random() * elkDirections.length)],
        }
      : undefined

  return {
    nodeLabel: n => n.id,
    nodeSize: n => n.size,
    nodeFill: n => colorForKey(n.group),
    linkWidth: l => l.intensity * 0.6,
    layoutType,
    layoutElkSettings,
    layoutAutofit: true,
    linkArrow: true,
    fitViewPadding: 48,
  }
}

export const GraphBlock = (): Renderable => {
  const graphData = prop(graphSeries())
  const graphConfig =
    prop<Partial<GraphConfigInterface<GraphNode, GraphLink>>>(makeGraphConfig())
  const refresh = () => {
    graphData.set(graphSeries())
    graphConfig.set(makeGraphConfig())
  }

  return html.div(
    ChartTrigger('Graph', 'Shuffle', refresh),
    html.div(
      attr.class('chart'),
      UnovisSingleContainer<GraphNode, ReturnType<typeof graphSeries>>(
        {
          data: graphData as unknown as ReturnType<typeof graphSeries>,
          config: { margin: { top: 12, right: 12, bottom: 12, left: 12 } },
        },
        UVisGraph<GraphNode, GraphLink>({
          config: graphConfig,
        })
      )
    )
  )
}
