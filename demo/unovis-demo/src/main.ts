import { attr, html, on, prop, render } from '@tempots/dom'
import { CurveType } from '@unovis/ts'
import {
  UnovisAxis,
  UnovisBrush,
  UnovisCrosshair,
  UnovisArea,
  UnovisLine,
  UnovisScatter,
  UnovisTooltip,
  UnovisXYContainer,
} from '@tempots/unovis'

type Point = { x: number; y: number }
type Bubble = { x: number; y: number; band: string; intensity: number }

const randomWalk = (size: number): Point[] => {
  let y = 0
  return Array.from({ length: size }, (_, i) => {
    y += Math.random() * 8 - 3
    return { x: i, y: Math.round(y * 100) / 100 }
  })
}

const sineWave = (size: number): Point[] =>
  Array.from({ length: size }, (_, i) => ({
    x: i,
    y: Math.sin(i / 8) * 10 + Math.random() * 2,
  }))

const clusters = (size: number): Bubble[] => {
  const bands = ['A', 'B', 'C']
  const pick = () => bands[Math.floor(Math.random() * bands.length)]
  return Array.from({ length: size }, () => {
    const band = pick()
    const centerX = band === 'A' ? 4 : band === 'B' ? 14 : 24
    const centerY = band === 'A' ? 4 : band === 'B' ? 12 : 6
    const x = centerX + Math.random() * 6 - 3
    const y = centerY + Math.random() * 6 - 3
    const intensity = Math.max(1, 10 - Math.abs(y - centerY) * 0.8)
    return { x, y, band, intensity }
  })
}

function App() {
  const lineData = prop<Point[]>(randomWalk(40))
  const smoothData = prop<Point[]>(sineWave(50))
  const scatterData = prop<Bubble[]>(clusters(80))

  const refreshWalk = () => lineData.set(randomWalk(40))
  const refreshSine = () => smoothData.set(sineWave(50))
  const refreshScatter = () => scatterData.set(clusters(80))

  return html.div(
    attr.class('app'),
    html.div(
      attr.class('panel header'),
      html.div(attr.class('title'), 'Tempo × Unovis'),
      html.div(attr.class('pill'), 'Reactive charts with renderables')
    ),
    html.div(
      attr.class('panel'),
      html.div(
        attr.class('controls'),
        html.div(
          attr.class('control'),
          html.span('Random walk'),
          html.button(on.click(refreshWalk), 'Regenerate')
        )
      ),
      UnovisXYContainer<Point>(
        {
          data: lineData,
          config: { margin: { top: 12, right: 12, bottom: 32, left: 48 } },
          className: 'chart',
        },
        UnovisLine<Point>({
          config: {
            x: d => d.x,
            y: d => d.y,
            lineWidth: 2.5,
          },
        }),
        UnovisAxis<Point>({ role: 'x' }),
        UnovisAxis<Point>({ role: 'y' }),
        UnovisTooltip<Point>()
      ),
      html.div(
        attr.class('controls'),
        html.div(
          attr.class('control'),
          html.span('Sine wave'),
          html.button(on.click(refreshSine), 'Regenerate')
        )
      ),
      UnovisXYContainer<Point>(
        {
          data: smoothData,
          config: { margin: { top: 12, right: 12, bottom: 32, left: 48 } },
          className: 'chart',
        },
        UnovisLine<Point>({
          config: {
            x: d => d.x,
            y: d => d.y,
            curveType: CurveType.MonotoneX,
            lineWidth: 2,
            color: () => '#22d3ee',
          },
        }),
        UnovisAxis<Point>({ role: 'x' }),
        UnovisAxis<Point>({ role: 'y' }),
        UnovisTooltip<Point>()
      ),
      html.div(
        attr.class('controls'),
        html.div(
          attr.class('control'),
          html.span('Scatter clusters'),
          html.button(on.click(refreshScatter), 'Shuffle')
        )
      ),
      UnovisXYContainer<Bubble>(
        {
          data: scatterData,
          config: { margin: { top: 12, right: 12, bottom: 32, left: 48 } },
          className: 'chart',
        },
        UnovisArea<Bubble>({
          config: {
            x: d => d.x,
            y: d => d.y,
            curveType: CurveType.MonotoneX,
            opacity: 0.12,
          },
        }),
        UnovisScatter<Bubble>({
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
        UnovisAxis<Bubble>({ role: 'x' }),
        UnovisAxis<Bubble>({ role: 'y' }),
        UnovisCrosshair<Bubble>({
          config: {
            snapToData: true,
            x: d => d.x,
            y: d => d.y,
          },
        }),
        UnovisBrush<Bubble>({
          config: {
            selectionMinLength: 1,
          },
        }),
        UnovisTooltip<Bubble>()
      )
    )
  )
}

render(App(), document.getElementById('app')!)
