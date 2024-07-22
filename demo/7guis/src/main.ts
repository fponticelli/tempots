import './index.css'

import {
  type Prop,
  attr,
  type Renderable,
  on,
  makeProp,
  render,
  Fragment,
  Portal,
  OneOfValue,
} from '@tempots/dom'
import { Button } from './ui'
import { Counter } from './counter'
import { Temperature } from './temperature'
import { FlightBooker } from './flight-booker'
import { Timer } from './timer'
import { Crud } from './crud'
import { CircleDrawer } from './circle-drawer'
import { Cells } from './cells'
import { RepeatDemo } from './repeat-demo'
import { ForEachDemo } from './foreach-demo'
import { flex } from './components/flex'

type Demo =
  | 'Counter'
  | 'Temperature'
  | 'Flight Booker'
  | 'Timer'
  | 'CRUD'
  | 'Circle Drawer'
  | 'Cells'
  | 'Repeat'
  | 'For Each'
const demos: Demo[] = [
  'Counter',
  'Temperature',
  'Flight Booker',
  'Timer',
  'CRUD',
  'Circle Drawer',
  'Cells',
  'Repeat',
  'For Each',
]

function demoButton(demo: Demo, currentDemo: Prop<Demo>): Renderable {
  return Button(
    attr.disabled(currentDemo.map(v => v === demo)),
    on.click(() => currentDemo.set(demo)),
    demo
  )
}

export function App(): Renderable {
  const currentDemo = makeProp<Demo>('Temperature')
  return Fragment(
    Portal(
      'body',
      attr.class(
        'bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-300'
      )
    ),
    flex.col(
      attr.class('p-4 gap-8 items-center'),
      flex.row(
        attr.class('gap-4 justify-center flex-wrap'),
        ...demos.map(demo => demoButton(demo, currentDemo))
      ),
      OneOfValue(currentDemo, {
        Counter: Counter,
        Temperature: Temperature,
        'Flight Booker': FlightBooker,
        Timer: Timer,
        CRUD: Crud,
        'Circle Drawer': CircleDrawer,
        Cells: Cells,
        Repeat: RepeatDemo,
        'For Each': ForEachDemo,
      })
    )
  )
}

render(App(), document.getElementById('app')!)
