import { attr, html, prop } from '@tempots/dom'
import { StackedBar } from '@unovis/ts'
import {
  UVisAxis,
  UVisStackedBar,
  UVisTooltip,
  UnovisXYContainer,
} from '@tempots/unovis'
import type { Stack } from '../types'
import { ChartTrigger } from '../components/chart-trigger'

const stackedSeries = (): Stack[] => {
  const trend = Math.random() * 0.6 + 0.7
  return Array.from({ length: 7 }, (_, i) => {
    const base = 16 + Math.random() * 20
    const lift = (i - 3) * trend
    return {
      day: i + 1,
      a: Math.round(base + lift + Math.random() * 14),
      b: Math.round(base * 0.8 + lift + Math.random() * 10),
      c: Math.round(base * 0.6 + lift + Math.random() * 8),
    }
  })
}

export const StackedBarsChart = () => {
  const stackedData = prop<Stack[]>(stackedSeries())
  const refresh = () => stackedData.set(stackedSeries())

  return html.div(
    ChartTrigger('Stacked bars', 'Refresh', refresh),
    html.div(
      attr.class('chart'),
      UnovisXYContainer<Stack>(
        {
          data: stackedData,
          config: {
            margin: { top: 12, right: 12, bottom: 32, left: 48 },
            yDomain: [0, 160],
          },
        },
        UVisStackedBar<Stack>({
          config: {
            x: d => d.day,
            y: [d => d.a, d => d.b, d => d.c],
            color: (_, i) => ['#38bdf8', '#c084fc', '#f59e0b'][i ?? 0],
            barPadding: 0.15,
            roundedCorners: 4,
          },
        }),
        UVisAxis<Stack>({ role: 'x' }),
        UVisAxis<Stack>({ role: 'y' }),
        UVisTooltip<Stack>({
          config: {
            triggers: {
              [StackedBar.selectors.bar]: d => {
                const total = d.a + d.b + d.c
                return `<strong>Day ${d.day}</strong><br/>A: ${d.a}<br/>B: ${d.b}<br/>C: ${d.c}<br/>Total: ${total}`
              },
            },
          },
        })
      )
    )
  )
}
