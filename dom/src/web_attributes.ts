// THIS FILE IS AUTOMATICALLY GENERATED, PLEASE DO NOT CHANGE DIRECTLY

import { DOMAttribute, DOMEventHandler } from './value'
import { CSSProperties } from './web_css_properties'
import { MoodAttributes } from './mood_attributes'

export interface DOMAttributes<State, Action, El> extends MoodAttributes<State, El> {
  abbr?: DOMAttribute<State, string>
  accept?: DOMAttribute<State, string>
  acceptCharset?: DOMAttribute<State, string>
  accessKey?: DOMAttribute<State, string>
  action?: DOMAttribute<State, string>
  allow?: DOMAttribute<State, string>
  allowFullscreen?: DOMAttribute<State, boolean>
  allowPaymentRequest?: DOMAttribute<State, boolean>
  alt?: DOMAttribute<State, string>
  amplitude?: DOMAttribute<State, number>
  animatedPoints?: DOMAttribute<State, string>
  as?: DOMAttribute<State, string>
  async?: DOMAttribute<State, boolean>
  autocapitalize?: DOMAttribute<State, string>
  autocomplete?: DOMAttribute<State, string>
  autofocus?: DOMAttribute<State, boolean>
  autoplay?: DOMAttribute<State, boolean>
  azimuth?: DOMAttribute<State, number>
  baseFrequencyX?: DOMAttribute<State, number>
  baseFrequencyY?: DOMAttribute<State, number>
  bgProperties?: DOMAttribute<State, string>
  bias?: DOMAttribute<State, number>
  checked?: DOMAttribute<State, boolean>
  cite?: DOMAttribute<State, string>
  className?: DOMAttribute<State, string>
  clipPathUnits?: DOMAttribute<State, string>
  colSpan?: DOMAttribute<State, number>
  color?: DOMAttribute<State, string>
  cols?: DOMAttribute<State, number>
  content?: DOMAttribute<State, string>
  contentEditable?: DOMAttribute<State, string>
  controls?: DOMAttribute<State, boolean>
  coords?: DOMAttribute<State, string>
  crossOrigin?: DOMAttribute<State, string>
  currentScale?: DOMAttribute<State, number>
  currentTime?: DOMAttribute<State, number>
  currentTranslate?: DOMAttribute<State, string>
  cx?: DOMAttribute<State, string>
  cy?: DOMAttribute<State, string>
  data?: DOMAttribute<State, string>
  dateTime?: DOMAttribute<State, string>
  decoding?: DOMAttribute<State, 'async' | 'sync' | 'auto'>
  default?: DOMAttribute<State, boolean>
  defaultChecked?: DOMAttribute<State, boolean>
  defaultMuted?: DOMAttribute<State, boolean>
  defaultPlaybackRate?: DOMAttribute<State, number>
  defaultSelected?: DOMAttribute<State, boolean>
  defaultValue?: DOMAttribute<State, string>
  defer?: DOMAttribute<State, boolean>
  diffuseConstant?: DOMAttribute<State, number>
  dir?: DOMAttribute<State, string>
  dirName?: DOMAttribute<State, string>
  disabled?: DOMAttribute<State, boolean>
  divisor?: DOMAttribute<State, number>
  download?: DOMAttribute<State, string>
  draggable?: DOMAttribute<State, boolean>
  dx?: DOMAttribute<State, string | number>
  dy?: DOMAttribute<State, string | number>
  edgeMode?: DOMAttribute<State, string>
  elevation?: DOMAttribute<State, number>
  encoding?: DOMAttribute<State, string>
  enctype?: DOMAttribute<State, string>
  exponent?: DOMAttribute<State, number>
  files?: DOMAttribute<State, FileList | null>
  filterUnits?: DOMAttribute<State, string>
  for?: DOMAttribute<State, string>
  formAction?: DOMAttribute<State, string>
  formEnctype?: DOMAttribute<State, string>
  formMethod?: DOMAttribute<State, string>
  formNoValidate?: DOMAttribute<State, boolean>
  formTarget?: DOMAttribute<State, string>
  fx?: DOMAttribute<State, string>
  fy?: DOMAttribute<State, string>
  gradientTransform?: DOMAttribute<State, string>
  gradientUnits?: DOMAttribute<State, string>
  hash?: DOMAttribute<State, string>
  headers?: DOMAttribute<State, string>
  height?: DOMAttribute<State, string | number>
  hidden?: DOMAttribute<State, boolean>
  high?: DOMAttribute<State, number>
  host?: DOMAttribute<State, string>
  hostname?: DOMAttribute<State, string>
  href?: DOMAttribute<State, string>
  hreflang?: DOMAttribute<State, string>
  httpEquiv?: DOMAttribute<State, string>
  id?: DOMAttribute<State, string>
  imageSizes?: DOMAttribute<State, string>
  imageSrcset?: DOMAttribute<State, string>
  in1?: DOMAttribute<State, string>
  in2?: DOMAttribute<State, string>
  indeterminate?: DOMAttribute<State, boolean>
  inputMode?: DOMAttribute<State, string>
  integrity?: DOMAttribute<State, string>
  intercept?: DOMAttribute<State, number>
  isMap?: DOMAttribute<State, boolean>
  k1?: DOMAttribute<State, number>
  k2?: DOMAttribute<State, number>
  k3?: DOMAttribute<State, number>
  k4?: DOMAttribute<State, number>
  kernelMatrix?: DOMAttribute<State, string>
  kernelUnitLengthX?: DOMAttribute<State, number>
  kernelUnitLengthY?: DOMAttribute<State, number>
  kind?: DOMAttribute<State, string>
  label?: DOMAttribute<State, string>
  lang?: DOMAttribute<State, string>
  length?: DOMAttribute<State, number>
  lengthAdjust?: DOMAttribute<State, string>
  limitingConeAngle?: DOMAttribute<State, number>
  loop?: DOMAttribute<State, boolean>
  low?: DOMAttribute<State, number>
  markerHeight?: DOMAttribute<State, string>
  markerUnits?: DOMAttribute<State, string>
  markerWidth?: DOMAttribute<State, string>
  maskContentUnits?: DOMAttribute<State, string>
  maskUnits?: DOMAttribute<State, string>
  max?: DOMAttribute<State, number | string>
  maxLength?: DOMAttribute<State, number>
  media?: DOMAttribute<State, string>
  method?: DOMAttribute<State, string>
  min?: DOMAttribute<State, number | string>
  minLength?: DOMAttribute<State, number>
  mode?: DOMAttribute<State, string>
  msAudioCategory?: DOMAttribute<State, string>
  msAudioDeviceType?: DOMAttribute<State, string>
  msHorizontalMirror?: DOMAttribute<State, boolean>
  msPlayToDisabled?: DOMAttribute<State, boolean>
  msPlayToPreferredSourceUri?: DOMAttribute<State, string>
  msPlayToPrimary?: DOMAttribute<State, boolean>
  msRealTime?: DOMAttribute<State, boolean>
  msStereo3DPackingMode?: DOMAttribute<State, string>
  msStereo3DRenderMode?: DOMAttribute<State, string>
  msZoom?: DOMAttribute<State, boolean>
  multiple?: DOMAttribute<State, boolean>
  muted?: DOMAttribute<State, boolean>
  name?: DOMAttribute<State, string>
  noModule?: DOMAttribute<State, boolean>
  noValidate?: DOMAttribute<State, boolean>
  nonce?: DOMAttribute<State, string>
  numOctaves?: DOMAttribute<State, number>
  offset?: DOMAttribute<State, number>
  onMSVideoFormatChanged?: DOMEventHandler<State, Event, Action>
  onMSVideoFrameStepCompleted?: DOMEventHandler<State, Event, Action>
  onMSVideoOptimalLayoutChanged?: DOMEventHandler<State, Event, Action>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onafterprint?: DOMEventHandler<State, Event, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, AnimationEvent, Action>
  onanimationiteration?: DOMEventHandler<State, AnimationEvent, Action>
  onanimationstart?: DOMEventHandler<State, AnimationEvent, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onbeforeprint?: DOMEventHandler<State, Event, Action>
  onbeforeunload?: DOMEventHandler<State, BeforeUnloadEvent, Action>
  onblur?: DOMEventHandler<State, FocusEvent, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, ClipboardEvent, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, ClipboardEvent, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, DragEvent, Action>
  ondragenter?: DOMEventHandler<State, DragEvent, Action>
  ondragexit?: DOMEventHandler<State, DragEvent, Action>
  ondragleave?: DOMEventHandler<State, DragEvent, Action>
  ondragover?: DOMEventHandler<State, DragEvent, Action>
  ondragstart?: DOMEventHandler<State, DragEvent, Action>
  ondrop?: DOMEventHandler<State, DragEvent, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onencrypted?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, FocusEvent, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  onhashchange?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, KeyboardEvent, Action>
  onkeypress?: DOMEventHandler<State, KeyboardEvent, Action>
  onkeyup?: DOMEventHandler<State, KeyboardEvent, Action>
  onlanguagechange?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, UIEvent, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmessage?: DOMEventHandler<State, Event, Action>
  onmessageerror?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, MouseEvent, Action>
  onmouseenter?: DOMEventHandler<State, MouseEvent, Action>
  onmouseleave?: DOMEventHandler<State, MouseEvent, Action>
  onmousemove?: DOMEventHandler<State, MouseEvent, Action>
  onmouseout?: DOMEventHandler<State, MouseEvent, Action>
  onmouseover?: DOMEventHandler<State, MouseEvent, Action>
  onmouseup?: DOMEventHandler<State, MouseEvent, Action>
  onoffline?: DOMEventHandler<State, Event, Action>
  ononline?: DOMEventHandler<State, Event, Action>
  onpagehide?: DOMEventHandler<State, Event, Action>
  onpageshow?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, ClipboardEvent, Action>
  onpause?: DOMEventHandler<State, Event, Action>
  onplay?: DOMEventHandler<State, Event, Action>
  onplaying?: DOMEventHandler<State, Event, Action>
  onpointercancel?: DOMEventHandler<State, Event, Action>
  onpointerdown?: DOMEventHandler<State, Event, Action>
  onpointerenter?: DOMEventHandler<State, Event, Action>
  onpointerleave?: DOMEventHandler<State, Event, Action>
  onpointermove?: DOMEventHandler<State, Event, Action>
  onpointerout?: DOMEventHandler<State, Event, Action>
  onpointerover?: DOMEventHandler<State, Event, Action>
  onpointerup?: DOMEventHandler<State, Event, Action>
  onpopstate?: DOMEventHandler<State, Event, Action>
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onrejectionhandled?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, UIEvent, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, UIEvent, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onstorage?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, TouchEvent, Action>
  ontouchend?: DOMEventHandler<State, TouchEvent, Action>
  ontouchmove?: DOMEventHandler<State, TouchEvent, Action>
  ontouchstart?: DOMEventHandler<State, TouchEvent, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onunhandledrejection?: DOMEventHandler<State, Event, Action>
  onunload?: DOMEventHandler<State, UIEvent, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwaitingforkey?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
  onzoom?: DOMEventHandler<State, Event, Action>
  open?: DOMAttribute<State, boolean>
  operator?: DOMAttribute<State, string>
  optimum?: DOMAttribute<State, number>
  orderX?: DOMAttribute<State, number>
  orderY?: DOMAttribute<State, number>
  orientAngle?: DOMAttribute<State, string>
  orientType?: DOMAttribute<State, string>
  password?: DOMAttribute<State, string>
  pathLength?: DOMAttribute<State, number>
  pathSegList?: DOMAttribute<State, string>
  pathname?: DOMAttribute<State, string>
  pattern?: DOMAttribute<State, string>
  patternContentUnits?: DOMAttribute<State, string>
  patternTransform?: DOMAttribute<State, string>
  patternUnits?: DOMAttribute<State, string>
  ping?: DOMAttribute<State, string>
  placeholder?: DOMAttribute<State, string>
  playbackRate?: DOMAttribute<State, number>
  points?: DOMAttribute<State, string>
  pointsAtX?: DOMAttribute<State, number>
  pointsAtY?: DOMAttribute<State, number>
  pointsAtZ?: DOMAttribute<State, number>
  port?: DOMAttribute<State, string>
  poster?: DOMAttribute<State, string>
  preload?: DOMAttribute<State, string>
  preserveAlpha?: DOMAttribute<State, boolean>
  preserveAspectRatio?: DOMAttribute<State, string>
  primitiveUnits?: DOMAttribute<State, string>
  protocol?: DOMAttribute<State, string>
  r?: DOMAttribute<State, string>
  radiusX?: DOMAttribute<State, number>
  radiusY?: DOMAttribute<State, number>
  readOnly?: DOMAttribute<State, boolean>
  refX?: DOMAttribute<State, string>
  refY?: DOMAttribute<State, string>
  referrerPolicy?: DOMAttribute<State, string | ReferrerPolicy>
  rel?: DOMAttribute<State, string>
  required?: DOMAttribute<State, boolean>
  requiredExtensions?: DOMAttribute<State, string>
  result?: DOMAttribute<State, string>
  returnValue?: DOMAttribute<State, string>
  reversed?: DOMAttribute<State, boolean>
  rotate?: DOMAttribute<State, string>
  rowSpan?: DOMAttribute<State, number>
  rows?: DOMAttribute<State, number>
  rx?: DOMAttribute<State, string>
  ry?: DOMAttribute<State, string>
  scale?: DOMAttribute<State, number>
  scope?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  search?: DOMAttribute<State, string>
  seed?: DOMAttribute<State, number>
  selected?: DOMAttribute<State, boolean>
  selectedIndex?: DOMAttribute<State, number>
  selectionDirection?: DOMAttribute<State, string>
  selectionEnd?: DOMAttribute<State, number>
  selectionStart?: DOMAttribute<State, number>
  shape?: DOMAttribute<State, string>
  size?: DOMAttribute<State, number>
  sizes?: DOMAttribute<State, string>
  slope?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  spacing?: DOMAttribute<State, string>
  span?: DOMAttribute<State, number>
  specularConstant?: DOMAttribute<State, number>
  specularExponent?: DOMAttribute<State, number>
  spellcheck?: DOMAttribute<State, boolean>
  spreadMethod?: DOMAttribute<State, string>
  src?: DOMAttribute<State, string>
  srcObject?: DOMAttribute<State, MediaStream | MediaSource | Blob>
  srcdoc?: DOMAttribute<State, string>
  srclang?: DOMAttribute<State, string>
  srcset?: DOMAttribute<State, string>
  start?: DOMAttribute<State, number>
  startOffset?: DOMAttribute<State, string>
  stdDeviationX?: DOMAttribute<State, number>
  stdDeviationY?: DOMAttribute<State, number>
  step?: DOMAttribute<State, string>
  stitchTiles?: DOMAttribute<State, string>
  style?: DOMAttribute<State, CSSProperties>
  surfaceScale?: DOMAttribute<State, number>
  systemLanguage?: DOMAttribute<State, string>
  tabIndex?: DOMAttribute<State, number>
  tableValues?: DOMAttribute<State, string>
  target?: DOMAttribute<State, string>
  targetX?: DOMAttribute<State, number>
  targetY?: DOMAttribute<State, number>
  text?: DOMAttribute<State, string>
  textLength?: DOMAttribute<State, string>
  title?: DOMAttribute<State, string>
  transform?: DOMAttribute<State, string>
  translate?: DOMAttribute<State, boolean>
  type?: DOMAttribute<State, string>
  useMap?: DOMAttribute<State, string>
  username?: DOMAttribute<State, string>
  value?: DOMAttribute<State, string | number>
  valueAsDate?: DOMAttribute<State, Date | null>
  valueAsNumber?: DOMAttribute<State, number>
  values?: DOMAttribute<State, string>
  viewBox?: DOMAttribute<State, string>
  viewTarget?: DOMAttribute<State, string>
  viewport?: DOMAttribute<State, string>
  volume?: DOMAttribute<State, number>
  width?: DOMAttribute<State, string | number>
  wrap?: DOMAttribute<State, string>
  x?: DOMAttribute<State, string | number>
  x1?: DOMAttribute<State, string>
  x2?: DOMAttribute<State, string>
  xChannelSelector?: DOMAttribute<State, string>
  y?: DOMAttribute<State, string | number>
  y1?: DOMAttribute<State, string>
  y2?: DOMAttribute<State, string>
  yChannelSelector?: DOMAttribute<State, string>
  z?: DOMAttribute<State, number>
  zoomAndPan?: DOMAttribute<State, number>
}