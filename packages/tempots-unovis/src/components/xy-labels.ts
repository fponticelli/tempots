import type { Value } from '@tempots/core'
import type { XYLabelsConfigInterface } from '@unovis/ts'
import { XYLabels } from '@unovis/ts'
import { componentRenderable } from '../factory'

export interface UnovisXYLabelsOptions<Datum> {
  config?: Value<Partial<XYLabelsConfigInterface<Datum>>>
}

export const UnovisXYLabels = <Datum>(
  options: UnovisXYLabelsOptions<Datum> = {}
) =>
  componentRenderable<Datum, XYLabelsConfigInterface<Datum>, XYLabels<Datum>>(
    cfg => new XYLabels<Datum>(cfg),
    options
  )
