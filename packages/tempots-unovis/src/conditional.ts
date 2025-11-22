import type { Value, Signal } from '@tempots/core'
import { Value as ValueUtil, signal } from '@tempots/core'
import type { UnovisRenderable, UnovisContext } from './types'
import { unovisRenderable } from './types'
import { UVisEmpty } from './components/empty'

/**
 * Conditionally renders Unovis content based on a boolean.
 */
export const UVisWhen = <Datum = unknown, Data = Datum[]>(
  condition: Value<boolean>,
  then: () => UnovisRenderable<Datum, Data>,
  otherwise?: () => UnovisRenderable<Datum, Data>
): UnovisRenderable<Datum, Data> =>
  unovisRenderable((ctx: UnovisContext<Datum, Data>) => {
    const cond = ValueUtil.toSignal(condition)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let clear = (_removeTree: boolean) => {}

    const renderBranch = (isTrue: boolean) => {
      clear(true)
      const branch = isTrue
        ? then()
        : (otherwise?.() ?? UVisEmpty<Datum, Data>())
      clear = branch.render(ctx)
    }

    const off = cond.on(renderBranch)

    return removeTree => {
      off()
      clear(removeTree)
    }
  })

/**
 * Ensures a nullable value is present before rendering Unovis content.
 */
export const UVisEnsure = <T, Datum = unknown, Data = Datum[]>(
  value: Value<T | null | undefined>,
  then: (value: Signal<NonNullable<T>>) => UnovisRenderable<Datum, Data>,
  otherwise?: () => UnovisRenderable<Datum, Data>
): UnovisRenderable<Datum, Data> => {
  const valSignal = ValueUtil.toSignal(value)
  return UVisWhen(
    valSignal.map(v => v != null),
    () => {
      const feed = signal(valSignal.get() as NonNullable<T>)
      const off = valSignal.onChange(v => {
        if (v != null && feed.get() !== v) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;(feed as any).set(v as NonNullable<T>)
        }
      })
      return unovisRenderable(ctx => {
        const clear = then(feed).render(ctx)
        return removeTree => {
          off()
          clear(removeTree)
        }
      })
    },
    otherwise
  )
}
