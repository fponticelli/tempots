import { on } from '@tempots/dom'

export function SelectOnFocus() {
  return on.focus(e => (e.target as HTMLInputElement)?.select())
}
