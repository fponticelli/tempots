import { Txt } from './components/txt'
import {
  svg,
  attr,
  svgAttr,
  on,
  type Renderable,
  useProp,
  Signal,
  useComputed,
  ForEach,
  EmitValueAsNumber,
} from '@tempots/dom'
import { Button, Range } from './ui'
import { flex } from './components/flex'

interface Circle {
  id: string
  x: number
  y: number
  r: number
}

interface AddCircle {
  type: 'add'
  x: number
  y: number
  r: number
  id: string
}

interface ChangeRadius {
  type: 'changeRadius'
  id: string
  oldRadius: number
  newRadius: number
}

type Action = AddCircle | ChangeRadius

const DEFAULT_RADIUS = 10

export function CircleDrawer(): Renderable {
  const circles = useProp<Circle[]>([])
  const undoHistory = useProp<Action[]>([])
  const redoHistory = useProp<Action[]>([])
  const currentId = useProp<string | null>(null)
  const undoDisabled = undoHistory.map(v => v.length === 0)
  const redoDisabled = redoHistory.map(v => v.length === 0)
  const radius = useProp(DEFAULT_RADIUS)
  function addCircle(x: number, y: number, r: number) {
    const id = String(circles.value.length)
    circles.update(circles => [...circles, { id, x, y, r }])
    undoHistory.update(history => [...history, { type: 'add', x, y, r, id }])
    redoHistory.set([])
  }
  function undo() {
    const history = undoHistory.value
    if (history.length === 0) {
      return
    }
    const lastAction = history[history.length - 1]
    undoHistory.set(history.slice(0, history.length - 1))
    redoHistory.update(redoHistory => [...redoHistory, lastAction])
    switch (lastAction.type) {
      case 'add':
        circles.update(circles =>
          circles.filter(circle => circle.id !== lastAction.id)
        )
        break
      case 'changeRadius':
        radius.set(lastAction.oldRadius)
        circles.update(circles => {
          const index = circles.findIndex(circle => circle.id === lastAction.id)
          const circle = circles[index]
          return [
            ...circles.slice(0, index),
            { ...circle, r: lastAction.oldRadius },
            ...circles.slice(index + 1),
          ]
        })
        break
    }
  }
  function redo() {
    const history = redoHistory.value
    if (history.length === 0) {
      return
    }
    const redoAction = history[history.length - 1]
    redoHistory.set(history.slice(0, history.length - 1))
    undoHistory.update(undoHistory => [...undoHistory, redoAction])

    switch (redoAction.type) {
      case 'add':
        circles.update(circles => [
          ...circles,
          {
            id: redoAction.id,
            x: redoAction.x,
            y: redoAction.y,
            r: redoAction.r,
          },
        ])
        break
      case 'changeRadius':
        radius.set(redoAction.newRadius)
        circles.update(circles => {
          const index = circles.findIndex(circle => circle.id === redoAction.id)
          const circle = circles[index]
          return [
            ...circles.slice(0, index),
            { ...circle, r: redoAction.newRadius },
            ...circles.slice(index + 1),
          ]
        })
        break
    }
  }
  function changeRadius(newRadius: number) {
    const oldRadius = radius.value
    radius.set(newRadius)
    const id = currentId.value
    if (id == null) {
      return
    }
    circles.update(circles => {
      const index = circles.findIndex(circle => circle.id === id)
      const circle = circles[index]
      return [
        ...circles.slice(0, index),
        { ...circle, r: newRadius },
        ...circles.slice(index + 1),
      ]
    })
    undoHistory.update(history => [
      ...history,
      {
        type: 'changeRadius',
        oldRadius,
        newRadius,
        id,
      } satisfies ChangeRadius,
    ])
    redoHistory.set([])
  }
  return flex.col(
    attr.class('gap-4'),
    flex.row(
      attr.class('gap-2 items-center justify-center'),
      Button('Undo', attr.disabled(undoDisabled), on.click(undo)),
      Button('Redo', attr.disabled(redoDisabled), on.click(redo))
    ),
    flex.row(
      attr.class('gap-2 items-center justify-center'),
      Txt(radius.map(v => `Radius: ${v}`)),
      Txt(circles.map(v => `Circles: ${v.length}`))
    ),
    flex.row(
      Range(
        attr.min(1),
        attr.max(100),
        attr.valueAsNumber(radius),
        on.change(EmitValueAsNumber(changeRadius))
      )
    ),
    flex.row(
      attr.class('gap-2 items-center'),
      svg.svg(
        attr.class('size-80 border border-gray-200 rounded-md'),
        svgAttr.viewBox('0 0 318 318'),
        on.click((e: MouseEvent) => {
          const rect = (
            e.currentTarget as SVGSVGElement
          ).getBoundingClientRect()
          const x = e.clientX - rect.left
          const y = e.clientY - rect.top
          const selected = circles.value.find(circle => {
            const dx = circle.x - x
            const dy = circle.y - y
            return Math.sqrt(dx * dx + dy * dy) <= circle.r
          })
          if (selected != null) {
            currentId.set(selected.id)
          } else {
            currentId.set(null)
            addCircle(x, y, radius.value)
          }
        }),
        ForEach(circles, ($circle: Signal<Circle>) => {
          const selectedClass = useComputed(
            (): string =>
              currentId.value === $circle.value.id ? 'fill-red-600' : '',
            [currentId, $circle]
          )
          return svg.circle(
            attr.class('fill-none stroke-gray-600 stoke-1'),
            attr.class(selectedClass),
            svgAttr.cx($circle.map(c => c.x)),
            svgAttr.cy($circle.map(c => c.y)),
            svgAttr.r($circle.map(c => c.r))
          )
        })
      )
    )
  )
}
