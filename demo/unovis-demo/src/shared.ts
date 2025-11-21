import type { SimpleTopology } from './types'

export const palette = [
  '#2563eb',
  '#22c55e',
  '#f97316',
  '#a855f7',
  '#06b6d4',
  '#e11d48',
  '#7c3aed',
  '#0ea5e9',
]

export const colorForKey = (key: string) => {
  const normalized = key || 'key'
  let hash = 0
  for (let i = 0; i < normalized.length; i++) {
    hash = (hash << 5) - hash + normalized.charCodeAt(i)
    hash |= 0
  }
  return palette[Math.abs(hash) % palette.length]
}

export const mapGradient = [
  '#e0f2fe',
  '#bae6fd',
  '#7dd3fc',
  '#38bdf8',
  '#0ea5e9',
  '#0284c7',
]

export const performanceColor = (value: number) => {
  const clamped = Math.max(0, Math.min(1, value))
  const idx = Math.min(
    mapGradient.length - 1,
    Math.floor(clamped * (mapGradient.length - 1))
  )
  return mapGradient[idx]
}

export const regionTopology: SimpleTopology = {
  type: 'Topology',
  objects: {
    regions: {
      type: 'GeometryCollection',
      geometries: [
        {
          type: 'Polygon',
          arcs: [[0]],
          id: 'west',
          properties: { name: 'West' },
        },
        {
          type: 'Polygon',
          arcs: [[1]],
          id: 'central',
          properties: { name: 'Central' },
        },
        {
          type: 'Polygon',
          arcs: [[2]],
          id: 'south',
          properties: { name: 'South' },
        },
      ],
    },
  },
  arcs: [
    [
      [-125, 50],
      [-100, 50],
      [-100, 30],
      [-125, 30],
      [-125, 50],
    ],
    [
      [-100, 50],
      [-75, 50],
      [-75, 30],
      [-100, 30],
      [-100, 50],
    ],
    [
      [-120, 30],
      [-75, 30],
      [-75, 20],
      [-120, 20],
      [-120, 30],
    ],
  ],
}
