import type { Value } from '@tempots/core'
import type { TopoJSONMapConfigInterface } from '@unovis/ts/components/topojson-map/config'
import type { MapData } from '@unovis/ts/components/topojson-map/types'
import { TopoJSONMap } from '@unovis/ts/components/topojson-map'
import { componentRenderable } from '../factory'

export interface UVisTopoJSONMapOptions<
  AreaDatum,
  PointDatum = unknown,
  LinkDatum = unknown,
> {
  config?: Value<
    Partial<TopoJSONMapConfigInterface<AreaDatum, PointDatum, LinkDatum>>
  >
}

export const UVisTopoJSONMap = <
  AreaDatum = unknown,
  PointDatum = unknown,
  LinkDatum = unknown,
>(
  options: UVisTopoJSONMapOptions<AreaDatum, PointDatum, LinkDatum> = {}
) =>
  componentRenderable<
    AreaDatum,
    TopoJSONMapConfigInterface<AreaDatum, PointDatum, LinkDatum>,
    TopoJSONMap<AreaDatum, PointDatum, LinkDatum>,
    MapData<AreaDatum, PointDatum, LinkDatum>
  >(
    cfg =>
      new TopoJSONMap<AreaDatum, PointDatum, LinkDatum>(
        cfg as TopoJSONMapConfigInterface<AreaDatum, PointDatum, LinkDatum>
      ),
    options
  )
