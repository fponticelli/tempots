import { JSX } from '@tempots/dom'

export interface NotificationProps {
  message: JSX.DOMNode
}

export const Notification = ({ message }: NotificationProps) => (
  <div className="notification">{message}</div>
)
