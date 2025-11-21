import { attr, html, prop } from '@tempots/dom'
import type { Renderable } from '@tempots/dom'
import {
  UVisBulletLegend,
  UVisFlowLegend,
  UVisRollingPinLegend,
} from '@tempots/unovis'
import { BulletShape } from '@unovis/ts/components/bullet-legend/types'

export const LegendsSection = (): Renderable => {
  const flowLegendData = prop<string[]>([
    'Northbound',
    'Southbound',
    'Westbound',
  ])
  const bulletLegendItems = prop<
    { name: string; color: string; shape?: BulletShape }[]
  >([
    { name: 'Servers', color: '#2563eb' },
    { name: 'Clients', color: '#22c55e' },
    { name: 'Services', color: '#f97316' },
    { name: 'Infra', color: '#a855f7', shape: BulletShape.Triangle },
  ])

  return html.div(
    html.div(
      attr.class('controls'),
      html.div(attr.class('control'), html.span('Legends'))
    ),
    html.div(
      attr.class('legend-card'),
      html.div(
        attr.class('legend-text'),
        html.div(attr.class('legend-title'), 'Flow directions'),
        html.div(
          attr.class('legend-subtitle'),
          'Arrow, color and labels follow your data'
        )
      ),
      html.div(
        attr.class('legend flow'),
        UVisFlowLegend({
          config: {
            items: flowLegendData.get(),
            lineColor: '#0ea5e9',
            arrowColor: '#22c55e',
            labelColor: '#0f172a',
          },
        })
      )
    ),
    html.div(
      attr.class('legend-card'),
      html.div(
        attr.class('legend-text'),
        html.div(attr.class('legend-title'), 'Entities'),
        html.div(attr.class('legend-subtitle'), 'Mix shapes and states')
      ),
      html.div(
        attr.class('legend bullet'),
        UVisBulletLegend({
          config: {
            items: bulletLegendItems.get(),
            bulletSize: '16px',
            bulletSpacing: 6,
            labelFontSize: '13px',
          },
        })
      )
    ),
    html.div(
      attr.class('legend-card'),
      html.div(
        attr.class('legend-text'),
        html.div(attr.class('legend-title'), 'Value band'),
        html.div(
          attr.class('legend-subtitle'),
          'Gradient categories from low to high'
        )
      ),
      html.div(
        attr.class('legend rolling'),
        UVisRollingPinLegend({
          config: {
            rects: ['#2563eb', '#22c55e', '#f97316', '#f59e0b'],
            leftLabelText: 'Low',
            rightLabelText: 'High',
          },
        })
      )
    )
  )
}
