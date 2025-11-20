import type { Value } from '@tempots/core'
import { Value as ValueUtil } from '@tempots/core'
import type { LineConfigInterface } from '@unovis/ts'
import { Line } from '@unovis/ts'
import { unovisRenderable } from '../types'

type Cleanup = () => void

export interface UnovisLineProps<Datum> {
  config?: Value<Partial<LineConfigInterface<Datum>>>
}

export const UnovisLine = <Datum>(props: UnovisLineProps<Datum> = {}) =>
  unovisRenderable<Datum>(ctx => {
    const configSignal = ValueUtil.toSignal(
      props.config ?? ({} as Partial<LineConfigInterface<Datum>>)
    )

    const component = new Line<Datum>(
      configSignal.get() as LineConfigInterface<Datum>
    )
    const cleanupFns: Cleanup[] = []

    const configCleanup = configSignal.on(cfg => {
      component.setConfig(cfg as LineConfigInterface<Datum>)
    })
    cleanupFns.push(configCleanup)

    const remove = ctx.addComponent(component)

    return (removeTree: boolean) => {
      cleanupFns.forEach(fn => fn())
      remove(removeTree)
    }
  })
