import {
  TNode,
  DOMContext,
  OnMount,
  Signal,
  Value,
  html,
  Portal,
  When,
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
  readonly placement?: Placement

  /**
   * Specifies the offset of the PopOver.
   * This is an optional property.
   */
  readonly offset?: {
    /**
     * Specifies the offset on the main axis.
     */
    readonly mainAxis?: number

    /**
     * Specifies the offset on the cross axis.
     */
    readonly crossAxis?: number
  }
}

/**
 * Renders a PopOver component.
 *
 * @param props - The properties for the PopOver component.
 * @returns The rendered PopOver component.
 * @public
 */
export const PopOver =
  ({
    content,
    open,
    placement,
    offset: { mainAxis, crossAxis } = { mainAxis: 0, crossAxis: 0 },
  }: PopOverOptions) =>
  (ctx: DOMContext) => {
    const target = ctx.element
    const isOpen = Signal.wrap(open)

    return When(
      isOpen,
      Portal(
        'body',
        html.div(
          OnMount((element: HTMLElement) => {
            const floatingEl = element
            floatingEl.style.position = 'absolute'
            return autoUpdate(target, floatingEl, () => {
              computePosition(target, floatingEl, {
                placement,
                strategy: 'absolute',
                middleware: [
                  flip(),
                  fuiOffset({ mainAxis, crossAxis }),
                  shift(),
                  flip(),
                ],
              }).then(({ x, y }) => {
                floatingEl.style.top = `${y}px`
                floatingEl.style.left = `${x}px`
              })
            })
          }),
          content()
        )
      )
    )(ctx)
  }
