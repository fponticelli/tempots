import { OnKeyPressed } from './onkeypressed'

export function OnEnterKey(handler: (event: KeyboardEvent) => void) {
  return OnKeyPressed({ allowedKeys: ['Enter'], handler })
}
