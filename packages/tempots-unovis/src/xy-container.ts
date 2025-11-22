import type { Renderable, Value as DomValue } from '@tempots/dom'
import { OnDispose, Value as ValueUtil, WithElement } from '@tempots/dom'
import type {
  XYComponentConfigInterface,
  XYComponentCore,
  XYContainerConfigInterface,
} from '@unovis/ts'
import { XYContainer } from '@unovis/ts'
import { createUnovisCollector } from './collector'
import type { UnovisRenderable } from './types'

export interface UnovisXYContainerOptions<Datum> {
  data: DomValue<Datum[]>
  config?: DomValue<Partial<XYContainerConfigInterface<Datum>>>
  children?:
    | UnovisRenderable<Datum, Datum[]>
    | UnovisRenderable<Datum, Datum[]>[]
}

export const UnovisXYContainer = <Datum>(
  options: UnovisXYContainerOptions<Datum>,
  ...children: UnovisRenderable<Datum, Datum[]>[]
): Renderable => {
  const allChildren: UnovisRenderable<Datum, Datum[]>[] = [
    ...(options.children
      ? Array.isArray(options.children)
        ? options.children
        : [options.children]
      : []),
    ...children,
  ]

  return WithElement<HTMLDivElement>(element => {
    const collector = createUnovisCollector<Datum>()
    const childClears = allChildren.map(child => child.render(collector.ctx))
    const { components, attachments } = collector.finish()
    const typedComponents = components as unknown as XYComponentCore<
      Datum,
      Partial<XYComponentConfigInterface<Datum>>
    >[]

    const initialConfig = {
      ...(options.config
        ? ValueUtil.get(
            options.config as DomValue<
              Partial<XYContainerConfigInterface<Datum>>
            >
          )
        : {}),
      ...attachments,
      components: typedComponents,
    }

    const chart = new XYContainer<Datum>(
      element,
      initialConfig,
      ValueUtil.get(options.data)
    )

    if (attachments.tooltip) {
      attachments.tooltip.setContainer?.(element)
      attachments.tooltip.setComponents?.(typedComponents)
      attachments.tooltip.setConfig({
        ...attachments.tooltip.config,
        components: typedComponents,
      })
      setTimeout(() => attachments.tooltip?.update?.(), 0)
    }

    if (options.config !== undefined) {
      ValueUtil.on(
        options.config as DomValue<Partial<XYContainerConfigInterface<Datum>>>,
        next => {
          if (attachments.tooltip) {
            attachments.tooltip.setConfig({
              ...attachments.tooltip.config,
              components: typedComponents,
            })
          }
          chart.updateContainer({
            ...(next ?? {}),
            ...attachments,
            components: typedComponents,
          })
        }
      )
    }

    ValueUtil.on(options.data, next => chart.setData(next ?? []))

    return OnDispose(() => {
      childClears.forEach(clear => clear(true))
      chart.destroy()
    })
  })
}
