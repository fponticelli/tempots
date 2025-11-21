import type { Value } from '@tempots/core'
import type { PlotlineConfigInterface } from '@unovis/ts'
import { Plotline } from '@unovis/ts'
import { componentRenderable } from '../factory'

export interface UVisPlotLineOptions<Datum> {
  config?: Value<Partial<PlotlineConfigInterface<Datum>>>
}

export const UVisPlotLine = <Datum>(options: UVisPlotLineOptions<Datum> = {}) =>
  componentRenderable<Datum, PlotlineConfigInterface<Datum>, Plotline<Datum>>(
    cfg => new Plotline<Datum>(cfg),
    options
  )
