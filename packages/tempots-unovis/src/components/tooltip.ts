import type { Value } from '@tempots/core'
import { Value as ValueUtil } from '@tempots/core'
import type { TooltipConfigInterface } from '@unovis/ts'
import { Tooltip } from '@unovis/ts'
import { unovisRenderable } from '../types'

type Cleanup = () => void

export interface UnovisTooltipProps {
  config?: Value<Partial<TooltipConfigInterface>>
}

export const UnovisTooltip = <Datum = unknown>(
  props: UnovisTooltipProps = {}
) =>
  unovisRenderable<Datum>(ctx => {
    const configSignal = ValueUtil.toSignal(
      props.config ?? ({} as Partial<TooltipConfigInterface>)
    )

    const component = new Tooltip(configSignal.get())
    const cleanupFns: Cleanup[] = []

    const configCleanup = configSignal.on(cfg => {
      component.setConfig(cfg)
    })
    cleanupFns.push(configCleanup)

    const remove = ctx.attach({
      role: 'tooltip',
      value: component,
    })

    return (removeTree: boolean) => {
      cleanupFns.forEach(fn => fn())
      remove(removeTree)
    }
  })
