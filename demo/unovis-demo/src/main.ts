import { attr, html, on, prop, render } from '@tempots/dom'
import { CurveType } from '@unovis/ts'
import {
  UnovisAxis,
  UnovisLine,
  UnovisTooltip,
  UnovisXYContainer,
} from '@tempots/unovis'

type Point = { x: number; y: number }

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

function App() {
  const lineData = prop<Point[]>(randomWalk(40))
  const smoothData = prop<Point[]>(sineWave(50))

  const refreshWalk = () => lineData.set(randomWalk(40))
  const refreshSine = () => smoothData.set(sineWave(50))

  const average = (points: Point[]) =>
    points.reduce((acc, p) => acc + p.y, 0) / (points.length || 1)

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
        ),
        html.div(
          attr.class('control'),
          html.span('Sine wave'),
          html.button(on.click(refreshSine), 'Regenerate')
        )
      ),
      html.div(
        attr.class('metrics'),
        html.div(
          attr.class('metric-card'),
          html.span(attr.class('metric-label'), 'Random walk avg'),
          html.span(
            attr.class('metric-value'),
            lineData.map(d => average(d).toFixed(2))
          )
        ),
        html.div(
          attr.class('metric-card'),
          html.span(attr.class('metric-label'), 'Sine avg'),
          html.span(
            attr.class('metric-value'),
            smoothData.map(d => average(d).toFixed(2))
          )
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
      )
    )
  )
}

render(App(), document.getElementById('app')!)
