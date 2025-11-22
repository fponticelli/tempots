import { attr, html, prop } from '@tempots/dom'
import { AxisType, GroupedBar } from '@unovis/ts'
import {
  UVisAxis,
  UVisGroupedBar,
  UVisPlotBand,
  UVisPlotLine,
  UVisTooltip,
  UnovisXYContainer,
} from '@tempots/unovis'
import type { Grouped } from '../types'
import { ChartTrigger } from '../components/chart-trigger'

const groupedSeries = (): Grouped[] => {
  const quarters = ['Q1', 'Q2', 'Q3', 'Q4']
  const volatility = 8 + Math.random() * 12
  return quarters.map((quarter, idx) => {
    const seasonBias = idx === 1 ? 1.15 : idx === 2 ? 0.85 : 1
    const base = 14 + Math.random() * volatility
    return {
      quarter,
      index: idx,
      north: Math.round(base * seasonBias + Math.random() * 10),
      south: Math.round(base * 0.8 * seasonBias + Math.random() * 8),
      west: Math.round(base * 0.6 * seasonBias + Math.random() * 6),
    }
  })
}

export const GroupedBarsChart = () => {
  const groupedData = prop<Grouped[]>(groupedSeries())
  const refresh = () => groupedData.set(groupedSeries())

  return html.div(
    ChartTrigger('Grouped bars', 'Refresh', refresh),
    html.div(
      attr.class('chart'),
      UnovisXYContainer<Grouped>(
        {
          data: groupedData,
          config: {
            margin: { top: 12, right: 12, bottom: 32, left: 48 },
            yDomain: [0, 80],
          },
        },
        UVisGroupedBar<Grouped>({
          config: {
            x: d => d.index,
            y: [d => d.north, d => d.south, d => d.west],
            color: (_, i) => ['#4ade80', '#60a5fa', '#fb7185'][i ?? 0],
            groupPadding: 0.12,
            barPadding: 0.1,
            roundedCorners: 3,
          },
        }),
        UVisPlotLine<Grouped>({
          config: {
            axis: AxisType.Y,
            value: 20,
            color: '#f97316',
            labelText: 'Target',
            lineStyle: [4, 4],
          },
        }),
        UVisPlotBand<Grouped>({
          config: {
            axis: AxisType.Y,
            from: 12,
            to: 16,
            color: 'rgba(59,130,246,0.12)',
            labelText: 'Comfort',
          },
        }),
        UVisAxis<Grouped>({
          role: 'x',
          config: {
            tickFormat: (_, i) => groupedData.get()[i ?? 0]?.quarter ?? '',
          },
        }),
        UVisAxis<Grouped>({ role: 'y' }),
        UVisTooltip<Grouped>({
          config: {
            triggers: {
              [GroupedBar.selectors.bar]: d =>
                `<strong>${d.quarter}</strong><br/>North: ${d.north}<br/>South: ${d.south}<br/>West: ${d.west}`,
            },
          },
        })
      )
    )
  )
}
