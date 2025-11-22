import type { Value } from '@tempots/core'
import { Value as ValueUtil } from '@tempots/core'
import type {
  AttachmentRole,
  UnovisAttachment,
  UnovisComponent,
  UnovisRenderable,
} from './types'
import { unovisRenderable } from './types'

type ConfigOptions<Config> = { config?: Value<Partial<Config>> }

export const componentRenderable = <
  Datum,
  Config,
  Instance extends { setConfig: (config: Config) => void },
  Data = Datum[],
>(
  create: (config: Config) => Instance,
  options: ConfigOptions<Config> = {}
): UnovisRenderable<Datum, Data> =>
  unovisRenderable<Datum, Data>(ctx => {
    const configSignal = ValueUtil.toSignal(
      options.config ?? ({} as Partial<Config>)
    )

    const instance = create(
      configSignal.get() as Config
    ) as unknown as UnovisComponent<Data>

    const off = configSignal.onChange(cfg => {
      instance.setConfig(cfg)
      instance.render()
    })

    const detach = ctx.addComponent(instance)

    return removeTree => {
      instance.destroy()
      detach(removeTree)
      off()
    }
  })

export const attachmentRenderable = <
  Datum,
  Config,
  Instance extends { setConfig: (config: Config) => void },
>(
  role: AttachmentRole,
  create: (config: Config) => Instance,
  options: ConfigOptions<Config> = {}
): UnovisRenderable<Datum> =>
  unovisRenderable<Datum>(ctx => {
    const configSignal = ValueUtil.toSignal(
      options.config ?? ({} as Partial<Config>)
    )

    const instance = create(configSignal.get() as Config)

    const off = configSignal.onChange(cfg => {
      instance.setConfig(cfg as Config)
    })

    const detach = ctx.attach({
      role,
      value: instance,
    } as unknown as UnovisAttachment<Datum>)

    return removeTree => {
      off()
      detach(removeTree)
    }
  })
