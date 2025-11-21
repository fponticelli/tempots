export type Point = { x: number; y: number }
export type Bubble = { x: number; y: number; band: string; intensity: number }
export type Stack = { day: number; a: number; b: number; c: number }
export type Grouped = {
  quarter: string
  index: number
  north: number
  south: number
  west: number
}
export type Slice = { label: string; value: number }
export type TimelineItem = {
  start: number
  duration: number
  lane: string
  label: string
  color: string
}
export type TreemapDatum = { region: string; country: string; value: number }
export type NestedSlice = {
  category: string
  subcategory: string
  value: number
}
export type SankeyNodeDatum = { id: string; group: string }
export type SankeyLinkDatum = { source: string; target: string; value: number }
export type ChordRegion = { id: string; name: string }
export type ChordLinkDatum = { source: string; target: string; value: number }
export type GraphNode = { id: string; group: string; size: number }
export type GraphLink = { source: string; target: string; intensity: number }
export type RegionArea = { id: string; performance: number }
export type RegionPoint = {
  id: string
  name: string
  longitude: number
  latitude: number
  category: string
}
export type RegionLink = {
  id: string
  source: string
  target: string
  intensity: number
}
export type RegionMapData = {
  areas: RegionArea[]
  points: RegionPoint[]
  links: RegionLink[]
}
export type SimpleTopology = {
  type: 'Topology'
  objects: {
    regions: {
      type: 'GeometryCollection'
      geometries: Array<{
        type: 'Polygon'
        arcs: number[][]
        id: string
        properties: { name: string }
      }>
    }
  }
  arcs: number[][][]
}
export type LeafletPoint = {
  id: string
  city: string
  longitude: number
  latitude: number
  load: number
  healthy: number
  warning: number
  critical: number
  shape?: string
}
export type LeafletFlowDatum = {
  id: string
  source: string
  target: string
  sourceLongitude: number
  sourceLatitude: number
  targetLongitude: number
  targetLatitude: number
  magnitude: number
}
