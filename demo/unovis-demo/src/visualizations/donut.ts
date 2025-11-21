import { attr, html, prop } from '@tempots/dom'
import { UVisDonut, UnovisSingleContainer, UVisTooltip } from '@tempots/unovis'
import type { Renderable } from '@tempots/dom'
import type { Slice } from '../types'
import { ChartTrigger } from '../components/chart-trigger'

const initialSensors = [
  'Sensor A',
  'Sensor B',
  'Sensor C',
  'Sensor D',
  'Sensor E',
]

const makeSlices = (): Slice[] =>
  initialSensors.map(label => ({
    label,
    value: Math.round(18 + Math.random() * 32),
  }))

export const DonutBlock = (): Renderable => {
  const donutData = prop<Slice[]>([
    { label: 'Sensor A', value: 34 },
    { label: 'Sensor B', value: 28 },
    { label: 'Sensor C', value: 18 },
    { label: 'Sensor D', value: 12 },
    { label: 'Sensor E', value: 8 },
  ])
  const refresh = () => donutData.set(makeSlices())

  return html.div(
    ChartTrigger('Donut', 'Shuffle', refresh),
    html.div(
      attr.class('chart'),
      UnovisSingleContainer<Slice>(
        {
          data: donutData,
          config: { margin: { top: 12, right: 12, bottom: 12, left: 12 } },
        },
        UVisDonut<Slice>({
          config: {
            value: d => d.value,
            padAngle: 0.05,
            cornerRadius: 8,
          },
        }),
        UVisTooltip<Slice>()
      )
    )
  )
}
