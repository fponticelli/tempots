/**
 * Represents a collection of ARIA attributes and their corresponding types.
 *
 * @public
 */
export type AriaAttributes = {
  activedescendant: string
  atomic: boolean
  autocomplete: 'none' | 'inline' | 'list' | 'both'
  braillelabel: string
  brailleroledescription: string
  busy: boolean
  checked: boolean | 'mixed'
  colcount: number
  colindex: number
  colindextext: string
  colspan: number
  controls: string
  current:
    | 'page'
    | 'step'
    | 'location'
    | 'date'
    | 'time'
    | 'true'
    | 'false'
    | string
  describedby: string
  description: string
  details: string
  disabled: boolean
  dropeffect: 'none' | 'copy' | 'execute' | 'link' | 'move' | 'popup'
  errormessage: string
  expanded: boolean | 'undefined'
  flowto: string
  grabbed: boolean
  haspopup:
    | boolean
    | 'false'
    | 'true'
    | 'menu'
    | 'listbox'
    | 'tree'
    | 'grid'
    | 'dialog'
  hidden: boolean | 'undefined'
  invalid: boolean | 'false' | 'true' | 'grammar' | 'spelling'
  keyshortcuts: string
  label: string
  labelledby: string
  level: number
  live: 'off' | 'assertive' | 'polite'
  modal: boolean
  multiline: boolean
  multiselectable: boolean
  orientation: 'horizontal' | 'vertical' | 'undefined'
  owns: string
  placeholder: string
  posinset: number
  pressed: boolean | 'mixed' | 'undefined'
  readonly: boolean
  relevant: 'additions' | 'removals' | 'text' | 'all' | string
  required: boolean
  roledescription: string
  rowcount: number
  rowindex: number
  rowindextext: string
  rowspan: number
  selected: boolean | 'undefined'
  setsize: number
  sort: 'none' | 'ascending' | 'descending' | 'other'
  valuemax: number
  valuemin: number
  valuenow: number
  valuetext: string
}
