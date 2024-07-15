import { Signal, html, attr, Ensure } from '@tempots/dom'
import { HTMLTitle } from '@tempots/ui'
import { User } from '../types'

export interface ProfileViewProps {
  user: Signal<User>
}

export const ProfileView = ({ user }: ProfileViewProps) =>
  html.section(
    HTMLTitle(user.map(u => `HNPWA • user: ${u.id}`)),
    attr.class('user-view'),
    html.table(
      html.tr(html.td('user:'), html.td(html.b(user.at('id')))),
      html.tr(html.td('created:'), html.td(user.at('created'))),
      html.tr(
        html.td('karma:'),
        html.td(user.at('karma').map(v => v.toLocaleString()))
      ),
      Ensure(user.at('about'), (about: Signal<string>) =>
        html.tr(html.td('about:'), html.td(attr.innerHTML(about)))
      )
    )
  )
