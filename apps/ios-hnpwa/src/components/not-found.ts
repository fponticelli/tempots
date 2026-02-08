import { view, nativeStyle, type NativeRenderable } from '@tempots/native'
import { styles } from '../styles'

export const NotFoundView = (): NativeRenderable =>
  view.View(
    nativeStyle.style(styles.centered),
    view.Text(
      'Page Not Found',
      nativeStyle.style(styles.notFoundText)
    )
  )
