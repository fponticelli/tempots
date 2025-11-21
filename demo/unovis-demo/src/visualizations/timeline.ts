import { attr, html, prop } from '@tempots/dom'
import {
  UVisAxis,
  UVisTimeline,
  UVisTooltip,
  UnovisXYContainer,
} from '@tempots/unovis'
import type { TimelineItem } from '../types'
import { ChartTrigger } from '../components/chart-trigger'

const timelineSeries = (): TimelineItem[] => {
  const lanes = ['Discovery', 'Build', 'Launch']
  const jitter = Math.random() * 2
  return Array.from({ length: 9 }, (_, i) => {
    const lane = lanes[i % lanes.length]
    const start = i * (2.4 + Math.random() * 1.6) + jitter
    const duration = 1.8 + Math.random() * 4.2
    const palette = ['#22c55e', '#3b82f6', '#f97316']
    return {
      start,
      duration,
      lane,
      label: `${lane} #${i + 1}`,
      color: palette[i % palette.length],
    }
  })
}

export const TimelineChart = () => {
  const timelineData = prop<TimelineItem[]>(timelineSeries())
  const refresh = () => timelineData.set(timelineSeries())

  return html.div(
    ChartTrigger('Timeline', 'Shuffle', refresh),
    html.div(
      attr.class('chart'),
      UnovisXYContainer<TimelineItem>(
        {
          data: timelineData,
          config: { margin: { top: 12, right: 12, bottom: 32, left: 48 } },
        },
        UVisTimeline<TimelineItem>({
          config: {
            x: d => d.start,
            lineDuration: d => d.duration,
            lineRow: d => d.lane,
            color: d => d.color,
            lineWidth: 14,
            rowHeight: 28,
            showRowLabels: true,
            rowLabelFormatter: lane => lane,
          },
        }),
        UVisAxis<TimelineItem>({
          role: 'x',
          config: {
            tickFormat: (_, i) => `${i}`,
          },
        }),
        UVisTooltip<TimelineItem>()
      )
    )
  )
}
