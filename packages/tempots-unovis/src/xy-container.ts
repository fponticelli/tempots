import type { Renderable, Value as DomValue } from '@tempots/dom'
import {
  OnDispose,
  Signal,
  Value as ValueUtil,
  WithElement,
  html,
} from '@tempots/dom'
import type { XYContainerConfigInterface } from '@unovis/ts'
import { XYContainer } from '@unovis/ts'
import { createUnovisCollector } from './collector'
import type { UnovisRenderable } from './types'

type Cleanup = () => void

export interface UnovisXYContainerProps<Datum> {
  data: DomValue<Datum[]>
  config?: DomValue<Partial<XYContainerConfigInterface<Datum>>>
  className?: DomValue<string | null | undefined>
  style?: DomValue<Partial<CSSStyleDeclaration> | null | undefined>
  children?: UnovisRenderable<Datum> | UnovisRenderable<Datum>[]
}

export const UnovisXYContainer = <Datum>(
  props: UnovisXYContainerProps<Datum>,
  ...children: UnovisRenderable<Datum>[]
): Renderable => {
  const allChildren: UnovisRenderable<Datum>[] = [
    ...(props.children
      ? Array.isArray(props.children)
        ? props.children
        : [props.children]
      : []),
    ...children,
  ]

  const applyClassName = (
    element: HTMLElement,
    value?: string | null | undefined
  ) => {
    if (value == null) {
      element.removeAttribute('class')
    } else {
      element.className = value
    }
  }

  const applyStyle = (
    element: HTMLElement,
    value?: Partial<CSSStyleDeclaration> | null
  ) => {
    element.removeAttribute('style')
    if (!value) return
    for (const [key, styleValue] of Object.entries(value)) {
      if (styleValue == null)
        continue
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(element.style as any)[key] = styleValue as any
    }
  }

  return html.div(
    WithElement<HTMLDivElement>(element => {
      const cleanupFns: Cleanup[] = []

      const collector = createUnovisCollector<Datum>()
      const childClears = allChildren.map(child => child.render(collector.ctx))
      const { components, attachments } = collector.finish()

      const initialConfig = {
        ...(props.config
          ? ValueUtil.get(
              props.config as DomValue<
                Partial<XYContainerConfigInterface<Datum>>
              >
            )
          : {}),
        ...attachments,
        components,
      }

      const chart = new XYContainer<Datum>(
        element,
        initialConfig,
        ValueUtil.get(props.data)
      )

      const classCleanup =
        props.className &&
        Signal.is(
          props.className as unknown as Signal<string | null | undefined>
        )
          ? (
              props.className as unknown as Signal<string | null | undefined>
            ).on(value => applyClassName(element, value))
          : undefined

      const styleCleanup =
        props.style &&
        Signal.is(
          props.style as unknown as Signal<
            Partial<CSSStyleDeclaration> | null | undefined
          >
        )
          ? (
              props.style as unknown as Signal<
                Partial<CSSStyleDeclaration> | null | undefined
              >
            ).on(value => applyStyle(element, value ?? null))
          : undefined

      if (props.className !== undefined) {
        applyClassName(
          element,
          ValueUtil.get(props.className as DomValue<string | null>)
        )
      }

      if (props.style !== undefined) {
        applyStyle(
          element,
          ValueUtil.get(
            props.style as DomValue<
              Partial<CSSStyleDeclaration> | null | undefined
            >
          ) ?? null
        )
      }

      childClears.forEach(clear => cleanupFns.push(() => clear(true)))

      cleanupFns.push(
        ValueUtil.on(props.data, next => chart.setData(next ?? []))
      )

      if (props.config !== undefined) {
        cleanupFns.push(
          ValueUtil.on(
            props.config as DomValue<
              Partial<XYContainerConfigInterface<Datum>>
            >,
            next => {
              chart.updateContainer({
                ...(next ?? {}),
                ...attachments,
                components,
              })
            }
          )
        )
      }

      if (classCleanup) cleanupFns.push(() => classCleanup())
      if (styleCleanup) cleanupFns.push(() => styleCleanup())

      return OnDispose(() => {
        cleanupFns.forEach(fn => fn())
        chart.destroy()
      })
    })
  )
}
