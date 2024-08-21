import { errorToMessage } from '../utils/http-error'
import { Error } from '../types'
import { Notification } from './notification'
import { Fragment, Value } from '@tempots/dom'
import { HTMLTitle } from '@tempots/ui'

export const ErrorView = (error: Value<Error>) =>
  Fragment(
    HTMLTitle(`HNPWA • Error`),
    Notification(
      Value.toSignal(error).map(({ error }) => errorToMessage(error))
    )
  )
