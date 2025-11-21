import type { Renderable } from '@tempots/dom'
import type { FlowLegendConfigInterface } from '@unovis/ts/components/flow-legend/config'
import { FlowLegend } from '@unovis/ts/components/flow-legend'
import type { RollingPinLegendConfigInterface } from '@unovis/ts/components/rolling-pin-legend/config'
import { RollingPinLegend } from '@unovis/ts/components/rolling-pin-legend'
import type { UnovisComponentOptions } from '../dom-component'
import { createDomComponent } from '../dom-component'

export type UVisRollingPinLegendOptions =
  UnovisComponentOptions<RollingPinLegendConfigInterface>

export const UVisRollingPinLegend = (
  options: UVisRollingPinLegendOptions = {}
): Renderable =>
  createDomComponent<RollingPinLegendConfigInterface>(
    options,
    (element, initial) => {
      const legend = new RollingPinLegend(
        element,
        (initial.config ?? {}) as RollingPinLegendConfigInterface
      )

      return {
        updateConfig: cfg =>
          legend.setConfig((cfg ?? {}) as RollingPinLegendConfigInterface),
        destroy: () => legend.destroy(),
      }
    }
  )

export type UVisFlowLegendOptions =
  UnovisComponentOptions<FlowLegendConfigInterface>

export const UVisFlowLegend = (
  options: UVisFlowLegendOptions = {}
): Renderable =>
  createDomComponent<FlowLegendConfigInterface>(options, (element, initial) => {
    const legend = new FlowLegend(
      element,
      (initial.config ?? {}) as FlowLegendConfigInterface
    )

    return {
      updateConfig: cfg =>
        legend.update((cfg ?? {}) as FlowLegendConfigInterface),
    }
  })
