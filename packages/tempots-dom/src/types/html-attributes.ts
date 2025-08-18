/**
 * Represents the HTML attributes that can be used in an HTML element.
 *
 * @public
 */
export type HTMLAttributes = {
  accept: string
  'accept-charset': string
  accesskey: string
  action: string
  align: string
  allow: string
  allowfullscreen: boolean
  allowpaymentrequest: boolean
  alt: string
  as: string
  async: boolean
  autocapitalize: 'off' | 'none' | 'on' | 'sentences' | 'words' | 'characters'
  autocomplete: string
  autofocus: boolean
  autoplay: boolean
  bgcolor: string
  border: string
  capture: boolean | 'user' | 'environment'
  charset: string
  checked: boolean
  cite: string
  class: string
  color: string
  cols: number
  colspan: number
  content: string
  contenteditable: boolean | 'true' | 'false' | 'plaintext-only'
  controls: string
  coords: string
  crossorigin: 'anonymous' | 'use-credentials' | ''
  data: string
  datetime: string
  decoding: 'sync' | 'async' | 'auto'
  default: string
  defer: string
  dir: 'ltr' | 'rtl' | 'auto'
  dirname: string
  disabled: boolean
  download: string
  draggable: boolean | 'true' | 'false'
  dropzone: string
  enctype: string
  enterkeyhint:
    | 'enter'
    | 'done'
    | 'go'
    | 'next'
    | 'previous'
    | 'search'
    | 'send'
  for: string
  form: string
  formaction: string
  formenctype: string
  formmethod: string
  formnovalidate: boolean
  formtarget: string
  headers: string
  height: string
  hidden: 'until-found' | 'hidden' | '' | boolean
  high: string
  href: string
  hreflang: string
  'http-equiv': string
  icon: string
  id: string
  imagesizes: string
  imagesrcset: string
  inputmode:
    | 'none'
    | 'text'
    | 'decimal'
    | 'numeric'
    | 'tel'
    | 'search'
    | 'email'
    | 'url'
  integrity: string
  is: string
  ismap: string
  itemid: string
  itemprop: string
  itemref: string
  itemscope: boolean
  itemtype: string
  keytype: string
  kind: string
  label: string
  lang: string
  language: string
  list: string
  loading: 'eager' | 'lazy'
  loop: string
  low: string
  manifest: string
  max: number
  maxlength: number
  media: string
  method: string
  min: number
  minlength: number
  multiple: boolean
  muted: boolean
  name: string
  nonce: string
  novalidate: string
  open: string
  optimum: string
  part: string
  pattern: string
  ping: string
  placeholder: string
  playsinline: boolean
  popover: 'auto' | 'manual' | ''
  popovertarget: string
  popovertargetaction: 'hide' | 'show' | 'toggle'
  poster: string
  preload: string
  radiogroup: string
  readonly: boolean
  referrerpolicy:
    | 'no-referrer'
    | 'no-referrer-when-downgrade'
    | 'origin'
    | 'origin-when-cross-origin'
    | 'same-origin'
    | 'strict-origin'
    | 'strict-origin-when-cross-origin'
    | 'unsafe-url'
  rel: string
  required: string
  reversed: string
  role: string
  rows: number
  rowspan: number
  sandbox: string
  scope: string
  scoped: string
  seamless: string
  selected: boolean
  shape: string
  size: number
  sizes: string
  slot: string
  span: string
  spellcheck: boolean | 'true' | 'false'
  src: string
  srcdoc: string
  srclang: string
  srcset: string
  start: string
  step: number
  style: string
  tabindex: number
  target: string
  title: string
  translate: 'yes' | 'no'
  type: string
  usemap: string
  value: string
  valueAsNumber: number
  valueAsDate: Date
  width: string
  wrap: string
  textContent: string
  innerText: string
  innerHTML: string
  outerHTML: string
}

/**
 * Represents the possible input types for HTML input elements.
 *
 * @public
 */
export type InputTypes =
  | 'text'
  | 'number'
  | 'checkbox'
  | 'radio'
  | 'file'
  | 'password'
  | 'button'
  | 'submit'
  | 'reset'
  | 'date'
  | 'range'
  | 'color'
  | 'hidden'
  | 'image'
  | 'month'
  | 'time'
  | 'week'
  | 'email'
  | 'tel'
  | 'url'
  | 'search'
  | 'datetime-local'
