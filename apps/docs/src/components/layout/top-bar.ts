import { attr, Fragment, html } from '@tempots/dom'
import { Icon } from '../element/Icon'

export function TopBar() {
  return Fragment(
    html.div(attr.class('relative flex flex-1')),
    html.div(
      attr.class('flex items-center gap-x-4 lg:gap-x-6'),
      html.button(
        attr.type('button'),
        attr.class('-m-2.5 p-2.5 text-gray-600 hover:text-gray-500'),
        html.span('Demo')
      ),
      html.button(
        attr.type('button'),
        attr.class('-m-2.5 p-2.5 text-gray-600 hover:text-gray-500'),
        html.span('Tools')
      ),
      html.button(
        attr.type('button'),
        attr.class('-m-2.5 p-2.5 text-gray-600 hover:text-gray-500'),
        html.span('Libraries')
      ),
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
