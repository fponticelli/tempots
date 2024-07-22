import { attr, Fragment, html } from '@tempots/dom'
import { Icon } from '../element/Icon'
import { Anchor } from '@tempots/ui'

function TopLink(label: string, href: string) {
  return Anchor(href, attr.class('text-gray-600 hover:text-gray-500'), label)
}

export function TopBar() {
  return Fragment(
    html.div(attr.class('relative flex flex-1')),
    html.div(
      attr.class('flex items-center gap-x-4 lg:gap-x-6'),
      TopLink('Demos', '/all-demos.html'),
      TopLink('Tools', '/all-tools.html'),
      TopLink('Libraries', '/all-libraries.html'),
      html.div(
        attr.class('relative w-9'),
        html.a(
          attr.class('navbar-item'),
          attr.target('_blank'),
          attr.href('https://github.com/fponticelli/tempots'),
          Icon('github', attr.class('size-9'))
        )
      )
    )
  )
}
