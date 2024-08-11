import {
  attr,
  OnCtx,
  DOMContext,
  html,
  Prop,
  Signal,
  Value,
} from '@tempots/dom'
import { UseLocation, LocationData, handleAnchorClick } from '@tempots/ui'
import { Styles } from '../styles'
import { navigateTo } from '../../utils/scroll-to'

const updateAnchors = (location: Prop<LocationData>, el: HTMLElement) => {
  const anchors = el.querySelectorAll('a')
  for (const anchor of anchors) {
    const href = anchor.getAttribute('href') ?? ''
    anchor.addEventListener(
      'click',
      handleAnchorClick(
        () => {
          navigateTo(location, href)
          return true
        },
        {
          ignoreUrlWithExtension: true,
          allowedExtensions: ['.html'],
          ignoreExternalUrl: true,
        }
      )
    )
  }
}

export function EmbedHTMLFragment(content: Value<string>) {
  const htmlSignal = Signal.wrap(content)
  return html.div(
    attr.class(
      'flex flex-col flex-col-reverse xl:flex-row gap-4 xl:justify-between'
    ),
    html.div(
      attr.class(Styles.prose),
      attr.innerHTML(htmlSignal),
      UseLocation(location =>
        OnCtx((ctx: DOMContext) => {
          return htmlSignal.on(() => {
            updateAnchors(location, ctx.element as HTMLElement)
          })
        })
      )
    )
  )
}

export function EmbedHTMLFragmentFromURL(url: Value<string>) {
  const content = Signal.wrap(url).mapAsync(
    async url => (await fetch(url)).text(),
    ''
  )
  return EmbedHTMLFragment(content)
}
