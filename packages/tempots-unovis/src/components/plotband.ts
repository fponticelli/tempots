import type { Value } from '@tempots/core'
import type { PlotbandConfigInterface } from '@unovis/ts'
import { Plotband } from '@unovis/ts'
import { componentRenderable } from '../factory'

export interface UVisPlotBandOptions<Datum> {
  config?: Value<Partial<PlotbandConfigInterface<Datum>>>
}

export const UVisPlotBand = <Datum>(options: UVisPlotBandOptions<Datum> = {}) =>
  componentRenderable<Datum, PlotbandConfigInterface<Datum>, Plotband<Datum>>(
    cfg => new Plotband<Datum>(cfg),
    options
  )
