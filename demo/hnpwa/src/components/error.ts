import { errorToMessage } from '../utils/http-error'
import { Error } from '../types'
import { Notification } from './notification'
import { Fragment, Signal, type Value } from '@tempots/dom'
import { HTMLTitle } from '@tempots/ui'

export const ErrorView = (error: Value<Error>) =>
  Fragment(
    HTMLTitle(`HNPWA • Error`),
    Notification(Signal.wrap(error).map(({ error }) => errorToMessage(error)))
  )
