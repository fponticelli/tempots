import type { Value } from '@tempots/core'
import type { AreaConfigInterface } from '@unovis/ts'
import { Area } from '@unovis/ts'
import { componentRenderable } from '../factory'

export interface UVisAreaOptions<Datum> {
  config?: Value<Partial<AreaConfigInterface<Datum>>>
}

export const UVisArea = <Datum>(options: UVisAreaOptions<Datum> = {}) =>
  componentRenderable<Datum, AreaConfigInterface<Datum>, Area<Datum>>(
    cfg => new Area<Datum>(cfg),
    options
  )
