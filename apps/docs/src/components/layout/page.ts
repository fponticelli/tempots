import {
  aria,
  attr,
  Fragment,
  html,
  on,
  prop,
  svg,
  svgAttr,
} from '@tempots/dom'
import { HtmlToTempo } from '../html-to-tempo'
import { SideBar } from './sidebar'

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

export function PageLayout() {
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
          html.form(
            attr.class('relative flex flex-1'),
            attr.action('#'),
            attr.method('GET'),
            html.label(
              attr.for('search-field'),
              attr.class('sr-only'),
              'Search'
            ),
            svg.svg(
              attr.class(
                'pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400'
              ),
              svgAttr.viewBox('0 0 20 20'),
              svgAttr.fill('currentColor'),
              aria.hidden(true),
              svg.path(
                svgAttr.fillRule('evenodd'),
                svgAttr.d(
                  'M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z'
                ),
                svgAttr.clipRule('evenodd')
              )
            ),
            html.input(
              attr.id('search-field'),
              attr.class(
                'block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm'
              ),
              attr.placeholder('Search...'),
              attr.type('search'),
              attr.name('search')
            )
          ),
          html.div(
            attr.class('flex items-center gap-x-4 lg:gap-x-6'),
            html.button(
              attr.type('button'),
              attr.class('-m-2.5 p-2.5 text-gray-400 hover:text-gray-500'),
              html.span(attr.class('sr-only'), 'View notifications'),
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
                  svgAttr.d(
                    'M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0'
                  )
                )
              )
            ),
            html.div(
              attr.class('hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200'),
              aria.hidden(true)
            ),
            html.div(
              attr.class('relative'),
              html.button(
                attr.type('button'),
                attr.class('-m-1.5 flex items-center p-1.5'),
                attr.id('user-menu-button'),
                aria.expanded(false),
                aria.haspopup(true),
                html.span(attr.class('sr-only'), 'Open user menu'),
                html.img(
                  attr.class('h-8 w-8 rounded-full bg-gray-50'),
                  attr.src(
                    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
                  ),
                  attr.alt('')
                ),
                html.span(
                  attr.class('hidden lg:flex lg:items-center'),
                  html.span(
                    attr.class(
                      'ml-4 text-sm font-semibold leading-6 text-gray-900'
                    ),
                    aria.hidden(true),
                    'Tom Cook'
                  ),
                  svg.svg(
                    attr.class('ml-2 h-5 w-5 text-gray-400'),
                    svgAttr.viewBox('0 0 20 20'),
                    svgAttr.fill('currentColor'),
                    aria.hidden(true),
                    svg.path(
                      svgAttr.fillRule('evenodd'),
                      svgAttr.d(
                        'M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z'
                      ),
                      svgAttr.clipRule('evenodd')
                    )
                  )
                )
              ),
              html.div(
                attr.class(
                  'absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none'
                ),
                attr.role('menu'),
                aria.orientation('vertical'),
                aria.labelledby('user-menu-button'),
                attr.tabindex(-1),
                html.a(
                  attr.href('#'),
                  attr.class('block px-3 py-1 text-sm leading-6 text-gray-900'),
                  attr.role('menuitem'),
                  attr.tabindex(-1),
                  attr.id('user-menu-item-0'),
                  'Your profile'
                ),
                html.a(
                  attr.href('#'),
                  attr.class('block px-3 py-1 text-sm leading-6 text-gray-900'),
                  attr.role('menuitem'),
                  attr.tabindex(-1),
                  attr.id('user-menu-item-1'),
                  'Sign out'
                )
              )
            )
          )
        )
      ),
      html.main(
        attr.class('py-10 h-full overflow-hidden'),
        html.div(
          attr.class('px-4 sm:px-6 lg:px-8 h-full overflow-hidden'),
          HtmlToTempo()
        )
      )
    )
  )
  // html.div(
  //   html.nav('Navbar'),
  //   html.div(html.aside('Sidebar'), html.main(HtmlToTempo()))
  // )
}
