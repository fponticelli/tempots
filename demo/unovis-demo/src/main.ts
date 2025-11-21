import { attr, html, render } from '@tempots/dom'
import { RandomWalkChart } from './visualizations/random-walk'
import { SineWaveChart } from './visualizations/sine-wave'
import { ScatterClustersChart } from './visualizations/scatter-clusters'
import { StackedBarsChart } from './visualizations/stacked-bars'
import { GroupedBarsChart } from './visualizations/grouped-bars'
import { TimelineChart } from './visualizations/timeline'
import { DonutBlock } from './visualizations/donut'
import { TreemapBlock } from './visualizations/treemap'
import { NestedDonutBlock } from './visualizations/nested-donut'
import { SankeyBlock } from './visualizations/sankey'
import { ChordBlock } from './visualizations/chord'
import { GraphBlock } from './visualizations/graph'
import { LegendsSection } from './visualizations/legends'
import { RegionalMapBlock } from './visualizations/regional-map'
import { LeafletMapBlock } from './visualizations/leaflet-map'
import { LeafletFlowMapBlock } from './visualizations/leaflet-flow-map'

function App() {
  return html.div(
    attr.class('app'),
    html.div(
      attr.class('panel header'),
      html.div(attr.class('title'), 'Tempo × Unovis'),
      html.div(attr.class('pill'), 'Reactive charts')
    ),
    html.div(
      attr.class('panel'),
      RandomWalkChart(),
      SineWaveChart(),
      ScatterClustersChart(),
      StackedBarsChart(),
      GroupedBarsChart(),
      TimelineChart(),
      DonutBlock(),
      TreemapBlock(),
      NestedDonutBlock(),
      SankeyBlock(),
      ChordBlock(),
      GraphBlock(),
      LegendsSection(),
      RegionalMapBlock(),
      LeafletMapBlock(),
      LeafletFlowMapBlock()
    )
  )
}

render(App(), document.getElementById('app')!)
