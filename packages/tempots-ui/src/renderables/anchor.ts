import {
  attr,
  TNode,
  html,
  on,
  Signal,
  Value,
  Renderable,
  Use,
} from '@tempots/dom'
import { Location, type NavigationOptions } from './router/location'
import {
  handleAnchorClick,
  HandleAnchorClickOptions,
} from '../dom/handle-anchor-click'
import { Merge } from '@tempots/std'

/**
 * Options for configuring an anchor element.
 * @public
 */
export type AnchorOptions = Merge<
  {
    /**
     * The href attribute of the anchor element.
     * Can be a string or a Signal containing a string.
     */
    href: Value<string>
  } & NavigationOptions,
  HandleAnchorClickOptions
>
/**
 * Represents either a string value (or Signal of string) for the href,
 * or a full AnchorOptions object.
 *
 * This type is used as the first parameter of the Anchor function,
 * allowing for flexible configuration of anchor elements.
 *
 * @public
 */
export type HrefOrAnchorOptions = Value<string> | AnchorOptions

/**
 * Creates an anchor element with the specified href and children.
 * When the anchor element is clicked, the location is updated to the specified href.
 *
 * @param hrefOrOptions - The href attribute of the anchor element.
 * @param children - The child elements of the anchor element.
 * @returns The anchor element.
 * @public
 */
export const Anchor = (
  hrefOrOptions: HrefOrAnchorOptions,
  ...children: TNode[]
): Renderable => {
  if (
    typeof hrefOrOptions === 'string' ||
    Signal.is(hrefOrOptions as Value<string>)
  ) {
    return Anchor({ href: hrefOrOptions as Value<string> }, ...children)
  }
  const { href, state, scroll, viewTransition, replace, ...options } =
    hrefOrOptions as AnchorOptions
  /* c8 ignore next 16 */
  return Use(Location, location => {
    return html.a(
      on.click(
        handleAnchorClick(() => {
          let hasNavigationOption = false
          const navigationOptions: NavigationOptions = {}
          if (state !== undefined) {
            navigationOptions.state = state
            hasNavigationOption = true
          }
          if (scroll !== undefined) {
            navigationOptions.scroll = scroll
            hasNavigationOption = true
          }
          if (viewTransition !== undefined) {
            navigationOptions.viewTransition = viewTransition
            hasNavigationOption = true
          }
          if (replace !== undefined) {
            navigationOptions.replace = replace
            hasNavigationOption = true
          }
          location.navigate(
            Value.get(href),
            hasNavigationOption ? navigationOptions : undefined
          )
          return true
        }, options)
      ),
      attr.href(href),
      ...children
      /* c8 ignore next 2 */
    )
  })
}
