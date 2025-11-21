import type { Value } from '@tempots/core'
import type { NestedDonutConfigInterface } from '@unovis/ts'
import { NestedDonut } from '@unovis/ts'
import { componentRenderable } from '../factory'

export interface UVisNestedDonutOptions<Datum> {
  config?: Value<Partial<NestedDonutConfigInterface<Datum>>>
}

export const UVisNestedDonut = <Datum>(
  options: UVisNestedDonutOptions<Datum> = {}
) =>
  componentRenderable<
    Datum,
    NestedDonutConfigInterface<Datum>,
    NestedDonut<Datum>
  >(cfg => new NestedDonut<Datum>(cfg), options)
