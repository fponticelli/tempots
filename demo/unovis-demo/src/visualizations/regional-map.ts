import { attr, html, prop } from '@tempots/dom'
import {
  MapPointLabelPosition,
  MapProjection,
} from '@unovis/ts/components/topojson-map/types'
import { UnovisSingleContainer, UVisTopoJSONMap } from '@tempots/unovis'
import type { Renderable } from '@tempots/dom'
import type {
  RegionArea,
  RegionLink,
  RegionMapData,
  RegionPoint,
} from '../types'
import { performanceColor, regionTopology } from '../shared'
import { ChartTrigger } from '../components/chart-trigger'

const regionMapData = (): RegionMapData => {
  const areas: RegionArea[] = [
    { id: 'west', performance: Math.random() },
    { id: 'central', performance: Math.random() },
    { id: 'south', performance: Math.random() },
  ]

  const points: RegionPoint[] = [
    {
      id: 'sea',
      name: 'Seattle',
      longitude: -122.33,
      latitude: 47.61,
      category: 'A',
    },
    {
      id: 'sfo',
      name: 'San Francisco',
      longitude: -122.43,
      latitude: 37.77,
      category: 'A',
    },
    {
      id: 'den',
      name: 'Denver',
      longitude: -104.99,
      latitude: 39.74,
      category: 'B',
    },
    {
      id: 'chi',
      name: 'Chicago',
      longitude: -87.63,
      latitude: 41.88,
      category: 'B',
    },
    {
      id: 'hou',
      name: 'Houston',
      longitude: -95.36,
      latitude: 29.76,
      category: 'C',
    },
    {
      id: 'mia',
      name: 'Miami',
      longitude: -80.19,
      latitude: 25.76,
      category: 'C',
    },
  ]

  const intensity = () => 0.4 + Math.random() * 0.6
  const links: RegionLink[] = [
    { id: 'sea-sfo', source: 'sea', target: 'sfo', intensity: intensity() },
    { id: 'sea-den', source: 'sea', target: 'den', intensity: intensity() },
    { id: 'den-chi', source: 'den', target: 'chi', intensity: intensity() },
    { id: 'sfo-hou', source: 'sfo', target: 'hou', intensity: intensity() },
    { id: 'hou-mia', source: 'hou', target: 'mia', intensity: intensity() },
    { id: 'chi-mia', source: 'chi', target: 'mia', intensity: intensity() },
  ]

  return { areas, points, links }
}

export const RegionalMapBlock = (): Renderable => {
  const mapData = prop<RegionMapData>(regionMapData())
  const refresh = () => mapData.set(regionMapData())

  return html.div(
    ChartTrigger('Regional map', 'Shuffle', refresh),
    html.div(
      attr.class('chart single wide'),
      UnovisSingleContainer<RegionArea, RegionMapData>(
        {
          data: mapData as unknown as RegionMapData,
          config: { margin: { top: 12, right: 12, bottom: 12, left: 12 } },
        },
        UVisTopoJSONMap<RegionArea, RegionPoint, RegionLink>({
          config: {
            topojson: regionTopology,
            mapFeatureName: 'regions',
            projection: MapProjection.AlbersUsa(),
            areaId: d => d.id,
            areaColor: d => performanceColor(d.performance),
            pointId: p => p.id,
            pointLabel: p => p.name,
            pointLabelPosition: MapPointLabelPosition.Bottom,
            pointRadius: p =>
              p.category === 'A' ? 9 : p.category === 'B' ? 8 : 7,
            pointColor: p =>
              p.category === 'A'
                ? '#22c55e'
                : p.category === 'B'
                  ? '#38bdf8'
                  : '#f97316',
            longitude: p => p.longitude,
            latitude: p => p.latitude,
            linkSource: l => l.source,
            linkTarget: l => l.target,
            linkWidth: l => 6 * l.intensity,
            linkColor: () => 'rgba(14,165,233,0.6)',
            zoomExtent: [0.8, 6],
            zoomDuration: 400,
            mapFitToPoints: true,
          },
        })
      )
    )
  )
}
