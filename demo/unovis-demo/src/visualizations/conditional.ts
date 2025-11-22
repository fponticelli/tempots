import { attr, html, on, prop } from '@tempots/dom'
import { ChartTrigger } from '../components/chart-trigger'
import { CurveType } from '@unovis/ts'
import {
  UVisAxis,
  UVisLine,
  UVisTooltip,
  UVWhen,
  UnovisXYContainer,
} from '@tempots/unovis'
import type { Point } from '../types'

const makeSeries = (): Point[] =>
  Array.from({ length: 20 }, (_, i) => ({
    x: i,
    y: Math.sin(i / 3) * 8 + (Math.random() - 0.5) * 3,
  }))

export const ConditionalChart = () => {
  const data = prop<Point[]>(makeSeries())
  const visible = prop(true)
  const toggle = () => visible.update(v => !v)
  const refresh = () => data.set(makeSeries())

  return html.div(
    attr.class('panel'),
    ChartTrigger('UVWhen demo', 'Regenerate', refresh),
    html.div(
      attr.class('controls'),
      html.div(
        attr.class('control'),
        html.span('Chart visibility'),
        html.button(
          on.click(toggle),
          visible.map(v => (v ? 'Hide' : 'Show'))
        )
      )
    ),
    UVWhen(visible, () =>
      html.div(
        attr.class('chart'),
        UnovisXYContainer<Point>(
          {
            data,
            config: { margin: { top: 12, right: 12, bottom: 32, left: 48 } },
          },
          UVisLine<Point>({
            config: {
              x: d => d.x,
              y: d => d.y,
              curveType: CurveType.MonotoneX,
              lineWidth: 2.2,
              color: () => '#10b981',
            },
          }),
          UVisAxis<Point>({ role: 'x' }),
          UVisAxis<Point>({ role: 'y' }),
          UVisTooltip<Point>()
        )
      )
    )
  )
}
