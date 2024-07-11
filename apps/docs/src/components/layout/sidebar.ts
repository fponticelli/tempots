import {
  aria,
  attr,
  Child,
  Empty,
  html,
  prop,
  Signal,
  svg,
  svgAttr,
  When,
} from '@tempots/dom'
import { Logo } from '../element/logo'

const homeIcon = svg.svg(
  attr.class('h-6 w-6 shrink-0 text-blue-600'),
  svgAttr.fill('none'),
  svgAttr.viewBox('0 0 24 24'),
  svgAttr.strokeWidth(1.5),
  svgAttr.stroke('currentColor'),
  aria.hidden(true),
  svg.path(
    svgAttr.strokeLinecap('round'),
    svgAttr.strokeLinejoin('round'),
    svgAttr.d(
      'M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25'
    )
  )
)

const teamIcon = svg.svg(
  attr.class('h-6 w-6 shrink-0 text-gray-400 group-hover:text-blue-600'),
  svgAttr.fill('none'),
  svgAttr.viewBox('0 0 24 24'),
  svgAttr.strokeWidth(1.5),
  svgAttr.stroke('currentColor'),
  aria.hidden(true),
  svg.path(
    svgAttr.strokeLinecap('round'),
    svgAttr.strokeLinejoin('round'),
    svgAttr.d(
      'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z'
    )
  )
)

export function MenuLink({
  label,
  icon,
  href,
  active,
}: {
  label: Child
  icon: Child
  href: string
  active: Signal<string>
}) {
  const isActive = active.map(a => a === href)
  return When(
    isActive,
    html.span(
      attr.class(
        'group flex gap-x-3 rounded-md bg-gray-50 p-2 text-sm font-semibold leading-6 text-blue-600'
      ),
      icon,
      label
    ),
    html.a(
      attr.href(href),
      attr.class(
        'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-white hover:text-blue-600'
      ),
      icon,
      label
    )
  )
}

export function FakeIcon(child: Child) {
  return html.span(
    attr.class(
      'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-[0.625rem] font-medium text-gray-400 group-hover:border-blue-600 group-hover:text-blue-600'
    ),
    child
  )
}

export function SectionLink({
  label,
  icon,
  href,
  active,
}: {
  label: Child
  icon: Child
  href: string
  active: Signal<string>
}) {
  const isActive = active.map(a => a === href)
  return When(
    isActive,
    html.span(
      attr.class(
        'group flex gap-x-3 rounded-md bg-gray-50 p-2 text-sm font-semibold leading-6 text-blue-600 hover:bg-white hover:text-blue-600'
      ),
      FakeIcon(icon),
      html.span(attr.class('truncate'), label)
    ),
    html.a(
      attr.href(href),
      attr.class(
        'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-white hover:text-blue-600'
      ),
      FakeIcon(icon),
      html.span(attr.class('truncate'), label)
    )
  )
}

export function SideBar() {
  const active = prop('/')
  return html.div(
    attr.class(
      'flex grow flex-col gap-y-5 overflow-y-auto bg-gray-100 px-6 pb-4 border-r'
    ),
    html.div(
      attr.class('flex h-20 shrink-0 items-center justify-center'),
      html.a(
        attr.href('/'),
        attr.class('flex flex-row gap-2'),
        Logo(),
        html.div(
          attr.class('flex flex-col leading-4'),
          html.div(attr.class('text-xl font-semibold'), 'Tempo'),
          html.div(
            attr.class('text font-semibold text-gray-600'),
            'The UI Framework'
          )
        )
      )
    ),
    html.nav(
      attr.class('flex flex-1 flex-col'),
      html.ul(
        attr.role('list'),
        attr.class('flex flex-1 flex-col gap-y-7'),
        html.li(
          html.ul(
            attr.role('list'),
            attr.class('-mx-2 space-y-1'),
            html.li(
              MenuLink({
                href: 'home',
                label: 'Dashboard',
                icon: homeIcon,
                active,
              })
            ),
            html.li(
              MenuLink({
                href: 'home',
                label: 'Team',
                icon: teamIcon,
                active,
              })
            ),
            html.li(
              MenuLink({
                href: 'home',
                label: 'Team',
                icon: Empty,
                active,
              })
            )
          )
        ),
        html.li(
          html.div(
            attr.class('text-xs font-semibold leading-6 text-gray-400'),
            'Libraries'
          ),
          html.ul(
            attr.role('list'),
            attr.class('-mx-2 mt-2 space-y-1'),
            html.li(
              SectionLink({
                href: '/library/tempo-dom',
                label: '@tempo/dom',
                icon: 'D',
                active,
              })
            ),
            html.li(
              SectionLink({
                href: '/library/tempo-std',
                label: '@tempo/std',
                icon: 'S',
                active,
              })
            ),
            html.li(
              SectionLink({
                href: '/library/tempo-color',
                label: '@tempo/color',
                icon: 'C',
                active,
              })
            ),
            html.li(
              SectionLink({
                href: '/library/tempo-ui',
                label: '@tempo/ui',
                icon: 'UI',
                active,
              })
            )
          )
        ),
        html.li(
          html.div(
            attr.class('text-xs font-semibold leading-6 text-gray-400'),
            'Tools'
          ),
          html.ul(
            attr.role('list'),
            attr.class('-mx-2 mt-2 space-y-1'),
            html.li(
              SectionLink({
                href: '/tools/html-to-tempo',
                label: 'HTML to Tempo',
                icon: 'HT',
                active,
              })
            )
          )
        ),
        html.li(
          html.div(
            attr.class('text-xs font-semibold leading-6 text-gray-400'),
            'Demos'
          ),
          html.ul(
            attr.role('list'),
            attr.class('-mx-2 mt-2 space-y-1'),
            html.li(
              SectionLink({
                href: '/demo/hnpwa',
                label: 'HNPWA',
                icon: 'H',
                active,
              })
            ),
            html.li(
              SectionLink({
                href: '/demo/counter',
                label: 'Counter',
                icon: 'C',
                active,
              })
            ),
            html.li(
              SectionLink({
                href: '/demo/todomvc',
                label: 'TodoMVC',
                icon: 'T',
                active,
              })
            ),
            html.li(
              SectionLink({
                href: '/demo/7guis',
                label: '7GUIs',
                icon: '7',
                active,
              })
            )
          )
        ),
        html.li(
          attr.class('mt-auto'),
          html.div(
            attr.href('#'),
            attr.class('flex p-2 text-sm text-gray-600 justify-center'),
            `© 2018-${new Date().getFullYear()} Franco Ponticelli`
          )
        )
      )
    )
  )
}
