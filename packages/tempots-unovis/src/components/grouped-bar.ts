import type { Value } from '@tempots/core'
import type { GroupedBarConfigInterface } from '@unovis/ts'
import { GroupedBar } from '@unovis/ts'
import { componentRenderable } from '../factory'

export interface UVisGroupedBarOptions<Datum> {
  config?: Value<Partial<GroupedBarConfigInterface<Datum>>>
}

export const UVisGroupedBar = <Datum>(
  options: UVisGroupedBarOptions<Datum> = {}
) =>
  componentRenderable<
    Datum,
    GroupedBarConfigInterface<Datum>,
    GroupedBar<Datum>
  >(cfg => new GroupedBar<Datum>(cfg), options)
