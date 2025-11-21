import { attr, html, prop } from '@tempots/dom'
import { UVisNestedDonut, UnovisSingleContainer } from '@tempots/unovis'
import type { Renderable } from '@tempots/dom'
import type { NestedSlice } from '../types'
import { colorForKey } from '../shared'
import { ChartTrigger } from '../components/chart-trigger'

const nestedDonutSeries = (): NestedSlice[] => {
  const categoryTilt: Record<string, number> = {
    Mobile: 0.9 + Math.random() * 1.3,
    Web: 0.9 + Math.random() * 1.3,
    Services: 0.9 + Math.random() * 1.3,
  }

  const value = (
    category: keyof typeof categoryTilt,
    base: number,
    wiggle: number
  ) =>
    Math.round(base * categoryTilt[category] + (Math.random() - 0.5) * wiggle)

  return [
    { category: 'Mobile', subcategory: 'iOS', value: value('Mobile', 42, 18) },
    {
      category: 'Mobile',
      subcategory: 'Android',
      value: value('Mobile', 52, 20),
    },
    { category: 'Web', subcategory: 'Desktop', value: value('Web', 36, 16) },
    { category: 'Web', subcategory: 'Tablet', value: value('Web', 16, 14) },
    {
      category: 'Services',
      subcategory: 'API',
      value: value('Services', 22, 16),
    },
    {
      category: 'Services',
      subcategory: 'Integrations',
      value: value('Services', 18, 12),
    },
  ]
}

export const NestedDonutBlock = (): Renderable => {
  const nestedData = prop<NestedSlice[]>(nestedDonutSeries())
  const refresh = () => nestedData.set(nestedDonutSeries())

  return html.div(
    ChartTrigger('Nested donut', 'Shuffle', refresh),
    html.div(
      attr.class('chart'),
      UnovisSingleContainer<NestedSlice>(
        {
          data: nestedData,
          config: { margin: { top: 12, right: 12, bottom: 12, left: 12 } },
        },
        UVisNestedDonut<NestedSlice>({
          config: {
            layers: [d => d.category, d => d.subcategory],
            value: d => d.value,
            centralLabel: 'Channels',
            segmentLabel: segment => {
              const data = segment.data as Partial<NestedSlice> | undefined
              return data?.subcategory ?? data?.category ?? ''
            },
            segmentColor: segment => {
              const parentData = segment.parent?.data as
                | Partial<NestedSlice>
                | undefined
              const parentKey = parentData?.category ?? ''
              const subKey =
                (segment.data as Partial<NestedSlice> | undefined)
                  ?.subcategory ?? ''
              return colorForKey(`${parentKey}-${subKey}`)
            },
          },
        })
      )
    )
  )
}
