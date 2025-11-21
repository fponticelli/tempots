import type { Value } from '@tempots/core'
import type { TimelineConfigInterface } from '@unovis/ts'
import { Timeline } from '@unovis/ts'
import { componentRenderable } from '../factory'

export interface UVisTimelineOptions<Datum> {
  config?: Value<Partial<TimelineConfigInterface<Datum>>>
}

export const UVisTimeline = <Datum>(options: UVisTimelineOptions<Datum> = {}) =>
  componentRenderable<Datum, TimelineConfigInterface<Datum>, Timeline<Datum>>(
    cfg => new Timeline<Datum>(cfg),
    options
  )
