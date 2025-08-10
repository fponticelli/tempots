/**
 * Represents a collection of ARIA attributes and their corresponding types.
 *
 * @public
 */
export type AriaAttributes = {
  activedescendant: string
  atomic: boolean
  autocomplete: 'none' | 'inline' | 'list' | 'both'
  busy: boolean
  checked: boolean | 'mixed'
  colcount: number
  colindex: number
  colspan: number
  controls: string
  current: string // "page" | "step" | "location" | "date" | "time"
  describedby: string
  details: string
  disabled: boolean
  dropeffect: 'none' | 'copy' | 'execute' | 'link' | 'move' | 'popup'
  errormessage: string
  expanded: boolean
  flowto: string
  grabbed: boolean
  haspopup: boolean
  hidden: boolean
  invalid: boolean | 'grammar' | 'spelling'
  keyshortcuts: string
  label: string
  labelledby: string
  level: number
  live: 'off' | 'assertive' | 'polite'
  modal: boolean
  multiline: boolean
  multiselectable: boolean
  orientation: 'horizontal' | 'vertical'
  owns: string
  placeholder: string
  posinset: number
  pressed: boolean | 'mixed'
  readonly: boolean
  relevant: 'additions' | 'removals' | 'text' | 'all'
  required: boolean
  roledescription: string
  rowcount: number
  rowindex: number
  rowspan: number
  selected: boolean
  setsize: number
  sort: 'none' | 'ascending' | 'descending' | 'other'
  valuemax: number
  valuemin: number
  valuenow: number
  valuetext: string
}
