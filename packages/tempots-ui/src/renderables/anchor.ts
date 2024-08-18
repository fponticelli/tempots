import { attr, TNode, html, on, Signal, Value, Renderable } from '@tempots/dom'
import { setLocationFromUrl, UseLocation } from './router/location'
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
  },
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
  if (typeof hrefOrOptions === 'string' || Signal.is(hrefOrOptions)) {
    return Anchor({ href: hrefOrOptions as Value<string> }, ...children)
  }
  const { href, ...options } = hrefOrOptions as AnchorOptions
  return UseLocation(location => {
    return html.a(
      on.click(
        handleAnchorClick(() => {
          setLocationFromUrl(location, Signal.unwrap(href))
          return true
        }, options)
      ),
      attr.href(href),
      ...children
    )
  })
}
