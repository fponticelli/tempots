import type { Value } from '@tempots/core'
import type { TooltipConfigInterface } from '@unovis/ts'
import { Tooltip } from '@unovis/ts'
import { attachmentRenderable } from '../factory'

export interface UVisTooltipOptions {
  config?: Value<Partial<TooltipConfigInterface>>
}

export const UVisTooltip = <Datum = unknown>(
  options: UVisTooltipOptions = {}
) =>
  attachmentRenderable<Datum, TooltipConfigInterface, Tooltip>(
    'tooltip',
    cfg => new Tooltip(cfg),
    options
  )
