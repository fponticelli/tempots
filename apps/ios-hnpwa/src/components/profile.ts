import { view, nativeStyle, Ensure, type NativeRenderable } from '@tempots/native'
import type { Signal } from '@tempots/core'
import type { User } from '../types'
import { styles } from '../styles'

const ProfileRow = (label: string, value: string | Signal<string>): NativeRenderable =>
  view.View(
    nativeStyle.style(styles.profileRow),
    view.Text(
      label,
      nativeStyle.style(styles.profileLabel)
    ),
    view.Text(
      value,
      nativeStyle.style(styles.profileValue)
    )
  )

export const ProfileView = (user: Signal<User>): NativeRenderable =>
  view.ScrollView(
    view.View(
      nativeStyle.style(styles.profileContainer),
      ProfileRow('user:', user.$.id),
      ProfileRow('created:', user.$.created),
      ProfileRow('karma:', user.$.karma.map(v => v.toLocaleString())),
      Ensure(user.$.about, (about: Signal<string>) =>
        ProfileRow('about:', about)
      )
    )
  )
