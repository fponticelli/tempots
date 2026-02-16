import { view, nativeStyle, type NativeRenderable } from '@tempots/native'
import type { Signal } from '@tempots/core'
import { errorToMessage } from '../utils/http-error'
import type { Error } from '../types'
import { styles } from '../styles'

export const ErrorView = (error: Signal<Error>): NativeRenderable =>
  view.View(
    nativeStyle.style(styles.centered),
    view.Text(
      error.map(e => errorToMessage(e.error)),
      nativeStyle.style(styles.errorText)
    )
  )
