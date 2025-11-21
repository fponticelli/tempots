import { attr, html, prop } from '@tempots/dom'
import {
  LeafletMapPointShape,
  LeafletMapRenderer,
} from '@unovis/ts/components/leaflet-map/types'
import type { Renderable } from '@tempots/dom'
import type { LeafletPoint } from '../types'
import { UVisLeafletMap } from '@tempots/unovis'
import { ChartTrigger } from '../components/chart-trigger'

const leafletPoints = (): LeafletPoint[] => {
  const cities: Array<LeafletPoint & { baseLoad: number }> = [
    {
      id: 'sea',
      city: 'Seattle',
      longitude: -122.33,
      latitude: 47.61,
      load: 0,
      healthy: 0,
      warning: 0,
      critical: 0,
      shape: LeafletMapPointShape.Circle,
      baseLoad: 0.68,
    },
    {
      id: 'sfo',
      city: 'San Francisco',
      longitude: -122.43,
      latitude: 37.77,
      load: 0,
      healthy: 0,
      warning: 0,
      critical: 0,
      shape: LeafletMapPointShape.Circle,
      baseLoad: 0.74,
    },
    {
      id: 'den',
      city: 'Denver',
      longitude: -104.99,
      latitude: 39.74,
      load: 0,
      healthy: 0,
      warning: 0,
      critical: 0,
      shape: LeafletMapPointShape.Square,
      baseLoad: 0.58,
    },
    {
      id: 'chi',
      city: 'Chicago',
      longitude: -87.63,
      latitude: 41.88,
      load: 0,
      healthy: 0,
      warning: 0,
      critical: 0,
      shape: LeafletMapPointShape.Triangle,
      baseLoad: 0.64,
    },
    {
      id: 'nyc',
      city: 'New York',
      longitude: -74.01,
      latitude: 40.71,
      load: 0,
      healthy: 0,
      warning: 0,
      critical: 0,
      shape: LeafletMapPointShape.Ring,
      baseLoad: 0.82,
    },
    {
      id: 'mia',
      city: 'Miami',
      longitude: -80.19,
      latitude: 25.76,
      load: 0,
      healthy: 0,
      warning: 0,
      critical: 0,
      shape: LeafletMapPointShape.Circle,
      baseLoad: 0.56,
    },
    {
      id: 'lon',
      city: 'London',
      longitude: -0.1,
      latitude: 51.5,
      load: 0,
      healthy: 0,
      warning: 0,
      critical: 0,
      shape: LeafletMapPointShape.Triangle,
      baseLoad: 0.7,
    },
    {
      id: 'ber',
      city: 'Berlin',
      longitude: 13.4,
      latitude: 52.52,
      load: 0,
      healthy: 0,
      warning: 0,
      critical: 0,
      shape: LeafletMapPointShape.Square,
      baseLoad: 0.66,
    },
    {
      id: 'mad',
      city: 'Madrid',
      longitude: -3.7,
      latitude: 40.42,
      load: 0,
      healthy: 0,
      warning: 0,
      critical: 0,
      shape: LeafletMapPointShape.Circle,
      baseLoad: 0.6,
    },
  ]

  return cities.map(city => {
    const load = Math.min(
      0.95,
      Math.max(0.32, city.baseLoad + (Math.random() - 0.5) * 0.24)
    )
    const healthy = Math.max(0.2, load * 0.7 + Math.random() * 0.1)
    const warning = Math.max(0.08, (1 - load) * 0.18 + Math.random() * 0.08)
    const critical = Math.max(0.02, load * 0.08 * Math.random())
    const total = healthy + warning + critical

    return {
      ...city,
      load,
      healthy: Math.round((healthy / total) * 100) / 100,
      warning: Math.round((warning / total) * 100) / 100,
      critical: Math.round((critical / total) * 100) / 100,
      shape:
        load > 0.78
          ? LeafletMapPointShape.Ring
          : (city.shape ?? LeafletMapPointShape.Circle),
    }
  })
}

export const LeafletMapBlock = (): Renderable => {
  const pointsData = prop<LeafletPoint[]>(leafletPoints())
  const refresh = () => pointsData.set(leafletPoints())

  return html.div(
    ChartTrigger('Leaflet map', 'Shuffle', refresh),
    html.div(
      attr.class('chart'),
      UVisLeafletMap<LeafletPoint>({
        data: pointsData,
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
          pointRadius: p => 10 + p.load * 14,
          pointBottomLabel: p => p.city,
          pointLabel: p => `${Math.round(p.load * 100)}%`,
          pointLabelColor: () => '#0f172a',
          clusterBackground: true,
          clusterExpandOnClick: false,
          colorMap: {
            healthy: { color: '#22c55e' },
            warning: { color: '#f59e0b' },
            critical: { color: '#ef4444' },
          },
        },
      })
    )
  )
}
