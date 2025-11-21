import type { Value } from '@tempots/core'
import { Value as ValueUtil } from '@tempots/core'
import type { AxisConfigInterface } from '@unovis/ts'
import { Axis, AxisType } from '@unovis/ts'
import { unovisRenderable } from '../types'

export interface UVisAxisOptions<Datum> {
  role?: 'x' | 'y'
  config?: Value<Partial<AxisConfigInterface<Datum>>>
}

export const UVisAxis = <Datum>(options: UVisAxisOptions<Datum> = {}) =>
  unovisRenderable<Datum>(ctx => {
    const role = options.role ?? 'x'
    const configSignal = ValueUtil.toSignal(
      options.config ?? ({} as Partial<AxisConfigInterface<Datum>>)
    )

    const component = new Axis<Datum>({
      type: role === 'x' ? AxisType.X : AxisType.Y,
      ...(configSignal.get() as AxisConfigInterface<Datum>),
    })

    const remove = ctx.attach({
      role: role === 'x' ? 'xAxis' : 'yAxis',
      value: component,
    })

    configSignal.onChange(cfg => {
      component.setConfig({
        type: role === 'x' ? AxisType.X : AxisType.Y,
        ...(cfg as AxisConfigInterface<Datum>),
      })
    })

    return remove
  })
