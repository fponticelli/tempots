import type { Value } from '@tempots/core'
import type { TooltipConfigInterface } from '@unovis/ts'
import { Tooltip } from '@unovis/ts'
import { attachmentRenderable } from '../factory'

export interface UnovisTooltipOptions {
  config?: Value<Partial<TooltipConfigInterface>>
}

export const UnovisTooltip = <Datum = unknown>(
  options: UnovisTooltipOptions = {}
) =>
  attachmentRenderable<Datum, TooltipConfigInterface, Tooltip>(
    'tooltip',
    cfg => new Tooltip(cfg),
    options
  )
