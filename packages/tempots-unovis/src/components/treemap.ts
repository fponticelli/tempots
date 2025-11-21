import type { Value } from '@tempots/core'
import type { TreemapConfigInterface } from '@unovis/ts'
import { Treemap } from '@unovis/ts'
import { componentRenderable } from '../factory'

export interface UVisTreemapOptions<Datum> {
  config?: Value<Partial<TreemapConfigInterface<Datum>>>
}

export const UVisTreemap = <Datum>(options: UVisTreemapOptions<Datum> = {}) =>
  componentRenderable<Datum, TreemapConfigInterface<Datum>, Treemap<Datum>>(
    cfg => new Treemap<Datum>(cfg),
    options
  )
