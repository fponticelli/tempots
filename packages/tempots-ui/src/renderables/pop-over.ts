import {
  TNode,
  WithElement,
  Value,
  html,
  Portal,
  WithBrowserCtx,
  BrowserContext,
  When,
  OnDispose,
  effectOf,
} from '@tempots/dom'
import {
  autoUpdate,
  computePosition,
  flip,
  offset as fuiOffset,
  shift,
} from '@floating-ui/dom'

/**
 * Represents the placement options for a pop-over.
 *
 * @public
 */
export type Placement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'right'
  | 'right-start'
  | 'right-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'

/**
 * Represents the properties for a PopOver component.
 *
 * @public
 */
export type PopOverOptions = {
  /**
   * Specifies whether the PopOver is open or closed.
   */
  readonly open: Value<boolean>

  /**
   * Specifies the content of the PopOver.
   * This should be a function that returns a TNode.
   */
  readonly content: () => TNode

  /**
   * Specifies the placement of the PopOver.
   * This is an optional property.
   */
  readonly placement?: Value<Placement>

  /**
   * Specifies the offset of the PopOver.
   * This is an optional property.
   */
  readonly offset?: Value<{
    /**
     * Specifies the offset on the main axis.
     */
    readonly mainAxis?: number

    /**
     * Specifies the offset on the cross axis.
     */
    readonly crossAxis?: number
  }>
}

/**
 * Renders a PopOver component.
 *
 * @param props - The properties for the PopOver component.
 * @returns The rendered PopOver component.
 * @public
 */
export const PopOver = ({
  content,
  open,
  placement = 'top',
  offset = { mainAxis: 0, crossAxis: 0 },
}: PopOverOptions) =>
  WithBrowserCtx((ctx: BrowserContext) => {
    const isOpen = Value.toSignal(open)
    const target = ctx.element
    const offsetSignal = Value.toSignal(offset)
    const mainAxis = offsetSignal.$.mainAxis.map(v => v ?? 0)
    const crossAxis = offsetSignal.$.crossAxis.map(v => v ?? 0)

    return When(isOpen, () =>
      Portal(
        'body',
        html.div(
          WithElement((element: HTMLElement) => {
            const floatingEl = element
            floatingEl.style.position = 'absolute'
            async function updatePosition() {
              const { x, y } = await computePosition(target, floatingEl, {
                placement: Value.get(placement),
                strategy: 'absolute',
                middleware: [
                  flip(),
                  fuiOffset({
                    mainAxis: mainAxis.value,
                    crossAxis: crossAxis.value,
                  }),
                  shift(),
                  flip(),
                ],
              })
              floatingEl.style.top = `${y}px`
              floatingEl.style.left = `${x}px`
            }
            const cancel = effectOf(
              mainAxis,
              crossAxis,
              placement
            )(updatePosition)
            return OnDispose(
              autoUpdate(target, floatingEl, updatePosition),
              cancel
            )
          }),
          content()
        )
      )
    )
  })
