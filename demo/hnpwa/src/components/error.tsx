import { errorToMessage } from '../http_error'
import { Error } from '../types'
import { Notification } from './notification'
import type { Signal } from '@tempots/dom'

export interface ErrorViewProps {
  error: Signal<Error>
}

export const ErrorView = ({ error }: ErrorViewProps) => (
  <Notification message={error.map(({ error }) => errorToMessage(error))} />
)
