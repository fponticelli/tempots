import type { Renderable } from '@tempots/dom'
import { OnDispose, Value, WithElement } from '@tempots/dom'

export interface UnovisComponentOptions<Config, Data = undefined> {
  config?: Value<Partial<Config>>
  data?: Value<Data>
}

export interface DomComponentLifecycle<Config, Data = undefined> {
  updateConfig?: (config: Partial<Config>) => void
  updateData?: (data: Data) => void
  destroy?: () => void
}

export const createDomComponent = <Config, Data = undefined>(
  options: UnovisComponentOptions<Config, Data>,
  init: (
    element: HTMLDivElement,
    initial: { config: Partial<Config>; data?: Data }
  ) => DomComponentLifecycle<Config, Data>
): Renderable => {
  return WithElement<HTMLDivElement>(element => {
    const initialConfig =
      options.config !== undefined
        ? (Value.get(options.config as Value<Partial<Config>>) ?? {})
        : {}
    const initialData =
      options.data !== undefined
        ? (Value.get(options.data as Value<Data>) as Data)
        : undefined

    const api = init(element, { config: initialConfig, data: initialData })

    if (options.config && api.updateConfig) {
      Value.on(options.config as Value<Partial<Config>>, cfg =>
        api.updateConfig?.((cfg ?? {}) as Partial<Config>)
      )
    }

    if (options.data && api.updateData) {
      Value.on(options.data as Value<Data>, data =>
        api.updateData?.(data as Data)
      )
    }

    return OnDispose(() => {
      api.destroy?.()
    })
  })
}
