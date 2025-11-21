import { attr, html, prop } from '@tempots/dom'
import { CurveType } from '@unovis/ts'
import {
  UVisAxis,
  UVisLine,
  UVisTooltip,
  UnovisXYContainer,
} from '@tempots/unovis'
import type { Point } from '../types'
import { ChartTrigger } from '../components/chart-trigger'

const sineWave = (size: number): Point[] => {
  const amplitude = 6 + Math.random() * 12
  const frequency = 6 + Math.random() * 6
  const noise = 2 + Math.random() * 4
  const phase = Math.random() * Math.PI * 2
  return Array.from({ length: size }, (_, i) => ({
    x: i,
    y:
      Math.sin((i + phase) / frequency) * amplitude +
      (Math.random() - 0.5) * noise,
  }))
}

export const SineWaveChart = () => {
  const smoothData = prop<Point[]>(sineWave(50))
  const refresh = () => smoothData.set(sineWave(50))

  return html.div(
    ChartTrigger('Sine wave', 'Regenerate', refresh),
    html.div(
      attr.class('chart'),
      UnovisXYContainer<Point>(
        {
          data: smoothData,
          config: { margin: { top: 12, right: 12, bottom: 32, left: 48 } },
        },
        UVisLine<Point>({
          config: {
            x: d => d.x,
            y: d => d.y,
            curveType: CurveType.MonotoneX,
            lineWidth: 2,
            color: () => '#22d3ee',
          },
        }),
        UVisAxis<Point>({ role: 'x' }),
        UVisAxis<Point>({ role: 'y' }),
        UVisTooltip<Point>()
      )
    )
  )
}
