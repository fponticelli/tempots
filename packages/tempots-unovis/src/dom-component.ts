import type { Renderable, Value as DomValue } from '@tempots/dom'
import {
  OnDispose,
  Value as ValueUtil,
  WithElement,
  attr,
  html,
} from '@tempots/dom'

type Cleanup = () => void

export interface DomComponentProps<Config, Data = undefined> {
  config?: DomValue<Partial<Config>>
  data?: DomValue<Data>
  className?: DomValue<string | null | undefined>
  style?: DomValue<string | null | undefined>
}

export interface DomComponentLifecycle<Config, Data = undefined> {
  updateConfig?: (config: Partial<Config>) => void
  updateData?: (data: Data) => void
  destroy?: () => void
}

export const createDomComponent = <Config, Data = undefined>(
  props: DomComponentProps<Config, Data>,
  init: (
    element: HTMLDivElement,
    initial: { config: Partial<Config>; data?: Data }
  ) => DomComponentLifecycle<Config, Data>
): Renderable => {
  return html.div(
    attr.class(props.className),
    attr.style(props.style),
    WithElement<HTMLDivElement>(element => {
      const cleanupFns: Cleanup[] = []

      const initialConfig =
        props.config !== undefined
          ? (ValueUtil.get(props.config as DomValue<Partial<Config>>) ?? {})
          : {}
      const initialData =
        props.data !== undefined
          ? (ValueUtil.get(props.data as DomValue<Data>) as Data)
          : undefined

      const api = init(element, { config: initialConfig, data: initialData })

      if (props.config && api.updateConfig) {
        cleanupFns.push(
          ValueUtil.on(props.config as DomValue<Partial<Config>>, cfg =>
            api.updateConfig?.((cfg ?? {}) as Partial<Config>)
          )
        )
      }

      if (props.data && api.updateData) {
        cleanupFns.push(
          ValueUtil.on(props.data as DomValue<Data>, data =>
            api.updateData?.(data as Data)
          )
        )
      }

      return OnDispose(() => {
        cleanupFns.forEach(fn => fn())
        api.destroy?.()
      })
    })
  )
}
