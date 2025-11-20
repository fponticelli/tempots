import type { Value } from '@tempots/core'
import { Value as ValueUtil } from '@tempots/core'
import type { AxisConfigInterface } from '@unovis/ts'
import { Axis, AxisType } from '@unovis/ts'
import { unovisRenderable } from '../types'

type Cleanup = () => void

export interface UnovisAxisProps<Datum> {
  role?: 'x' | 'y'
  config?: Value<Partial<AxisConfigInterface<Datum>>>
}

export const UnovisAxis = <Datum>(props: UnovisAxisProps<Datum> = {}) =>
  unovisRenderable<Datum>(ctx => {
    const role = props.role ?? 'x'
    const configSignal = ValueUtil.toSignal(
      props.config ?? ({} as Partial<AxisConfigInterface<Datum>>)
    )

    const component = new Axis<Datum>(
      configSignal.get() ??
        ({
          type: role === 'x' ? AxisType.X : AxisType.Y,
        } as AxisConfigInterface<Datum>)
    )

    const cleanupFns: Cleanup[] = []

    const configCleanup = configSignal.on(cfg => {
      component.setConfig({
        type: role === 'x' ? AxisType.X : AxisType.Y,
        ...(cfg as AxisConfigInterface<Datum>),
      })
    })
    cleanupFns.push(configCleanup)

    const remove = ctx.attach({
      role: role === 'x' ? 'xAxis' : 'yAxis',
      value: component,
    })

    return (removeTree: boolean) => {
      cleanupFns.forEach(fn => fn())
      remove(removeTree)
    }
  })
