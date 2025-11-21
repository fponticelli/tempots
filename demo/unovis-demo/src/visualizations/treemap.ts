import { attr, html, prop } from '@tempots/dom'
import { UnovisSingleContainer, UVisTreemap } from '@tempots/unovis'
import type { Renderable } from '@tempots/dom'
import type { TreemapDatum } from '../types'
import { colorForKey } from '../shared'
import { ChartTrigger } from '../components/chart-trigger'

const treemapSeries = (): TreemapDatum[] => {
  const regionTilt = {
    Americas: 0.8 + Math.random() * 1.4,
    Asia: 0.8 + Math.random() * 1.4,
    Europe: 0.8 + Math.random() * 1.4,
  }
  const value = (
    region: keyof typeof regionTilt,
    base: number,
    wiggle: number
  ) => Math.round(base * regionTilt[region] + (Math.random() - 0.5) * wiggle)

  return [
    { region: 'Americas', country: 'USA', value: value('Americas', 30, 12) },
    { region: 'Americas', country: 'Canada', value: value('Americas', 16, 10) },
    { region: 'Americas', country: 'Mexico', value: value('Americas', 14, 10) },
    { region: 'Asia', country: 'Japan', value: value('Asia', 20, 10) },
    { region: 'Asia', country: 'India', value: value('Asia', 22, 14) },
    { region: 'Asia', country: 'China', value: value('Asia', 26, 12) },
    { region: 'Europe', country: 'UK', value: value('Europe', 16, 12) },
    { region: 'Europe', country: 'Germany', value: value('Europe', 18, 10) },
    { region: 'Europe', country: 'France', value: value('Europe', 14, 10) },
  ]
}

export const TreemapBlock = (): Renderable => {
  const treemapData = prop<TreemapDatum[]>(treemapSeries())
  const refresh = () => treemapData.set(treemapSeries())

  return html.div(
    ChartTrigger('Treemap', 'Shuffle', refresh),
    html.div(
      attr.class('chart single'),
      UnovisSingleContainer<TreemapDatum>(
        {
          data: treemapData,
          config: { margin: { top: 12, right: 12, bottom: 12, left: 12 } },
        },
        UVisTreemap<TreemapDatum>({
          config: {
            layers: [d => d.region, d => d.country],
            value: d => d.value,
            tilePadding: 4,
            tileLabel: node => {
              const data = node.data as TreemapDatum | undefined
              const label = data?.country ?? data?.region ?? 'Item'
              return `${label}: ${node.value ?? 0}`
            },
            tileColor: node => {
              const parentData = node.parent?.data as TreemapDatum | undefined
              const region = parentData?.region ?? 'region'
              const country =
                (node.data as TreemapDatum | undefined)?.country ?? 'country'
              return colorForKey(`${region}-${country}`)
            },
          },
        })
      )
    )
  )
}
