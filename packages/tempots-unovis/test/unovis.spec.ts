import { prop } from '@tempots/core'
import { describe, expect, it, vi } from 'vitest'
import { render } from '@tempots/dom'
import {
  UNOVIS_RENDERABLE_TYPE,
  UVisAxis,
  UVisLine,
  UVisTooltip,
  UnovisXYContainer,
  UVisArea,
  UVisScatter,
  UVisCrosshair,
  UVisBrush,
  UVisStackedBar,
  UVisGroupedBar,
  UnovisXYLabels,
  UVisPlotBand,
  UVisPlotLine,
  UVisAnnotations,
  UVisFreeBrush,
  createUnovisCollector,
} from '../src'

const lineSetConfig = vi.fn()
const axisSetConfig = vi.fn()
const tooltipSetConfig = vi.fn()
const crosshairSetConfig = vi.fn()
const brushSetConfig = vi.fn()
const areaSetConfig = vi.fn()
const scatterSetConfig = vi.fn()
const stackedSetConfig = vi.fn()
const groupedSetConfig = vi.fn()
const labelsSetConfig = vi.fn()
const plotBandSetConfig = vi.fn()
const plotLineSetConfig = vi.fn()
const annotationsSetConfig = vi.fn()
const freeBrushSetConfig = vi.fn()

const containers: Array<{
  element: HTMLElement
  data: unknown[]
  config: Record<string, unknown>
  destroyed: boolean
}> = []

vi.mock('@unovis/ts', () => {
  class FakeLine {
    config: Record<string, unknown>
    constructor(config: Record<string, unknown>) {
      this.config = { ...config }
    }
    setConfig = lineSetConfig.mockImplementation(cfg => {
      this.config = { ...this.config, ...cfg }
    })
    destroy() {}
  }

  class FakeAxis {
    config: Record<string, unknown>
    constructor(config: Record<string, unknown>) {
      this.config = { ...config }
    }
    setConfig = axisSetConfig.mockImplementation(cfg => {
      this.config = { ...this.config, ...cfg }
    })
    destroy() {}
  }

  class FakeCrosshair {
    config: Record<string, unknown>
    constructor(config: Record<string, unknown>) {
      this.config = { ...config }
    }
    setConfig = crosshairSetConfig.mockImplementation(cfg => {
      this.config = { ...this.config, ...cfg }
    })
    destroy() {}
  }

  class FakeBrush {
    config: Record<string, unknown>
    constructor(config: Record<string, unknown>) {
      this.config = { ...config }
    }
    setConfig = brushSetConfig.mockImplementation(cfg => {
      this.config = { ...this.config, ...cfg }
    })
    destroy() {}
  }

  class FakeArea {
    config: Record<string, unknown>
    constructor(config: Record<string, unknown>) {
      this.config = { ...config }
    }
    setConfig = areaSetConfig.mockImplementation(cfg => {
      this.config = { ...this.config, ...cfg }
    })
    destroy() {}
  }

  class FakeScatter {
    config: Record<string, unknown>
    constructor(config: Record<string, unknown>) {
      this.config = { ...config }
    }
    setConfig = scatterSetConfig.mockImplementation(cfg => {
      this.config = { ...this.config, ...cfg }
    })
    destroy() {}
  }

  class FakeStackedBar {
    config: Record<string, unknown>
    constructor(config: Record<string, unknown>) {
      this.config = { ...config }
    }
    setConfig = stackedSetConfig.mockImplementation(cfg => {
      this.config = { ...this.config, ...cfg }
    })
    destroy() {}
  }

  class FakeTooltip {
    config: Record<string, unknown>
    constructor(config: Record<string, unknown>) {
      this.config = { ...config }
    }
    setConfig = tooltipSetConfig.mockImplementation(cfg => {
      this.config = { ...this.config, ...cfg }
    })
    destroy() {}
  }

  class FakeGroupedBar {
    config: Record<string, unknown>
    constructor(config: Record<string, unknown>) {
      this.config = { ...config }
    }
    setConfig = groupedSetConfig.mockImplementation(cfg => {
      this.config = { ...this.config, ...cfg }
    })
    destroy() {}
  }

  class FakeXYLabels {
    config: Record<string, unknown>
    constructor(config: Record<string, unknown>) {
      this.config = { ...config }
    }
    setConfig = labelsSetConfig.mockImplementation(cfg => {
      this.config = { ...this.config, ...cfg }
    })
    destroy() {}
  }

  class FakePlotband {
    config: Record<string, unknown>
    constructor(config: Record<string, unknown>) {
      this.config = { ...config }
    }
    setConfig = plotBandSetConfig.mockImplementation(cfg => {
      this.config = { ...this.config, ...cfg }
    })
    destroy() {}
  }

  class FakePlotline {
    config: Record<string, unknown>
    constructor(config: Record<string, unknown>) {
      this.config = { ...config }
    }
    setConfig = plotLineSetConfig.mockImplementation(cfg => {
      this.config = { ...this.config, ...cfg }
    })
    destroy() {}
  }

  class FakeAnnotations {
    config: Record<string, unknown>
    constructor(config: Record<string, unknown>) {
      this.config = { ...config }
    }
    setConfig = annotationsSetConfig.mockImplementation(cfg => {
      this.config = { ...this.config, ...cfg }
    })
    destroy() {}
  }

  class FakeFreeBrush {
    config: Record<string, unknown>
    constructor(config: Record<string, unknown>) {
      this.config = { ...config }
    }
    setConfig = freeBrushSetConfig.mockImplementation(cfg => {
      this.config = { ...this.config, ...cfg }
    })
    destroy() {}
  }

  class FakeXYContainer {
    element: HTMLElement
    data: unknown[]
    config: Record<string, unknown>
    destroyed = false
    constructor(
      element: HTMLElement,
      config: Record<string, unknown>,
      data: unknown[]
    ) {
      this.element = element
      this.config = { ...config }
      this.data = data ?? []
      containers.push(this)
    }
    setData(data: unknown[]) {
      this.data = data ?? []
    }
    updateContainer(config: Record<string, unknown>) {
      this.config = { ...this.config, ...config }
    }
    destroy() {
      this.destroyed = true
    }
  }

  return {
    Line: FakeLine,
    Axis: FakeAxis,
    Crosshair: FakeCrosshair,
    Brush: FakeBrush,
    Area: FakeArea,
    Scatter: FakeScatter,
    StackedBar: FakeStackedBar,
    GroupedBar: FakeGroupedBar,
    XYLabels: FakeXYLabels,
    Plotband: FakePlotband,
    Plotline: FakePlotline,
    Annotations: FakeAnnotations,
    FreeBrush: FakeFreeBrush,
    Tooltip: FakeTooltip,
    XYContainer: FakeXYContainer,
    AxisType: {
      X: 'x',
      Y: 'y',
    },
  }
})

