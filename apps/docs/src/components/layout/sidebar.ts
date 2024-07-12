import {
  aria,
  attr,
  Child,
  html,
  prop,
  Signal,
  svg,
  svgAttr,
  When,
} from '@tempots/dom'
import { Logo } from '../element/logo'
import { Styles } from '../styles'
import { Toc } from '../../model/domain'
import { Anchor } from '@tempots/ui'

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

function titleToInitial(title: string) {
  let initial = title
  if (initial.length > 3) {
    initial = initial.substring(0, 1)
  }
  return initial.toUpperCase()
}

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
        'group flex gap-x-3 rounded-md bg-gray-50 p-1 text-sm font-semibold leading-6 text-blue-600'
      ),
      icon,
      label
    ),
    Anchor(
      href,
      attr.class(
        'group flex gap-x-3 rounded-md p-1 text-sm font-semibold leading-6 text-gray-700 hover:bg-white hover:text-blue-600'
      ),
      icon,
      label
    )
  )
}

export function FakeIcon(child: Child) {
  return html.span(attr.class(Styles.icon.bordered), child)
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
        'group flex gap-x-3 rounded-md bg-gray-50 p-1 text-sm font-semibold leading-6 text-blue-600 hover:bg-white hover:text-blue-600'
      ),
      FakeIcon(icon),
      html.span(attr.class('truncate'), label)
    ),
    Anchor(
      href,
      attr.class(
        'group flex gap-x-3 rounded-md p-1 text-sm font-semibold leading-6 text-gray-700 hover:bg-white hover:text-blue-600'
      ),
      FakeIcon(icon),
      html.span(attr.class('truncate'), label)
    )
  )
}

export function SideBar({ libraries, demos, pages }: Toc) {
  const active = prop('/')
  return html.div(
    attr.class(
      'flex grow flex-col gap-y-5 overflow-y-auto bg-gray-100 px-6 pb-4 border-r'
    ),
    html.div(
      attr.class('flex h-20 shrink-0 items-center justify-center'),
      Anchor(
        '/',
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
        attr.class('flex flex-1 flex-col gap-y-4'),
        html.li(
          html.ul(
            attr.role('list'),
            attr.class('-mx-2'),
            pages.map(({ title, path }) =>
              html.li(
                MenuLink({
                  href: `/page/${path}`,
                  label: title,
                  icon: homeIcon,
                  active,
                })
              )
            )
          )
        ),
        html.li(
          Anchor('/libraries', attr.class(Styles.sidebar.heading), 'Libraries'),
          html.ul(
            attr.role('list'),
            attr.class('-mx-2 mt-2'),
            libraries.map(({ title, name }) => {
              const initial = titleToInitial(title.split('/').pop()!)
              return html.li(
                SectionLink({
                  href: `/library/${name}`,
                  label: title,
                  icon: initial,
                  active,
                })
              )
            })
          )
        ),
        html.li(
          Anchor('/tools', attr.class(Styles.sidebar.heading), 'Tools'),
          html.ul(
            attr.role('list'),
            attr.class('-mx-2 mt-2'),
            html.li(
              SectionLink({
                href: '/tool/html-to-tempo',
                label: 'HTML to Tempo',
                icon: 'HT',
                active,
              })
            )
          )
        ),
        html.li(
          Anchor('/demos', attr.class(Styles.sidebar.heading), 'Demos'),
          html.ul(
            attr.role('list'),
            attr.class('-mx-2 mt-2'),
            demos.map(({ title, path }) => {
              const initial = titleToInitial(title)
              return html.li(
                SectionLink({
                  href: `/demo/${path}`,
                  label: title,
                  icon: initial,
                  active,
                })
              )
            })
          )
        ),
        html.li(
          attr.class('mt-auto'),
          html.a(
            attr.target('_blank'),
            attr.href('https://github.com/fponticelli'),
            attr.class(
              'flex p-2 text-sm text-gray-600 justify-center hover:underline'
            ),
            `© 2018-${new Date().getFullYear()} Franco Ponticelli`
          )
        )
      )
    )
  )
}
