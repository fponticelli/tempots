import type { Value } from '@tempots/core'
import type { DonutConfigInterface } from '@unovis/ts'
import { Donut } from '@unovis/ts'
import { componentRenderable } from '../factory'

export interface UVisDonutOptions<Datum> {
  config?: Value<Partial<DonutConfigInterface<Datum>>>
}

export const UVisDonut = <Datum>(options: UVisDonutOptions<Datum> = {}) =>
  componentRenderable<Datum, DonutConfigInterface<Datum>, Donut<Datum>>(
    cfg => new Donut<Datum>(cfg),
    options
  )
