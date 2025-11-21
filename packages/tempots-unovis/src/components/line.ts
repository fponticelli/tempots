import type { Value } from '@tempots/core'
import type { LineConfigInterface } from '@unovis/ts'
import { Line } from '@unovis/ts'
import { componentRenderable } from '../factory'

export interface UnovisLineOptions<Datum> {
  config?: Value<Partial<LineConfigInterface<Datum>>>
}

export const UnovisLine = <Datum>(options: UnovisLineOptions<Datum> = {}) =>
  componentRenderable<Datum, LineConfigInterface<Datum>, Line<Datum>>(
    cfg => new Line<Datum>(cfg),
    options
  )
