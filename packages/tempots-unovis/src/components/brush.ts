import type { Value } from '@tempots/core'
import type { BrushConfigInterface } from '@unovis/ts'
import { Brush } from '@unovis/ts'
import { componentRenderable } from '../factory'

export interface UVisBrushOptions<Datum> {
  config?: Value<Partial<BrushConfigInterface<Datum>>>
}

export const UVisBrush = <Datum>(options: UVisBrushOptions<Datum> = {}) =>
  componentRenderable<Datum, BrushConfigInterface<Datum>, Brush<Datum>>(
    cfg => new Brush<Datum>(cfg),
    options
  )
