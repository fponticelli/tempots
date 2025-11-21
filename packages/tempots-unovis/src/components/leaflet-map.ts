import type { Renderable, Value as DomValue } from '@tempots/dom'
import type { GenericDataRecord } from '@unovis/ts'
import type { LeafletMapConfigInterface } from '@unovis/ts/components/leaflet-map/config'
import { LeafletMap } from '@unovis/ts/components/leaflet-map'
import { createDomComponent } from '../dom-component'

export interface UVisLeafletMapOptions<Datum extends GenericDataRecord> {
  data: DomValue<Datum[]>
  config?: DomValue<Partial<LeafletMapConfigInterface<Datum>>>
  className?: DomValue<string | null | undefined>
  style?: DomValue<string | null | undefined>
}

export const UVisLeafletMap = <
  Datum extends GenericDataRecord = GenericDataRecord,
>(
  options: UVisLeafletMapOptions<Datum>
): Renderable =>
  createDomComponent<LeafletMapConfigInterface<Datum>, Datum[]>(
    options,
    (element, initial) => {
      const map = new LeafletMap<Datum>(
        element,
        (initial.config ?? {}) as LeafletMapConfigInterface<Datum>,
        (initial.data as Datum[]) ?? []
      )

      return {
        updateConfig: cfg =>
          map.setConfig((cfg ?? {}) as LeafletMapConfigInterface<Datum>),
        updateData: data => map.setData((data as Datum[]) ?? []),
        destroy: () => map.destroy(),
      }
    }
  )
