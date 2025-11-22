import { attr, html, prop } from '@tempots/dom'
import { ChartTrigger } from '../components/chart-trigger'
import { AxisType, Line } from '@unovis/ts'
import {
  UVisAnnotations,
  UVisAxis,
  UVisCrosshair,
  UVisLine,
  UVisPlotBand,
  UVisPlotLine,
  UVisTooltip,
  UnovisXYContainer,
} from '@tempots/unovis'
import type { Point } from '../types'

const randomWalk = (size: number): Point[] => {
  let y = (Math.random() - 0.5) * 10
  const volatility = 6 + Math.random() * 12
  const drift = (Math.random() - 0.5) * 0.4
  return Array.from({ length: size }, (_, i) => {
    y += Math.random() * volatility - volatility / 2 + drift
    return { x: i, y: Math.round(y * 100) / 100 }
  })
}

export const RandomWalkChart = () => {
  const walkPoints = 80
  const lineData = prop<Point[]>(randomWalk(walkPoints))
  const refresh = () => lineData.set(randomWalk(walkPoints))

  return html.div(
    ChartTrigger('Random walk', 'Regenerate', refresh),
    html.div(
      attr.class('chart'),
      UnovisXYContainer<Point>(
        {
          data: lineData,
          config: { margin: { top: 24, right: 12, bottom: 12, left: 24 } },
        },
        UVisLine<Point>({
          config: {
            x: d => d.x,
            y: d => d.y,
            lineWidth: 2.5,
          },
        }),
        UVisCrosshair<Point>({
          config: {
            x: d => d.x,
            y: d => d.y,
            template: d =>
              d && d.y != null
                ? `<strong>t=${d.x}</strong><br/>value: ${d.y.toFixed(2)}`
                : '',
          },
        }),
        UVisAxis<Point>({ role: 'x' }),
        UVisAxis<Point>({ role: 'y' }),
        UVisAnnotations<Point>({
          config: {
            items: [
              {
                content: 'Mean reversion zone',
                x: 400,
                y: 0,
                width: 200,
                height: 12,
              },
            ],
          },
        }),
        UVisPlotBand<Point>({
          config: {
            axis: AxisType.Y,
            from: -5,
            to: 5,
            color: 'rgba(34,197,94,0.14)',
            labelText: 'Comfort zone',
          },
        }),
        UVisPlotLine<Point>({
          config: {
            axis: AxisType.Y,
            value: 0,
            color: '#f97316',
            lineStyle: [6, 12],
            labelText: 'Baseline',
          },
        }),
        UVisTooltip<Point>({
          config: {
            triggers: {
              [Line.selectors.linePath]: () => null,
              [Line.selectors.lineSelectionHelper]: () => null,
            },
            showDelay: 80,
          },
        })
      )
    )
  )
}
