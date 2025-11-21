import { attr, html, prop } from '@tempots/dom'
import {
  LeafletMapPointShape,
  LeafletMapRenderer,
} from '@unovis/ts/components/leaflet-map/types'
import type { Renderable } from '@tempots/dom'
import type { LeafletFlowDatum, LeafletPoint } from '../types'
import { UVisLeafletFlowMap, UVisLeafletFlowMapData } from '@tempots/unovis'
import { ChartTrigger } from '../components/chart-trigger'

const createPoints = (): LeafletPoint[] => {
  const base = [
    { id: 'sea', city: 'Seattle', longitude: -122.33, latitude: 47.61 },
    { id: 'sfo', city: 'San Francisco', longitude: -122.43, latitude: 37.77 },
    { id: 'den', city: 'Denver', longitude: -104.99, latitude: 39.74 },
    { id: 'chi', city: 'Chicago', longitude: -87.63, latitude: 41.88 },
    { id: 'nyc', city: 'New York', longitude: -74.01, latitude: 40.71 },
    { id: 'mia', city: 'Miami', longitude: -80.19, latitude: 25.76 },
    { id: 'lon', city: 'London', longitude: -0.1, latitude: 51.5 },
    { id: 'ber', city: 'Berlin', longitude: 13.4, latitude: 52.52 },
    { id: 'mad', city: 'Madrid', longitude: -3.7, latitude: 40.42 },
  ]
  return base.map(city => ({
    ...city,
    load: 0.5,
    healthy: 0,
    warning: 0,
    critical: 0,
    shape: LeafletMapPointShape.Circle,
  }))
}

const createFlows = (points: LeafletPoint[]): LeafletFlowDatum[] => {
  const lookup = Object.fromEntries(points.map(p => [p.id, p]))
  const pairs: Array<[string, string]> = [
    ['sea', 'sfo'],
    ['sfo', 'den'],
    ['den', 'chi'],
    ['chi', 'nyc'],
    ['nyc', 'lon'],
    ['lon', 'ber'],
    ['ber', 'mad'],
    ['mad', 'mia'],
    ['mia', 'nyc'],
    ['sfo', 'lon'],
    ['sea', 'ber'],
    ['den', 'mad'],
  ]

  return pairs
    .filter(() => Math.random() > 0.1)
    .map(([source, target], idx) => {
      const start = lookup[source]
      const end = lookup[target]
      return {
        id: `${source}-${target}-${idx}`,
        source,
        target,
        sourceLongitude: start?.longitude ?? 0,
        sourceLatitude: start?.latitude ?? 0,
        targetLongitude: end?.longitude ?? 0,
        targetLatitude: end?.latitude ?? 0,
        magnitude: Math.max(6, Math.round(12 + Math.random() * 18)),
      }
    })
}

export const LeafletFlowMapBlock = (): Renderable => {
  const initialPoints = createPoints()
  const flowData = prop<UVisLeafletFlowMapData<LeafletPoint, LeafletFlowDatum>>(
    {
      points: initialPoints,
      flows: createFlows(initialPoints),
    }
  )
  const refresh = () => {
    const points = createPoints()
    flowData.set({ points, flows: createFlows(points) })
  }

  return html.div(
    ChartTrigger('Flow map', 'Shuffle', refresh),
    html.div(
      attr.class('chart'),
      UVisLeafletFlowMap<LeafletPoint, LeafletFlowDatum>({
        data: flowData,
        className: 'chart single map tall',
        config: {
          renderer: LeafletMapRenderer.Raster,
          style: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
          height: '430px',
          fitViewOnInit: true,
          fitViewOnUpdate: true,
          pointLongitude: p => p.longitude,
          pointLatitude: p => p.latitude,
          pointId: p => p.id,
          pointShape: p => p.shape ?? LeafletMapPointShape.Circle,
          pointRadius: () => 12,
          pointColor: () => '#2563eb',
          sourcePointColor: () => '#2563eb',
          flowParticleColor: '#0ea5e9',
          flowParticleRadius: 1.6,
          flowParticleSpeed: 0.1,
          flowParticleDensity: 0.9,
          clusterExpandOnClick: false,
        },
      })
    )
  )
}
