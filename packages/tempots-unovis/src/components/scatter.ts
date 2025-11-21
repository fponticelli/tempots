import type { Value } from '@tempots/core'
import type { ScatterConfigInterface } from '@unovis/ts'
import { Scatter } from '@unovis/ts'
import { componentRenderable } from '../factory'

export interface UVisScatterOptions<Datum> {
  config?: Value<Partial<ScatterConfigInterface<Datum>>>
}

export const UVisScatter = <Datum>(options: UVisScatterOptions<Datum> = {}) =>
  componentRenderable<Datum, ScatterConfigInterface<Datum>, Scatter<Datum>>(
    cfg => new Scatter<Datum>(cfg),
    options
  )
