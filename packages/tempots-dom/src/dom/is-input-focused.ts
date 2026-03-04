/**
 * Checks whether the currently focused element is an editable form control
 * (`INPUT`, `TEXTAREA`, `SELECT`) or has `contentEditable` set.
 *
 * Useful for keyboard shortcut systems to avoid intercepting normal text input.
 *
 * @param doc - The document to check. Defaults to `document` in browser environments.
 * @returns `true` if an input-like element is focused.
 * @public
 */
export function isInputFocused(doc?: Document): boolean {
  const d = doc ?? (typeof document !== 'undefined' ? document : undefined)
  if (d == null) return false
  const el = d.activeElement
  if (el == null) return false
  const tag = el.tagName
  return (
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    tag === 'SELECT' ||
    (el as HTMLElement).isContentEditable === true
  )
}
