import type { Value } from '@tempots/core'
import type { CrosshairConfigInterface } from '@unovis/ts'
import { Crosshair } from '@unovis/ts'
import { attachmentRenderable } from '../factory'

export interface UVisCrosshairOptions<Datum> {
  config?: Value<Partial<CrosshairConfigInterface<Datum>>>
}

export const UVisCrosshair = <Datum>(
  options: UVisCrosshairOptions<Datum> = {}
) =>
  attachmentRenderable<
    Datum,
    CrosshairConfigInterface<Datum>,
    Crosshair<Datum>
  >('crosshair', cfg => new Crosshair<Datum>(cfg), options)
