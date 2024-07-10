export type HTMLAttributes = {
  accept: string
  'accept-charset': string
  accesskey: string
  action: string
  align: string
  alt: string
  async: boolean
  autocomplete: string
  autofocus: boolean
  autoplay: boolean
  bgcolor: string
  border: string
  charset: string
  checked: boolean
  cite: string
  class: string
  color: string
  cols: number
  colspan: number
  content: string
  contenteditable: boolean
  controls: string
  coords: string
  data: string
  datetime: string
  default: string
  defer: string
  dir: string
  dirname: string
  disabled: boolean
  download: string
  draggable: string
  dropzone: string
  enctype: string
  for: string
  form: string
  formaction: string
  headers: string
  height: string
  hidden: string
  high: string
  href: string
  hreflang: string
  'http-equiv': string
  icon: string
  id: string
  ismap: string
  itemprop: string
  keytype: string
  kind: string
  label: string
  lang: string
  language: string
  list: string
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
  name: string
  novalidate: string
  open: string
  optimum: string
  pattern: string
  ping: string
  placeholder: string
  poster: string
  preload: string
  radiogroup: string
  readonly: boolean
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
  span: string
  spellcheck: string
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
  translate: string
  type: InputTypes
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
