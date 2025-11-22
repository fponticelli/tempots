import { attr, html, prop } from '@tempots/dom'
import { CurveType, FreeBrushMode } from '@unovis/ts'
import {
  UVisArea,
  UVisAxis,
  UVisBrush,
  UVisCrosshair,
  UVisFreeBrush,
  UVisScatter,
  UVisTooltip,
  UnovisXYContainer,
} from '@tempots/unovis'
import type { Bubble } from '../types'
import { ChartTrigger } from '../components/chart-trigger'

const clusters = (size: number): Bubble[] => {
  const bands = ['A', 'B', 'C']
  const pick = () => bands[Math.floor(Math.random() * bands.length)]
  const spread = 5 + Math.random() * 6
  const bandShift = () => (Math.random() - 0.5) * 4
  const unsorted = Array.from({ length: size }, () => {
    const band = pick()
    const centerX = (band === 'A' ? 4 : band === 'B' ? 14 : 24) + bandShift()
    const centerY = (band === 'A' ? 4 : band === 'B' ? 12 : 6) + bandShift()
    const x = centerX + Math.random() * spread - spread / 2
    const y = centerY + Math.random() * spread - spread / 2
    const intensity = Math.max(1, 12 - Math.abs(y - centerY) * 0.9)
    return { x, y, band, intensity }
  })
  return unsorted.slice().sort((a: Bubble, b: Bubble) => a.x - b.x)
}

export const ScatterClustersChart = () => {
  const scatterData = prop<Bubble[]>(clusters(80))
  const refresh = () => scatterData.set(clusters(80))

  return html.div(
    ChartTrigger('Scatter clusters', 'Shuffle', refresh),
    html.div(
      attr.class('chart'),
      UnovisXYContainer<Bubble>(
        {
          data: scatterData,
          config: { margin: { top: 12, right: 12, bottom: 32, left: 48 } },
        },
        UVisArea<Bubble>({
          config: {
            x: d => d.x,
            y: d => d.y,
            curveType: CurveType.MonotoneX,
            opacity: 0.12,
          },
        }),
        UVisScatter<Bubble>({
          config: {
            x: d => d.x,
            y: d => d.y,
            size: d => d.intensity + 4,
            color: d =>
              d.band === 'A'
                ? '#60a5fa'
                : d.band === 'B'
                  ? '#a78bfa'
                  : '#f97316',
            strokeColor: () => '#0f172a',
            strokeWidth: 1,
          },
        }),
        UVisAxis<Bubble>({ role: 'x' }),
        UVisAxis<Bubble>({ role: 'y' }),
        UVisCrosshair<Bubble>({
          config: {
            snapToData: true,
            x: d => d.x,
            y: d => d.y,
            template: d =>
              d
                ? `<strong>Band ${d.band}</strong><br/>x: ${d.x.toFixed(1)} / y: ${d.y.toFixed(1)}<br/>Intensity ${d.intensity.toFixed(0)}`
                : '',
          },
        }),
        UVisFreeBrush<Bubble>({
          config: {
            mode: FreeBrushMode.XY,
            selectionMinLength: [1, 1],
          },
        }),
        UVisBrush<Bubble>({
          config: {
            selectionMinLength: 1,
          },
        }),
        UVisTooltip<Bubble>()
      )
    )
  )
}
