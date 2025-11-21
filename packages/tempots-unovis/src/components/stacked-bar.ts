import type { Value } from '@tempots/core'
import type { StackedBarConfigInterface } from '@unovis/ts'
import { StackedBar } from '@unovis/ts'
import { componentRenderable } from '../factory'

export interface UVisStackedBarOptions<Datum> {
  config?: Value<Partial<StackedBarConfigInterface<Datum>>>
}

export const UVisStackedBar = <Datum>(
  options: UVisStackedBarOptions<Datum> = {}
) =>
  componentRenderable<
    Datum,
    StackedBarConfigInterface<Datum>,
    StackedBar<Datum>
  >(cfg => new StackedBar<Datum>(cfg), options)
