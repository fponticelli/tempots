import {
  aria,
  attr,
  Child,
  Fragment,
  html,
  on,
  prop,
  svg,
  svgAttr,
} from '@tempots/dom'
import { SideBar } from './sidebar'
import { TopBar } from './top-bar'

export function CloseButton(onClick: () => void) {
  return html.button(
    on.click(onClick),
    attr.type('button'),
    attr.class('-m-2.5 p-2.5'),
    html.span(attr.class('sr-only'), 'Close sidebar'),
    svg.svg(
      attr.class('h-6 w-6 text-white'),
      svgAttr.fill('none'),
      svgAttr.viewBox('0 0 24 24'),
      svgAttr.strokeWidth(1.5),
      svgAttr.stroke('currentColor'),
      aria.hidden(true),
      svg.path(
        svgAttr.strokeLinecap('round'),
        svgAttr.strokeLinejoin('round'),
        svgAttr.d('M6 18L18 6M6 6l12 12')
      )
    )
  )
}

export function OpenButton(onClick: () => void) {
  return html.button(
    on.click(onClick),
    attr.type('button'),
    attr.class('-m-2.5 p-2.5 text-gray-700 lg:hidden'),
    html.span(attr.class('sr-only'), 'Open sidebar'),
    svg.svg(
      attr.class('h-6 w-6'),
      svgAttr.fill('none'),
      svgAttr.viewBox('0 0 24 24'),
      svgAttr.strokeWidth(1.5),
      svgAttr.stroke('currentColor'),
      aria.hidden(true),
      svg.path(
        svgAttr.strokeLinecap('round'),
        svgAttr.strokeLinejoin('round'),
        svgAttr.d('M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5')
      )
    )
  )
}

export function PageLayout({ main }: { main: Child }) {
  const sidebarOpen = prop(true)
  return Fragment(
    html.div(
      attr.class('relative z-50 lg:hidden'),
      attr.class(
        sidebarOpen.map((open): string => (open ? 'block' : 'hidden'))
      ),
      attr.role('dialog'),
      aria.modal(true),
      html.div(attr.class('fixed inset-0 bg-gray-900/80'), aria.hidden(true)),
      html.div(
        attr.class('fixed inset-0 flex'),
        SideBar(),
        html.div(
          attr.class('relative mr-16 flex w-full max-w-xs flex-1'),
          html.div(
            attr.class(
              'absolute left-full top-0 flex w-16 justify-center pt-5'
            ),
            CloseButton(() => sidebarOpen.set(false))
          )
        )
      )
    ),
    html.div(
      attr.class(
        'hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col'
      ),
      SideBar()
    ),
    html.div(
      attr.class('lg:pl-72 h-full overflow-hidden'),
      html.div(
        attr.class(
          'sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8'
        ),
        OpenButton(() => sidebarOpen.set(true)),
        html.div(
          attr.class('h-6 w-px bg-gray-200 lg:hidden'),
          aria.hidden(true)
        ),
        html.div(
          attr.class('flex flex-1 gap-x-4 self-stretch lg:gap-x-6'),
          TopBar()
        )
      ),
      html.main(
        attr.class('h-full overflow-hidden'),
        html.div(attr.class('px-3 h-full overflow-hidden'), main)
      )
    )
  )
  // html.div(
  //   html.nav('Navbar'),
  //   html.div(html.aside('Sidebar'), html.main(HtmlToTempo()))
  // )
}
