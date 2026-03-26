import {
  TNode,
  WithElement,
  Value,
  html,
  Portal,
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
import { OnClickOutside } from './onclickoutside'

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
 * Represents all possible placements for a pop-over.
 *
 * @public
 */
export const allPlacements: Placement[] = [
  'top',
  'top-start',
  'top-end',
  'right',
  'right-start',
  'right-end',
  'bottom',
  'bottom-start',
  'bottom-end',
  'left',
  'left-start',
  'left-end',
]

/**
 * Represents the options for the arrow of a pop-over.
 *
 * @public
 */
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
 * Represents the properties for a pop-over.
 *
 * @public
 */
export type PopOverOptions = {
  /**
   * Specifies the content of the PopOver.
   * This should be a function that returns a TNode.
   */
  content: TNode

  /**
   * Specifies the placement of the PopOver.
   * This is an optional property.
   */
  placement?: Value<Placement>

  /**
   * Specifies the offset on the main axis.
   */
  mainAxisOffset?: Value<number>

  /**
   * Specifies the offset on the cross axis.
   */
  crossAxisOffset?: Value<number>

  /**
   * Specifies the padding between the arrow and the edges of the floating element.
   */
  arrowPadding?: Value<number>
  /**
   * Specifies the content of the arrow.
   */
  arrow?: (signal: Signal<PopOverArrowOptions>) => TNode

  /**
   * Specifies the target element for the PopOver. If not provided, the PopOver will be
   * positioned relative to the parent element.
   */
  target?: string | HTMLElement

  /**
   * Specifies a function to be called when a click occurs outside of the PopOver.
   */
  onClickOutside?: () => void
}

/**
 * Creates a pop-over component.
 *
 * @param fn - A function that returns the content of the pop-over.
 * @param options - The options for the pop-over.
 * @returns The pop-over component.
 * @public
 */
export const PopOver = (
  fn: (open: (options: PopOverOptions) => void, close: () => void) => TNode,
  options: { isOpen: Value<boolean> } = { isOpen: false }
) => {
  let properties: PopOverOptions | null = null
  const isOpen = Value.deriveProp(options.isOpen)
  function open(passOptions: PopOverOptions) {
    properties = passOptions
    isOpen.set(true)
  }
  function close() {
    isOpen.set(false)
  }
  return Fragment(
    fn(open, close),
    When(isOpen, () =>
      Fragment(
        properties?.onClickOutside != null
          ? OnClickOutside(properties.onClickOutside)
          : null,
        WithElement(parentElement =>
          Portal(
            'body',
            html.div(
              WithElement((floatingEl: HTMLElement) => {
                floatingEl.style.position = 'absolute'
                floatingEl.style.width = 'max-content'
                const target =
                  typeof properties?.target === 'string'
                    ? (parentElement!.querySelector(
                        properties.target
                      ) as HTMLElement)
                    : (properties?.target ?? parentElement!)
                /* c8 ignore next 3 */
                if (target == null) {
                  throw new Error(`Target not found: ${properties?.target}`)
                }
                // Create and manage arrow element
                let arrowEl: HTMLElement | null = null
                const mainAxis = Value.toSignal(properties?.mainAxisOffset ?? 0)
                const crossAxis = Value.toSignal(
                  properties?.crossAxisOffset ?? 0
                )
                const placement = Value.toSignal(
                  /* c8 ignore next 3 */
                  properties?.placement ?? 'top'
                )
                const arrowPadding = Value.toSignal(
                  properties?.arrowPadding ?? 0
                )
                const arrowOption = properties?.arrow
                const arrowSignal = prop<
                  Omit<PopOverArrowOptions, 'placement'>
                >({
                  centerOffset: 0,
                  alignmentOffset: 0,
                  containerWidth: 0,
                  containerHeight: 0,
                  x: undefined,
                  y: undefined,
                })

                async function updatePosition() {
                  const middleware = [
                    flip(),
                    fuiOffset({
                      mainAxis: mainAxis.get(),
                      crossAxis: crossAxis.get(),
                    }),
                    shift(),
                  ]

                  // Add arrow middleware if arrow element exists
                  if (arrowOption != null && arrowEl != null) {
                    middleware.push(
                      arrow({
                        element: arrowEl,
                        padding: arrowPadding.get(),
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
                  properties?.content,
                  properties?.arrow != null
                    ? html.div(
                        properties?.arrow(
                          computedOf(
                            arrowSignal,
                            placement
                          )(
                            (arrow, placement): PopOverArrowOptions => ({
                              ...arrow,
                              placement,
                            })
                          )
                        ),
                        WithElement(el => {
                          arrowEl = el
                          updatePosition()
                        })
                      )
                    : null,
                  // arrowSignal is automatically disposed by the scope
                  OnDispose(
                    autoUpdate(target, floatingEl, updatePosition),
                    cancel
                  )
                )
              })
            )
          )
        )
      )
    )
  )
}
