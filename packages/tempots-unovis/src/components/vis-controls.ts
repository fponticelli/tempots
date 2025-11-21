import type { Renderable, Value as DomValue } from '@tempots/dom'
import type { VisControlsConfigInterface } from '@unovis/ts/components/vis-controls/config'
import { VisControls } from '@unovis/ts/components/vis-controls'
import { createDomComponent } from '../dom-component'

export interface UVisControlsOptions {
  config?: DomValue<Partial<VisControlsConfigInterface>>
}

export const UVisControls = (options: UVisControlsOptions = {}): Renderable =>
  createDomComponent<VisControlsConfigInterface>(
    options,
    (element, initial) => {
      const controls = new VisControls(
        element,
        (initial.config ?? {}) as VisControlsConfigInterface
      )

      return {
        updateConfig: cfg =>
          controls.update((cfg ?? {}) as VisControlsConfigInterface),
      }
    }
  )
