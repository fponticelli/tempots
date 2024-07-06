import { errorToMessage } from '../utils/http-error'
import { Error } from '../types'
import { Notification } from './notification'
import { Fragment, HTMLTitle, Signal, type Value } from '@tempots/dom'

export const ErrorView = (error: Value<Error>) =>
  Fragment(
    HTMLTitle(`HNPWA • Error`),
    Notification(Signal.wrap(error).map(({ error }) => errorToMessage(error)))
  )
