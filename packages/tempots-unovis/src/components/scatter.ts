import type { Value } from '@tempots/core'
import type { ScatterConfigInterface } from '@unovis/ts'
import { Scatter } from '@unovis/ts'
import { componentRenderable } from '../factory'

export interface UnovisScatterOptions<Datum> {
  config?: Value<Partial<ScatterConfigInterface<Datum>>>
}

export const UnovisScatter = <Datum>(
  options: UnovisScatterOptions<Datum> = {}
) =>
  componentRenderable<Datum, ScatterConfigInterface<Datum>, Scatter<Datum>>(
    cfg => new Scatter<Datum>(cfg),
    options
  )
