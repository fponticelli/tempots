import {
  attr,
  TNode,
  handleAnchorClick,
  html,
  on,
  Signal,
  Value,
} from '@tempots/dom'
import { setLocationFromUrl, UseLocation } from './router/location'

/**
 * Creates an anchor element with the specified href and children.
 * When the anchor element is clicked, the location is updated to the specified href.
 *
 * @param href - The href attribute of the anchor element.
 * @param children - The child elements of the anchor element.
 * @returns The anchor element.
 * @public
 */
export const Anchor = (href: Value<string>, ...children: TNode[]) =>
  UseLocation(location => {
    return html.a(
      on.click(
        handleAnchorClick(() => {
          setLocationFromUrl(location, Signal.unwrap(href))
          return true
        })
      ),
      attr.href(href),
      ...children
    )
  })
