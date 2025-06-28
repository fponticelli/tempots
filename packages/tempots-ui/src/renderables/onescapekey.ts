import { OnKeyPressed } from './onkeypressed'

export function OnEscapeKey(handler: (event: KeyboardEvent) => void) {
  return OnKeyPressed({ allowedKeys: ['Escape'], handler })
}
