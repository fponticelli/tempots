import type { Renderable, Value } from '@tempots/dom'
import type { GenericDataRecord } from '@unovis/ts'
import type { LeafletFlowMapConfigInterface } from '@unovis/ts/components/leaflet-flow-map/config'
import { LeafletFlowMap } from '@unovis/ts/components/leaflet-flow-map'
import { createDomComponent } from '../dom-component'

export interface UVisLeafletFlowMapData<
  PointDatum extends GenericDataRecord,
  FlowDatum extends GenericDataRecord,
> {
  points: PointDatum[]
  flows?: FlowDatum[]
}

export interface UVisLeafletFlowMapOptions<
  PointDatum extends GenericDataRecord,
  FlowDatum extends GenericDataRecord,
> {
  data: Value<UVisLeafletFlowMapData<PointDatum, FlowDatum>>
  config?: Value<Partial<LeafletFlowMapConfigInterface<PointDatum, FlowDatum>>>
  className?: Value<string | null | undefined>
  style?: Value<string | null | undefined>
}

export const UVisLeafletFlowMap = <
  PointDatum extends GenericDataRecord = GenericDataRecord,
  FlowDatum extends GenericDataRecord = GenericDataRecord,
>(
  options: UVisLeafletFlowMapOptions<PointDatum, FlowDatum>
): Renderable =>
  createDomComponent<
    LeafletFlowMapConfigInterface<PointDatum, FlowDatum>,
    UVisLeafletFlowMapData<PointDatum, FlowDatum>
  >(options, (element, initial) => {
    const initialData = initial.data ?? { points: [], flows: [] }

    const flowMap = new LeafletFlowMap<PointDatum, FlowDatum>(
      element,
      (initial.config ?? {}) as LeafletFlowMapConfigInterface<
        PointDatum,
        FlowDatum
      >,
      initialData
    )

    return {
      updateConfig: cfg =>
        flowMap.setConfig(
          (cfg ?? {}) as LeafletFlowMapConfigInterface<PointDatum, FlowDatum>
        ),
      updateData: data =>
        flowMap.setData(
          (data ?? {
            points: [],
            flows: [],
          }) as UVisLeafletFlowMapData<PointDatum, FlowDatum>
        ),
      destroy: () => flowMap.destroy(),
    }
  })
