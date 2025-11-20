import { prop } from '@tempots/core'
import { describe, expect, it, vi } from 'vitest'
import { render } from '@tempots/dom'
import {
  UNOVIS_RENDERABLE_TYPE,
  UnovisAxis,
  UnovisLine,
  UnovisTooltip,
  UnovisXYContainer,
  createUnovisCollector,
} from '../src'

const lineSetConfig = vi.fn()
const axisSetConfig = vi.fn()
const tooltipSetConfig = vi.fn()

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
    const renderable = UnovisLine()
    expect(renderable.type).toBe(UNOVIS_RENDERABLE_TYPE)
  })

  it('collects components into a container', () => {
    const collector = createUnovisCollector()
    const line = UnovisLine({ config: { lineWidth: 2 } })
    const axis = UnovisAxis()
    const tooltip = UnovisTooltip()

    const lineClear = line.render(collector.ctx)
    const axisClear = axis.render(collector.ctx)
    const tooltipClear = tooltip.render(collector.ctx)

    const { components, attachments } = collector.finish()

    expect(components).toHaveLength(1)
    expect(attachments.tooltip).toBeDefined()
    expect(attachments.xAxis).toBeDefined()

    lineClear(true)
    axisClear(true)
    tooltipClear(true)
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
        UnovisLine(),
        UnovisAxis({ role: 'y' }),
        UnovisTooltip()
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
