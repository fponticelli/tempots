import type { Value } from '@tempots/core'
import type { BrushConfigInterface } from '@unovis/ts'
import { Brush } from '@unovis/ts'
import { componentRenderable } from '../factory'

export interface UnovisBrushOptions<Datum> {
  config?: Value<Partial<BrushConfigInterface<Datum>>>
}

export const UnovisBrush = <Datum>(options: UnovisBrushOptions<Datum> = {}) =>
  componentRenderable<Datum, BrushConfigInterface<Datum>, Brush<Datum>>(
    cfg => new Brush<Datum>(cfg),
    options
  )
