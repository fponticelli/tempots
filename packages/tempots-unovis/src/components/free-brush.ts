import type { Value } from '@tempots/core'
import type { FreeBrushConfigInterface } from '@unovis/ts'
import { FreeBrush } from '@unovis/ts'
import { componentRenderable } from '../factory'

export interface UVisFreeBrushOptions<Datum> {
  config?: Value<Partial<FreeBrushConfigInterface<Datum>>>
}

export const UVisFreeBrush = <Datum>(
  options: UVisFreeBrushOptions<Datum> = {}
) =>
  componentRenderable<Datum, FreeBrushConfigInterface<Datum>, FreeBrush<Datum>>(
    cfg => new FreeBrush<Datum>(cfg),
    options
  )
