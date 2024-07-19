import { Txt } from './components/txt'
import {
  attr,
  emit,
  on,
  type Renderable,
  useComputed,
  useProp,
  OnUnmount,
} from '@tempots/dom'
import { Button, Progress, Range } from './ui'
import { flex } from './components/flex'

export function formatSecond(milliseconds: number): string {
  const seconds = milliseconds / 1000
  return seconds.toFixed(1) + 's'
}

function clamp(num: number, min: number, max: number) {
  return num <= min ? min : num >= max ? max : num
}

const MIN = 100
const MAX = 30000
const START = 10000
const INTERVAL = 1000 / 60

export function Timer(): Renderable {
  const elapsed = useProp(0)
  const duration = useProp(START)
  let timerId: ReturnType<typeof setInterval> | undefined
  function startTimer() {
    const startTime = performance.now()
    timerId = setInterval(() => {
      const delta = performance.now() - startTime
      elapsed.set(clamp(delta, MIN, duration.value))
    }, INTERVAL)
  }
  startTimer()
  return flex.col(
    OnUnmount(() => {
      clearInterval(timerId)
    }),
    attr.class('gap-2 items-center'),
    flex.row(
      attr.class('gap-2 items-center'),
      Txt('Elapsed time: '),
      Progress(attr.max(duration), attr.value(elapsed.map(String))),
      Txt(elapsed.map(elapsed => formatSecond(elapsed)))
    ),
    flex.row(
      attr.class('gap-2 items-center'),
      Txt('Duration'),
      Range(
        attr.min(MIN),
        attr.max(MAX),
        attr.valueAsNumber(duration),
        on.input(emit.valueAsNumber(duration.set))
      ),
      Txt(duration.map(duration => formatSecond(duration)))
    ),
    flex.row(
      attr.class('gap-2 items-center'),
      Txt('Remaining time: '),
      Txt(
        useComputed(
          () => formatSecond(duration.value - elapsed.value),
          [duration, elapsed]
        )
      )
    ),
    flex.row(
      attr.class('gap-2 items-center'),
      Button(
        'Reset',
        on.click(() => {
          clearInterval(timerId)
          startTimer()
        })
      )
    )
  )
}
