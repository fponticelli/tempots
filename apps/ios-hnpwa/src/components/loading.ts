import { view, nativeStyle, type NativeRenderable } from '@tempots/native'
import { styles } from '../styles'

export const Loading = (): NativeRenderable =>
  view.View(
    nativeStyle.style(styles.centered),
    view.ActivityIndicator(
      nativeStyle.style({ color: '#ff6600' })
    )
  )
