import { OnDispose, WithElement } from '@tempots/dom'

export type KeyCombo = {
  /** The key value (e.g., 'Enter', 'a', 'ArrowUp') */
  key?: string
  /** The physical key code (e.g., 'KeyA', 'Enter', 'ArrowUp') - more reliable than key */
  code?: string
  /** Control key modifier */
  ctrlKey?: boolean
  /** Alt key modifier (Option key on Mac) */
  altKey?: boolean
  /** Shift key modifier */
  shiftKey?: boolean
  /** Meta key modifier (Cmd on Mac, Windows key on PC) */
  metaKey?: boolean
  /** Whether the key is being held down (auto-repeat) */
  repeat?: boolean
  /** Cross-platform shortcut: true if either Cmd (Mac) or Ctrl (PC) is pressed */
  commandOrControlKey?: boolean
}

// Helper function to check if a modifier key matches (undefined means "don't care")
const matchesModifier = (
  expected: boolean | undefined,
  actual: boolean
): boolean => {
  return expected === undefined || expected === actual
}

// Helper function to check if a string matches (undefined means "don't care")
const matchesString = (
  expected: string | undefined,
  actual: string
): boolean => {
  return expected === undefined || expected === actual
}

export function matchesKeyCombo(
  keyCombo: KeyCombo | string,
  event: KeyboardEvent
): boolean {
  if (typeof keyCombo === 'string') {
    return event.key === keyCombo
  } else {
    return (
      matchesString(keyCombo.key, event.key) &&
      matchesString(keyCombo.code, event.code) &&
      matchesModifier(keyCombo.ctrlKey, event.ctrlKey) &&
      matchesModifier(keyCombo.altKey, event.altKey) &&
      matchesModifier(keyCombo.shiftKey, event.shiftKey) &&
      matchesModifier(keyCombo.metaKey, event.metaKey) &&
      matchesModifier(keyCombo.repeat, event.repeat) &&
      matchesModifier(
        keyCombo.commandOrControlKey,
        event.metaKey || event.ctrlKey
      )
    )
  }
}

export function OnKeyPressed({
  allowedKeys,
  handler,
}: {
  allowedKeys: (KeyCombo | string)[]
  handler: (event: KeyboardEvent) => void
}) {
  return WithElement((el: HTMLElement) => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!el.contains(event.target as Node)) {
        return
      }
      for (const key of allowedKeys) {
        if (matchesKeyCombo(key, event)) {
          handler(event)
          break
        }
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return OnDispose(() => {
      document.removeEventListener('keydown', onKeyDown)
    })
  })
}
