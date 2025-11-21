import type { Renderable } from '@tempots/dom'
import type { BulletLegendConfigInterface } from '@unovis/ts/components/bullet-legend/config'
import { BulletLegend } from '@unovis/ts/components/bullet-legend'
import type { UnovisComponentOptions } from '../dom-component'
import { createDomComponent } from '../dom-component'

export type UVisBulletLegendOptions =
  UnovisComponentOptions<BulletLegendConfigInterface>

export const UVisBulletLegend = (
  options: UVisBulletLegendOptions = {}
): Renderable =>
  createDomComponent<BulletLegendConfigInterface>(
    options,
    (element, initial) => {
      const legend = new BulletLegend(
        element,
        (initial.config ?? {}) as BulletLegendConfigInterface
      )

      return {
        updateConfig: cfg =>
          legend.update((cfg ?? {}) as BulletLegendConfigInterface),
        destroy: () => legend.destroy(),
      }
    }
  )
