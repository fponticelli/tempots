import {
  attr,
  Child,
  handleAnchorClick,
  html,
  on,
  Signal,
  Value,
} from '@tempots/dom'
import { setLocationFromUrl, UseLocation } from './router/location'

export function Anchor(href: Value<string>, ...children: Child[]) {
  return UseLocation(location => {
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
}
