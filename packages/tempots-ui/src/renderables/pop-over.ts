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
  Fragment,
  prop,
  Signal,
  computedOf,
} from '@tempots/dom'
import {
  autoUpdate,
  computePosition,
  flip,
  offset as fuiOffset,
  shift,
  arrow,
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
  open: Value<boolean>

  /**
   * Specifies the content of the PopOver.
   * This should be a function that returns a TNode.
   */
  content: () => TNode

  /**
   * Specifies the placement of the PopOver.
   * This is an optional property.
   */
  placement?: Value<Placement>

  /**
   * Specifies the offset of the PopOver.
   * This is an optional property.
   */
  offset?: Value<{
    /**
     * Specifies the offset on the main axis.
     */
    mainAxis?: number

    /**
     * Specifies the offset on the cross axis.
     */
    crossAxis?: number
  }>

  /**
   * Specifies the arrow configuration for the PopOver.
   * When provided, an arrow element will be created and positioned.
   * This is an optional property.
   */
  arrow?: {
    /**
     * Specifies the padding between the arrow and the edges of the floating element.
     */
    padding?: number
    /**
     * Specifies the content of the arrow.
     */
    content?: (signal: Signal<PopOverArrowOptions>) => TNode
  }
}

export type PopOverArrowOptions = {
  x?: number
  y?: number
  centerOffset: number
  alignmentOffset?: number
  placement: Placement
  containerWidth: number
  containerHeight: number
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
  placement: placementOption,
  offset = { mainAxis: 0, crossAxis: 0 },
  arrow: arrowOption,
}: PopOverOptions) =>
  WithBrowserCtx((ctx: BrowserContext) => {
    const isOpen = Value.toSignal(open)
    const target = ctx.element
    const offsetSignal = Value.toSignal(offset)
    const mainAxis = offsetSignal.$.mainAxis.map(v => v ?? 0)
    const crossAxis = offsetSignal.$.crossAxis.map(v => v ?? 0)
    const placement = Value.toSignal(placementOption ?? 'top')
    const arrowSignal = prop<Omit<PopOverArrowOptions, 'placement'>>({
      centerOffset: 0,
      alignmentOffset: 0,
      containerWidth: 0,
      containerHeight: 0,
      x: undefined,
      y: undefined,
    })

    return When(isOpen, () =>
      Portal(
        'body',
        html.div(
          WithElement((element: HTMLElement) => {
            const floatingEl = element
            floatingEl.style.position = 'absolute'

            // Create and manage arrow element
            let arrowEl: HTMLElement | null = null

            async function updatePosition() {
              const middleware = [
                flip(),
                fuiOffset({
                  mainAxis: mainAxis.get(),
                  crossAxis: crossAxis.get(),
                }),
                shift(),
                flip(),
              ]

              // Add arrow middleware if arrow element exists
              if (arrowOption != null && arrowEl != null) {
                middleware.push(
                  arrow({
                    element: arrowEl,
                    padding: arrowOption?.padding ?? 0,
                  })
                )
              }

              const result = await computePosition(target, floatingEl, {
                placement: placement.get(),
                strategy: 'absolute',
                middleware,
              })

              const { x, y, middlewareData } = result
              floatingEl.style.top = `${y}px`
              floatingEl.style.left = `${x}px`

              // Position arrow if it exists
              if (arrowEl != null && middlewareData.arrow != null) {
                const {
                  x: arrowX,
                  y: arrowY,
                  centerOffset,
                  alignmentOffset,
                } = middlewareData.arrow
                arrowSignal.set({
                  x: arrowX,
                  y: arrowY,
                  centerOffset,
                  alignmentOffset,
                  containerWidth: floatingEl.offsetWidth,
                  containerHeight: floatingEl.offsetHeight,
                })
              }
            }

            const cancel = effectOf(
              mainAxis,
              crossAxis,
              placement
            )(updatePosition)
            return Fragment(
              arrowOption != null
                ? html.div(
                    arrowOption.content?.(
                      computedOf(
                        arrowSignal,
                        placement
                      )((arrow, placement) => ({
                        ...arrow,
                        placement,
                      }))
                    ),
                    WithElement(el => {
                      arrowEl = el
                      updatePosition()
                    })
                  )
                : null,
              OnDispose(
                arrowSignal.dispose,
                autoUpdate(target, floatingEl, updatePosition),
                cancel
              )
            )
          }),
          content()
        )
      )
    )
  })