describe('Unovis renderables', () => {
  it('brands unovis renderables', () => {
    const renderable = UVisLine()
    expect(renderable.type).toBe(UNOVIS_RENDERABLE_TYPE)
  })

  it('collects components into a container', () => {
    const collector = createUnovisCollector()
    const line = UVisLine({ config: { lineWidth: 2 } })
    const axis = UVisAxis()
    const tooltip = UVisTooltip()
    const crosshair = UVisCrosshair()
    const brush = UVisBrush()
    const area = UVisArea()
    const scatter = UVisScatter()
    const stacked = UVisStackedBar()
    const grouped = UVisGroupedBar()
    const labels = UnovisXYLabels()
    const band = UVisPlotBand()
    const plotline = UVisPlotLine()
    const annotations = UVisAnnotations()
    const freeBrush = UVisFreeBrush()

    const lineClear = line.render(collector.ctx)
    const axisClear = axis.render(collector.ctx)
    const tooltipClear = tooltip.render(collector.ctx)
    const crosshairClear = crosshair.render(collector.ctx)
    const brushClear = brush.render(collector.ctx)
    const areaClear = area.render(collector.ctx)
    const scatterClear = scatter.render(collector.ctx)
    const stackedClear = stacked.render(collector.ctx)
    const groupedClear = grouped.render(collector.ctx)
    const labelsClear = labels.render(collector.ctx)
    const bandClear = band.render(collector.ctx)
    const plotlineClear = plotline.render(collector.ctx)
    const annotationsClear = annotations.render(collector.ctx)
    const freeBrushClear = freeBrush.render(collector.ctx)

    const { components, attachments } = collector.finish()

    expect(components).toHaveLength(10)
    expect(attachments.tooltip).toBeDefined()
    expect(attachments.xAxis).toBeDefined()
    expect(attachments.crosshair).toBeDefined()
    expect(attachments.annotations).toBeDefined()

    lineClear(true)
    axisClear(true)
    tooltipClear(true)
    crosshairClear(true)
    brushClear(true)
    areaClear(true)
    scatterClear(true)
    stackedClear(true)
    groupedClear(true)
    labelsClear(true)
    bandClear(true)
    plotlineClear(true)
    annotationsClear(true)
    freeBrushClear(true)
  })

  it('bridges to DOM with reactive data and config', () => {
    const data = prop([{ x: 0, y: 1 }])
    const margin = prop({ margin: { top: 10 } })
    containers.splice(0, containers.length)

    const clear = render(
      UnovisXYContainer(
        {
          data,
          config: margin,
        },
        UVisLine(),
        UVisAxis({ role: 'y' }),
        UVisTooltip(),
        UVisCrosshair()
      ),
      document.body
    )

    expect(containers).toHaveLength(1)
    const instance = containers[0]
    expect(instance.data).toEqual([{ x: 0, y: 1 }])
    expect((instance.config.margin as { top: number } | undefined)?.top).toBe(
      10
    )
    expect(instance.config.components).toHaveLength(1)
    expect(instance.config.yAxis).toBeDefined()
    expect(instance.config.tooltip).toBeDefined()

    data.set([{ x: 1, y: 2 }])
    margin.set({ margin: { top: 20 } })

    expect(instance.data).toEqual([{ x: 1, y: 2 }])
    expect((instance.config.margin as { top: number } | undefined)?.top).toBe(
      20
    )

    clear()
    expect(instance.destroyed).toBe(true)
  })
})
