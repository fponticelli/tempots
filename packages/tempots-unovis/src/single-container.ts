import type { Renderable, Value as DomValue } from '@tempots/dom'
import { OnDispose, Value as ValueUtil, WithElement } from '@tempots/dom'
import type { SingleContainerConfigInterface } from '@unovis/ts'
import { SingleContainer } from '@unovis/ts'
import { createUnovisCollector } from './collector'
import type { UnovisRenderable } from './types'

export interface UnovisSingleContainerOptions<Datum, Data = Datum[]> {
  data: DomValue<Data>
  config?: DomValue<Partial<SingleContainerConfigInterface<Data>>>
  children?: UnovisRenderable<Datum, Data> | UnovisRenderable<Datum, Data>[]
}

export const UnovisSingleContainer = <Datum, Data = Datum[]>(
  options: UnovisSingleContainerOptions<Datum, Data>,
  ...children: UnovisRenderable<Datum, Data>[]
): Renderable => {
  return WithElement<HTMLDivElement>(element => {
    const collector = createUnovisCollector<Datum, Data>()
    const childClears = children.map(child => child.render(collector.ctx))
    const { components, attachments } = collector.finish()

    const component = components[0]

    const initialConfig = {
      ...(options.config
        ? ValueUtil.get(
            options.config as DomValue<
              Partial<SingleContainerConfigInterface<Data>>
            >
          )
        : {}),
      component,
      tooltip: attachments.tooltip,
    }

    const chart = new SingleContainer<Data>(
      element,
      initialConfig,
      ValueUtil.get(options.data)
    )

    if (attachments.tooltip && component) {
      attachments.tooltip.setContainer?.(element)
      attachments.tooltip.setComponents?.([component])
      attachments.tooltip.setConfig({
        ...attachments.tooltip.config,
        components: [component],
      })
      setTimeout(() => attachments.tooltip?.update?.(), 0)
    }

    if (options.config !== undefined) {
      ValueUtil.on(
        options.config as DomValue<
          Partial<SingleContainerConfigInterface<Data>>
        >,
        next => {
          if (attachments.tooltip && component) {
            attachments.tooltip.setConfig({
              ...attachments.tooltip.config,
              components: [component],
            })
          }
          chart.updateContainer({
            ...(next ?? {}),
            component,
            tooltip: attachments.tooltip,
          })
        }
      )
    }

    ValueUtil.on(options.data, next => chart.setData(next))

    return OnDispose(() => {
      childClears.forEach(clear => clear(true))
      chart.destroy()
    })
  })
}
