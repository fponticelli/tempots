/**
 * Represents a mapping of HTML event names to their corresponding event types.
 *
 * @public
 */
export type HTMLEvents = {
  abort: Event
  animationcancel: AnimationEvent
  animationend: AnimationEvent
  animationiteration: AnimationEvent
  animationstart: AnimationEvent
  auxclick: MouseEvent
  blur: FocusEvent
  cancel: Event
  canplay: Event
  canplaythrough: Event
  change: Event
  click: MouseEvent
  close: Event
  contextmenu: MouseEvent
  cuechange: Event
  dblclick: MouseEvent
  drag: DragEvent
  dragend: DragEvent
  dragenter: DragEvent
  dragexit: Event
  dragleave: DragEvent
  dragover: DragEvent
  dragstart: DragEvent
  drop: DragEvent
  durationchange: Event
  emptied: Event
  ended: Event
  error: ErrorEvent
  focus: FocusEvent
  focusin: FocusEvent
  focusout: FocusEvent
  gotpointercapture: PointerEvent
  input: Event
  invalid: Event
  keydown: KeyboardEvent
  keypress: KeyboardEvent
  keyup: KeyboardEvent
  load: Event
  loadeddata: Event
  loadedmetadata: Event
  loadend: ProgressEvent
  loadstart: ProgressEvent
  lostpointercapture: PointerEvent
  mousedown: MouseEvent
  mouseenter: MouseEvent
  mouseleave: MouseEvent
  mousemove: MouseEvent
  mouseout: MouseEvent
  mouseover: MouseEvent
  mouseup: MouseEvent
  pause: Event
  play: Event
  playing: Event
  pointercancel: PointerEvent
  pointerdown: PointerEvent
  pointerenter: PointerEvent
  pointerleave: PointerEvent
  pointermove: PointerEvent
  pointerout: PointerEvent
  pointerover: PointerEvent
  pointerup: PointerEvent
  progress: ProgressEvent
  ratechange: Event
  reset: Event
  resize: UIEvent
  scroll: Event
  securitypolicyviolation: SecurityPolicyViolationEvent
  seeked: Event
  seeking: Event
  select: Event
  selectionchange: Event
  selectstart: Event
  stalled: Event
  submit: Event
  suspend: Event
  timeupdate: Event
  toggle: Event
  touchcancel: TouchEvent
  touchend: TouchEvent
  touchmove: TouchEvent
  touchstart: TouchEvent
  transitioncancel: TransitionEvent
  transitionend: TransitionEvent
  transitionrun: TransitionEvent
  transitionstart: TransitionEvent
  volumechange: Event
  waiting: Event
}
