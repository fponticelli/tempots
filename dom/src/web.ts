import { DOMChild } from './template'
import { DOMAttribute, DOMEventHandler } from './value'
import { el, DOMElement } from './element'
import { elNS } from './element_ns'
import { CSSAttributes, CSSProperties } from './css_properties'
import { MoodAttributes } from './mood_attributes'

export interface HTMLTableElementAttributes<State, Action> {
  accessKey?: DOMAttribute<State, string>
  autocapitalize?: DOMAttribute<State, string>
  className?: DOMAttribute<State, string>
  contentEditable?: DOMAttribute<State, string>
  dir?: DOMAttribute<State, string>
  draggable?: DOMAttribute<State, boolean>
  hidden?: DOMAttribute<State, boolean>
  id?: DOMAttribute<State, string>
  inputMode?: DOMAttribute<State, string>
  lang?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  spellcheck?: DOMAttribute<State, boolean>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  title?: DOMAttribute<State, string>
  translate?: DOMAttribute<State, boolean>
  ondragover?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module html {
  export function table<State, Action>(
    attributes: HTMLTableElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, HTMLTableElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLTableElement> {
    return el<State, Action, HTMLTableElement>('table', attributes as never, ...children)
  }
}

export interface SVGFEFuncAElementAttributes<State, Action> {
  className?: DOMAttribute<State, string>
  id?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module svg {
  export function feFuncA<State, Action>(
    attributes: SVGFEFuncAElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, SVGFEFuncAElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, SVGFEFuncAElement> {
    return elNS<State, Action, SVGFEFuncAElement>('svg', 'feFuncA', attributes as never, ...children)
  }
}

export interface SVGFETileElementAttributes<State, Action> {
  className?: DOMAttribute<State, string>
  id?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module svg {
  export function feTile<State, Action>(
    attributes: SVGFETileElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, SVGFETileElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, SVGFETileElement> {
    return elNS<State, Action, SVGFETileElement>('svg', 'feTile', attributes as never, ...children)
  }
}

export interface SVGFEBlendElementAttributes<State, Action> {
  className?: DOMAttribute<State, string>
  id?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module svg {
  export function feBlend<State, Action>(
    attributes: SVGFEBlendElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, SVGFEBlendElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, SVGFEBlendElement> {
    return elNS<State, Action, SVGFEBlendElement>('svg', 'feBlend', attributes as never, ...children)
  }
}

export interface HTMLTimeElementAttributes<State, Action> {
  accessKey?: DOMAttribute<State, string>
  autocapitalize?: DOMAttribute<State, string>
  className?: DOMAttribute<State, string>
  contentEditable?: DOMAttribute<State, string>
  dateTime?: DOMAttribute<State, string>
  dir?: DOMAttribute<State, string>
  draggable?: DOMAttribute<State, boolean>
  hidden?: DOMAttribute<State, boolean>
  id?: DOMAttribute<State, string>
  inputMode?: DOMAttribute<State, string>
  lang?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  scrollLeft?: DOMAttribute<State, number>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  spellcheck?: DOMAttribute<State, boolean>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  title?: DOMAttribute<State, string>
  translate?: DOMAttribute<State, boolean>
  ondragover?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module html {
  export function time<State, Action>(
    attributes: HTMLTimeElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, HTMLTimeElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLTimeElement> {
    return el<State, Action, HTMLTimeElement>('time', attributes as never, ...children)
  }
}

export interface SVGGElementAttributes<State, Action> {
  className?: DOMAttribute<State, string>
  id?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module svg {
  export function g<State, Action>(
    attributes: SVGGElementAttributes<State, Action> & CSSAttributes<State> & MoodAttributes<State, SVGGElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, SVGGElement> {
    return elNS<State, Action, SVGGElement>('svg', 'g', attributes as never, ...children)
  }
}

export interface SVGFEPointLightElementAttributes<State, Action> {
  className?: DOMAttribute<State, string>
  id?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module svg {
  export function fePointLight<State, Action>(
    attributes: SVGFEPointLightElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, SVGFEPointLightElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, SVGFEPointLightElement> {
    return elNS<State, Action, SVGFEPointLightElement>('svg', 'fePointLight', attributes as never, ...children)
  }
}

export interface HTMLBaseElementAttributes<State, Action> {
  accessKey?: DOMAttribute<State, string>
  autocapitalize?: DOMAttribute<State, string>
  className?: DOMAttribute<State, string>
  contentEditable?: DOMAttribute<State, string>
  dir?: DOMAttribute<State, string>
  draggable?: DOMAttribute<State, boolean>
  hidden?: DOMAttribute<State, boolean>
  href?: DOMAttribute<State, string>
  id?: DOMAttribute<State, string>
  inputMode?: DOMAttribute<State, string>
  lang?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  spellcheck?: DOMAttribute<State, boolean>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  target?: DOMAttribute<State, string>
  title?: DOMAttribute<State, string>
  translate?: DOMAttribute<State, boolean>
  ondragleave?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module html {
  export function base<State, Action>(
    attributes: HTMLBaseElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, HTMLBaseElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLBaseElement> {
    return el<State, Action, HTMLBaseElement>('base', attributes as never, ...children)
  }
}

export interface SVGLineElementAttributes<State, Action> {
  className?: DOMAttribute<State, string>
  id?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module svg {
  export function line<State, Action>(
    attributes: SVGLineElementAttributes<State, Action> & CSSAttributes<State> & MoodAttributes<State, SVGLineElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, SVGLineElement> {
    return elNS<State, Action, SVGLineElement>('svg', 'line', attributes as never, ...children)
  }
}

export interface HTMLParagraphElementAttributes<State, Action> {
  accessKey?: DOMAttribute<State, string>
  autocapitalize?: DOMAttribute<State, string>
  className?: DOMAttribute<State, string>
  contentEditable?: DOMAttribute<State, string>
  dir?: DOMAttribute<State, string>
  draggable?: DOMAttribute<State, boolean>
  hidden?: DOMAttribute<State, boolean>
  id?: DOMAttribute<State, string>
  inputMode?: DOMAttribute<State, string>
  lang?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  spellcheck?: DOMAttribute<State, boolean>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  title?: DOMAttribute<State, string>
  translate?: DOMAttribute<State, boolean>
  ondragover?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module html {
  export function p<State, Action>(
    attributes: HTMLParagraphElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, HTMLParagraphElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLParagraphElement> {
    return el<State, Action, HTMLParagraphElement>('p', attributes as never, ...children)
  }
}

export interface HTMLOListElementAttributes<State, Action> {
  accessKey?: DOMAttribute<State, string>
  autocapitalize?: DOMAttribute<State, string>
  className?: DOMAttribute<State, string>
  contentEditable?: DOMAttribute<State, string>
  dir?: DOMAttribute<State, string>
  draggable?: DOMAttribute<State, boolean>
  hidden?: DOMAttribute<State, boolean>
  id?: DOMAttribute<State, string>
  inputMode?: DOMAttribute<State, string>
  lang?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  reversed?: DOMAttribute<State, boolean>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  spellcheck?: DOMAttribute<State, boolean>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  start?: DOMAttribute<State, number>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  title?: DOMAttribute<State, string>
  translate?: DOMAttribute<State, boolean>
  type?: DOMAttribute<State, string>
  ondragleave?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module html {
  export function ol<State, Action>(
    attributes: HTMLOListElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, HTMLOListElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLOListElement> {
    return el<State, Action, HTMLOListElement>('ol', attributes as never, ...children)
  }
}

export interface SVGFEMorphologyElementAttributes<State, Action> {
  className?: DOMAttribute<State, string>
  id?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module svg {
  export function feMorphology<State, Action>(
    attributes: SVGFEMorphologyElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, SVGFEMorphologyElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, SVGFEMorphologyElement> {
    return elNS<State, Action, SVGFEMorphologyElement>('svg', 'feMorphology', attributes as never, ...children)
  }
}

export interface SVGPatternElementAttributes<State, Action> {
  className?: DOMAttribute<State, string>
  id?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module svg {
  export function pattern<State, Action>(
    attributes: SVGPatternElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, SVGPatternElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, SVGPatternElement> {
    return elNS<State, Action, SVGPatternElement>('svg', 'pattern', attributes as never, ...children)
  }
}

export interface SVGViewElementAttributes<State, Action> {
  className?: DOMAttribute<State, string>
  id?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  zoomAndPan?: DOMAttribute<State, number>
  ondrop?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module svg {
  export function view<State, Action>(
    attributes: SVGViewElementAttributes<State, Action> & CSSAttributes<State> & MoodAttributes<State, SVGViewElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, SVGViewElement> {
    return elNS<State, Action, SVGViewElement>('svg', 'view', attributes as never, ...children)
  }
}

export interface HTMLLinkElementAttributes<State, Action> {
  accessKey?: DOMAttribute<State, string>
  as?: DOMAttribute<State, string>
  autocapitalize?: DOMAttribute<State, string>
  className?: DOMAttribute<State, string>
  contentEditable?: DOMAttribute<State, string>
  crossOrigin?: DOMAttribute<State, string>
  dir?: DOMAttribute<State, string>
  disabled?: DOMAttribute<State, boolean>
  draggable?: DOMAttribute<State, boolean>
  hidden?: DOMAttribute<State, boolean>
  href?: DOMAttribute<State, string>
  hreflang?: DOMAttribute<State, string>
  id?: DOMAttribute<State, string>
  imageSizes?: DOMAttribute<State, string>
  imageSrcset?: DOMAttribute<State, string>
  inputMode?: DOMAttribute<State, string>
  integrity?: DOMAttribute<State, string>
  lang?: DOMAttribute<State, string>
  media?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  referrerPolicy?: DOMAttribute<State, string>
  rel?: DOMAttribute<State, string>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  spellcheck?: DOMAttribute<State, boolean>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  title?: DOMAttribute<State, string>
  translate?: DOMAttribute<State, boolean>
  type?: DOMAttribute<State, string>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module html {
  export function link<State, Action>(
    attributes: HTMLLinkElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, HTMLLinkElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLLinkElement> {
    return el<State, Action, HTMLLinkElement>('link', attributes as never, ...children)
  }
}

export interface HTMLFontElementAttributes<State, Action> {
  accessKey?: DOMAttribute<State, string>
  autocapitalize?: DOMAttribute<State, string>
  className?: DOMAttribute<State, string>
  contentEditable?: DOMAttribute<State, string>
  dir?: DOMAttribute<State, string>
  draggable?: DOMAttribute<State, boolean>
  hidden?: DOMAttribute<State, boolean>
  id?: DOMAttribute<State, string>
  inputMode?: DOMAttribute<State, string>
  lang?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  spellcheck?: DOMAttribute<State, boolean>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  title?: DOMAttribute<State, string>
  translate?: DOMAttribute<State, boolean>
  ondragover?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module html {
  export function font<State, Action>(
    attributes: HTMLFontElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, HTMLFontElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLFontElement> {
    return el<State, Action, HTMLFontElement>('font', attributes as never, ...children)
  }
}

export interface HTMLOptionElementAttributes<State, Action> {
  accessKey?: DOMAttribute<State, string>
  autocapitalize?: DOMAttribute<State, string>
  className?: DOMAttribute<State, string>
  contentEditable?: DOMAttribute<State, string>
  defaultSelected?: DOMAttribute<State, boolean>
  dir?: DOMAttribute<State, string>
  disabled?: DOMAttribute<State, boolean>
  draggable?: DOMAttribute<State, boolean>
  hidden?: DOMAttribute<State, boolean>
  id?: DOMAttribute<State, string>
  inputMode?: DOMAttribute<State, string>
  label?: DOMAttribute<State, string>
  lang?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  selected?: DOMAttribute<State, boolean>
  slot?: DOMAttribute<State, string>
  onauxclick?: DOMEventHandler<State, Event, Action>
  spellcheck?: DOMAttribute<State, boolean>
  ondragend?: DOMEventHandler<State, Event, Action>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  text?: DOMAttribute<State, string>
  title?: DOMAttribute<State, string>
  translate?: DOMAttribute<State, boolean>
  value?: DOMAttribute<State, string>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module html {
  export function option<State, Action>(
    attributes: HTMLOptionElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, HTMLOptionElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLOptionElement> {
    return el<State, Action, HTMLOptionElement>('option', attributes as never, ...children)
  }
}

export interface HTMLMapElementAttributes<State, Action> {
  accessKey?: DOMAttribute<State, string>
  autocapitalize?: DOMAttribute<State, string>
  className?: DOMAttribute<State, string>
  contentEditable?: DOMAttribute<State, string>
  dir?: DOMAttribute<State, string>
  draggable?: DOMAttribute<State, boolean>
  hidden?: DOMAttribute<State, boolean>
  id?: DOMAttribute<State, string>
  inputMode?: DOMAttribute<State, string>
  lang?: DOMAttribute<State, string>
  name?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  spellcheck?: DOMAttribute<State, boolean>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  title?: DOMAttribute<State, string>
  translate?: DOMAttribute<State, boolean>
  ondragover?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module html {
  export function map<State, Action>(
    attributes: HTMLMapElementAttributes<State, Action> & CSSAttributes<State> & MoodAttributes<State, HTMLMapElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLMapElement> {
    return el<State, Action, HTMLMapElement>('map', attributes as never, ...children)
  }
}

export interface HTMLMenuElementAttributes<State, Action> {
  accessKey?: DOMAttribute<State, string>
  autocapitalize?: DOMAttribute<State, string>
  className?: DOMAttribute<State, string>
  contentEditable?: DOMAttribute<State, string>
  dir?: DOMAttribute<State, string>
  draggable?: DOMAttribute<State, boolean>
  hidden?: DOMAttribute<State, boolean>
  id?: DOMAttribute<State, string>
  inputMode?: DOMAttribute<State, string>
  lang?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  spellcheck?: DOMAttribute<State, boolean>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  title?: DOMAttribute<State, string>
  translate?: DOMAttribute<State, boolean>
  ondragover?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module html {
  export function menu<State, Action>(
    attributes: HTMLMenuElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, HTMLMenuElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLMenuElement> {
    return el<State, Action, HTMLMenuElement>('menu', attributes as never, ...children)
  }
}

export interface HTMLTemplateElementAttributes<State, Action> {
  accessKey?: DOMAttribute<State, string>
  autocapitalize?: DOMAttribute<State, string>
  className?: DOMAttribute<State, string>
  contentEditable?: DOMAttribute<State, string>
  dir?: DOMAttribute<State, string>
  draggable?: DOMAttribute<State, boolean>
  hidden?: DOMAttribute<State, boolean>
  id?: DOMAttribute<State, string>
  inputMode?: DOMAttribute<State, string>
  lang?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  spellcheck?: DOMAttribute<State, boolean>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  title?: DOMAttribute<State, string>
  translate?: DOMAttribute<State, boolean>
  ondragover?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module html {
  export function template<State, Action>(
    attributes: HTMLTemplateElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, HTMLTemplateElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLTemplateElement> {
    return el<State, Action, HTMLTemplateElement>('template', attributes as never, ...children)
  }
}

export interface SVGFETurbulenceElementAttributes<State, Action> {
  className?: DOMAttribute<State, string>
  id?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module svg {
  export function feTurbulence<State, Action>(
    attributes: SVGFETurbulenceElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, SVGFETurbulenceElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, SVGFETurbulenceElement> {
    return elNS<State, Action, SVGFETurbulenceElement>('svg', 'feTurbulence', attributes as never, ...children)
  }
}

export interface SVGFESpotLightElementAttributes<State, Action> {
  className?: DOMAttribute<State, string>
  id?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module svg {
  export function feSpotLight<State, Action>(
    attributes: SVGFESpotLightElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, SVGFESpotLightElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, SVGFESpotLightElement> {
    return elNS<State, Action, SVGFESpotLightElement>('svg', 'feSpotLight', attributes as never, ...children)
  }
}

export interface HTMLImageElementAttributes<State, Action> {
  accessKey?: DOMAttribute<State, string>
  alt?: DOMAttribute<State, string>
  autocapitalize?: DOMAttribute<State, string>
  className?: DOMAttribute<State, string>
  contentEditable?: DOMAttribute<State, string>
  crossOrigin?: DOMAttribute<State, string>
  decoding?: DOMAttribute<State, 'async' | 'sync' | 'auto'>
  dir?: DOMAttribute<State, string>
  draggable?: DOMAttribute<State, boolean>
  height?: DOMAttribute<State, number>
  hidden?: DOMAttribute<State, boolean>
  id?: DOMAttribute<State, string>
  inputMode?: DOMAttribute<State, string>
  isMap?: DOMAttribute<State, boolean>
  lang?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  referrerPolicy?: DOMAttribute<State, string>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  sizes?: DOMAttribute<State, string>
  slot?: DOMAttribute<State, string>
  spellcheck?: DOMAttribute<State, boolean>
  src?: DOMAttribute<State, string>
  srcset?: DOMAttribute<State, string>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  title?: DOMAttribute<State, string>
  translate?: DOMAttribute<State, boolean>
  useMap?: DOMAttribute<State, string>
  width?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module html {
  export function img<State, Action>(
    attributes: HTMLImageElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, HTMLImageElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLImageElement> {
    return el<State, Action, HTMLImageElement>('img', attributes as never, ...children)
  }
}

export interface HTMLScriptElementAttributes<State, Action> {
  accessKey?: DOMAttribute<State, string>
  async?: DOMAttribute<State, boolean>
  autocapitalize?: DOMAttribute<State, string>
  className?: DOMAttribute<State, string>
  contentEditable?: DOMAttribute<State, string>
  crossOrigin?: DOMAttribute<State, string>
  defer?: DOMAttribute<State, boolean>
  dir?: DOMAttribute<State, string>
  draggable?: DOMAttribute<State, boolean>
  hidden?: DOMAttribute<State, boolean>
  id?: DOMAttribute<State, string>
  inputMode?: DOMAttribute<State, string>
  integrity?: DOMAttribute<State, string>
  lang?: DOMAttribute<State, string>
  noModule?: DOMAttribute<State, boolean>
  nonce?: DOMAttribute<State, string>
  referrerPolicy?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  spellcheck?: DOMAttribute<State, boolean>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  src?: DOMAttribute<State, string>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  text?: DOMAttribute<State, string>
  title?: DOMAttribute<State, string>
  translate?: DOMAttribute<State, boolean>
  type?: DOMAttribute<State, string>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module html {
  export function script<State, Action>(
    attributes: HTMLScriptElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, HTMLScriptElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLScriptElement> {
    return el<State, Action, HTMLScriptElement>('script', attributes as never, ...children)
  }
}

export interface HTMLTableRowElementAttributes<State, Action> {
  accessKey?: DOMAttribute<State, string>
  autocapitalize?: DOMAttribute<State, string>
  className?: DOMAttribute<State, string>
  contentEditable?: DOMAttribute<State, string>
  dir?: DOMAttribute<State, string>
  draggable?: DOMAttribute<State, boolean>
  hidden?: DOMAttribute<State, boolean>
  id?: DOMAttribute<State, string>
  inputMode?: DOMAttribute<State, string>
  lang?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  spellcheck?: DOMAttribute<State, boolean>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  title?: DOMAttribute<State, string>
  translate?: DOMAttribute<State, boolean>
  ondragover?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module html {
  export function tr<State, Action>(
    attributes: HTMLTableRowElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, HTMLTableRowElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLTableRowElement> {
    return el<State, Action, HTMLTableRowElement>('tr', attributes as never, ...children)
  }
}

export interface HTMLFrameElementAttributes<State, Action> {
  accessKey?: DOMAttribute<State, string>
  autocapitalize?: DOMAttribute<State, string>
  className?: DOMAttribute<State, string>
  contentEditable?: DOMAttribute<State, string>
  dir?: DOMAttribute<State, string>
  draggable?: DOMAttribute<State, boolean>
  hidden?: DOMAttribute<State, boolean>
  id?: DOMAttribute<State, string>
  inputMode?: DOMAttribute<State, string>
  lang?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  spellcheck?: DOMAttribute<State, boolean>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  title?: DOMAttribute<State, string>
  translate?: DOMAttribute<State, boolean>
  ondragover?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module html {
  export function frame<State, Action>(
    attributes: HTMLFrameElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, HTMLFrameElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLFrameElement> {
    return el<State, Action, HTMLFrameElement>('frame', attributes as never, ...children)
  }
}

export interface SVGEllipseElementAttributes<State, Action> {
  className?: DOMAttribute<State, string>
  id?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module svg {
  export function ellipse<State, Action>(
    attributes: SVGEllipseElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, SVGEllipseElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, SVGEllipseElement> {
    return elNS<State, Action, SVGEllipseElement>('svg', 'ellipse', attributes as never, ...children)
  }
}

export interface SVGTextElementAttributes<State, Action> {
  className?: DOMAttribute<State, string>
  id?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module svg {
  export function text<State, Action>(
    attributes: SVGTextElementAttributes<State, Action> & CSSAttributes<State> & MoodAttributes<State, SVGTextElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, SVGTextElement> {
    return elNS<State, Action, SVGTextElement>('svg', 'text', attributes as never, ...children)
  }
}

export interface HTMLIFrameElementAttributes<State, Action> {
  accessKey?: DOMAttribute<State, string>
  allow?: DOMAttribute<State, string>
  allowFullscreen?: DOMAttribute<State, boolean>
  allowPaymentRequest?: DOMAttribute<State, boolean>
  autocapitalize?: DOMAttribute<State, string>
  className?: DOMAttribute<State, string>
  contentEditable?: DOMAttribute<State, string>
  dir?: DOMAttribute<State, string>
  draggable?: DOMAttribute<State, boolean>
  height?: DOMAttribute<State, string>
  hidden?: DOMAttribute<State, boolean>
  id?: DOMAttribute<State, string>
  inputMode?: DOMAttribute<State, string>
  lang?: DOMAttribute<State, string>
  name?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  referrerPolicy?: DOMAttribute<State, ReferrerPolicy>
  scrollLeft?: DOMAttribute<State, number>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  spellcheck?: DOMAttribute<State, boolean>
  onanimationend?: DOMEventHandler<State, Event, Action>
  src?: DOMAttribute<State, string>
  srcdoc?: DOMAttribute<State, string>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  title?: DOMAttribute<State, string>
  translate?: DOMAttribute<State, boolean>
  width?: DOMAttribute<State, string>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module html {
  export function iframe<State, Action>(
    attributes: HTMLIFrameElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, HTMLIFrameElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLIFrameElement> {
    return el<State, Action, HTMLIFrameElement>('iframe', attributes as never, ...children)
  }
}

export interface HTMLBodyElementAttributes<State, Action> {
  accessKey?: DOMAttribute<State, string>
  autocapitalize?: DOMAttribute<State, string>
  bgProperties?: DOMAttribute<State, string>
  className?: DOMAttribute<State, string>
  contentEditable?: DOMAttribute<State, string>
  dir?: DOMAttribute<State, string>
  draggable?: DOMAttribute<State, boolean>
  hidden?: DOMAttribute<State, boolean>
  id?: DOMAttribute<State, string>
  inputMode?: DOMAttribute<State, string>
  lang?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollTop?: DOMAttribute<State, number>
  spellcheck?: DOMAttribute<State, boolean>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  scrollLeft?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  title?: DOMAttribute<State, string>
  translate?: DOMAttribute<State, boolean>
  onafterprint?: DOMEventHandler<State, Event, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onbeforeprint?: DOMEventHandler<State, Event, Action>
  onbeforeunload?: DOMEventHandler<State, BeforeUnloadEvent, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  onhashchange?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onlanguagechange?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmessage?: DOMEventHandler<State, Event, Action>
  onmessageerror?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onoffline?: DOMEventHandler<State, Event, Action>
  ononline?: DOMEventHandler<State, Event, Action>
  onpagehide?: DOMEventHandler<State, Event, Action>
  onpageshow?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onstorage?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onunhandledrejection?: DOMEventHandler<State, Event, Action>
  onunload?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module html {
  export function body<State, Action>(
    attributes: HTMLBodyElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, HTMLBodyElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLBodyElement> {
    return el<State, Action, HTMLBodyElement>('body', attributes as never, ...children)
  }
}

export interface SVGFilterElementAttributes<State, Action> {
  className?: DOMAttribute<State, string>
  id?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module svg {
  export function filter<State, Action>(
    attributes: SVGFilterElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, SVGFilterElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, SVGFilterElement> {
    return elNS<State, Action, SVGFilterElement>('svg', 'filter', attributes as never, ...children)
  }
}

export interface SVGImageElementAttributes<State, Action> {
  className?: DOMAttribute<State, string>
  id?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module svg {
  export function image<State, Action>(
    attributes: SVGImageElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, SVGImageElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, SVGImageElement> {
    return elNS<State, Action, SVGImageElement>('svg', 'image', attributes as never, ...children)
  }
}

export interface HTMLCanvasElementAttributes<State, Action> {
  accessKey?: DOMAttribute<State, string>
  autocapitalize?: DOMAttribute<State, string>
  className?: DOMAttribute<State, string>
  contentEditable?: DOMAttribute<State, string>
  dir?: DOMAttribute<State, string>
  draggable?: DOMAttribute<State, boolean>
  height?: DOMAttribute<State, number>
  hidden?: DOMAttribute<State, boolean>
  id?: DOMAttribute<State, string>
  inputMode?: DOMAttribute<State, string>
  lang?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  spellcheck?: DOMAttribute<State, boolean>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  translate?: DOMAttribute<State, boolean>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  title?: DOMAttribute<State, string>
  width?: DOMAttribute<State, number>
  ondragleave?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module html {
  export function canvas<State, Action>(
    attributes: HTMLCanvasElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, HTMLCanvasElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLCanvasElement> {
    return el<State, Action, HTMLCanvasElement>('canvas', attributes as never, ...children)
  }
}

export interface HTMLTitleElementAttributes<State, Action> {
  accessKey?: DOMAttribute<State, string>
  autocapitalize?: DOMAttribute<State, string>
  className?: DOMAttribute<State, string>
  contentEditable?: DOMAttribute<State, string>
  dir?: DOMAttribute<State, string>
  draggable?: DOMAttribute<State, boolean>
  hidden?: DOMAttribute<State, boolean>
  id?: DOMAttribute<State, string>
  inputMode?: DOMAttribute<State, string>
  lang?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  spellcheck?: DOMAttribute<State, boolean>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  text?: DOMAttribute<State, string>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  title?: DOMAttribute<State, string>
  translate?: DOMAttribute<State, boolean>
  ondragover?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module html {
  export function title<State, Action>(
    attributes: HTMLTitleElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, HTMLTitleElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLTitleElement> {
    return el<State, Action, HTMLTitleElement>('title', attributes as never, ...children)
  }
}

export interface HTMLStyleElementAttributes<State, Action> {
  accessKey?: DOMAttribute<State, string>
  autocapitalize?: DOMAttribute<State, string>
  className?: DOMAttribute<State, string>
  contentEditable?: DOMAttribute<State, string>
  dir?: DOMAttribute<State, string>
  draggable?: DOMAttribute<State, boolean>
  hidden?: DOMAttribute<State, boolean>
  id?: DOMAttribute<State, string>
  inputMode?: DOMAttribute<State, string>
  lang?: DOMAttribute<State, string>
  media?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  spellcheck?: DOMAttribute<State, boolean>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  title?: DOMAttribute<State, string>
  translate?: DOMAttribute<State, boolean>
  ondragover?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module html {
  export function style<State, Action>(
    attributes: HTMLStyleElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, HTMLStyleElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLStyleElement> {
    return el<State, Action, HTMLStyleElement>('style', attributes as never, ...children)
  }
}

export interface HTMLTableCellElementAttributes<State, Action> {
  abbr?: DOMAttribute<State, string>
  accessKey?: DOMAttribute<State, string>
  autocapitalize?: DOMAttribute<State, string>
  className?: DOMAttribute<State, string>
  colSpan?: DOMAttribute<State, number>
  contentEditable?: DOMAttribute<State, string>
  dir?: DOMAttribute<State, string>
  draggable?: DOMAttribute<State, boolean>
  headers?: DOMAttribute<State, string>
  hidden?: DOMAttribute<State, boolean>
  id?: DOMAttribute<State, string>
  inputMode?: DOMAttribute<State, string>
  lang?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  rowSpan?: DOMAttribute<State, number>
  scope?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  spellcheck?: DOMAttribute<State, boolean>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  title?: DOMAttribute<State, string>
  translate?: DOMAttribute<State, boolean>
  ondragexit?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export interface HTMLTextAreaElementAttributes<State, Action> {
  accessKey?: DOMAttribute<State, string>
  autocapitalize?: DOMAttribute<State, string>
  autocomplete?: DOMAttribute<State, string>
  autofocus?: DOMAttribute<State, boolean>
  className?: DOMAttribute<State, string>
  cols?: DOMAttribute<State, number>
  contentEditable?: DOMAttribute<State, string>
  defaultValue?: DOMAttribute<State, string>
  dir?: DOMAttribute<State, string>
  dirName?: DOMAttribute<State, string>
  disabled?: DOMAttribute<State, boolean>
  draggable?: DOMAttribute<State, boolean>
  hidden?: DOMAttribute<State, boolean>
  id?: DOMAttribute<State, string>
  inputMode?: DOMAttribute<State, string>
  lang?: DOMAttribute<State, string>
  maxLength?: DOMAttribute<State, number>
  minLength?: DOMAttribute<State, number>
  name?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  placeholder?: DOMAttribute<State, string>
  readOnly?: DOMAttribute<State, boolean>
  rows?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  required?: DOMAttribute<State, boolean>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  selectionDirection?: DOMAttribute<State, string>
  selectionEnd?: DOMAttribute<State, number>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  selectionStart?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  spellcheck?: DOMAttribute<State, boolean>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  title?: DOMAttribute<State, string>
  translate?: DOMAttribute<State, boolean>
  value?: DOMAttribute<State, string>
  wrap?: DOMAttribute<State, string>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module html {
  export function textarea<State, Action>(
    attributes: HTMLTextAreaElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, HTMLTextAreaElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLTextAreaElement> {
    return el<State, Action, HTMLTextAreaElement>('textarea', attributes as never, ...children)
  }
}

export interface HTMLModElementAttributes<State, Action> {
  accessKey?: DOMAttribute<State, string>
  autocapitalize?: DOMAttribute<State, string>
  cite?: DOMAttribute<State, string>
  className?: DOMAttribute<State, string>
  contentEditable?: DOMAttribute<State, string>
  dateTime?: DOMAttribute<State, string>
  dir?: DOMAttribute<State, string>
  draggable?: DOMAttribute<State, boolean>
  hidden?: DOMAttribute<State, boolean>
  id?: DOMAttribute<State, string>
  inputMode?: DOMAttribute<State, string>
  lang?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  translate?: DOMAttribute<State, boolean>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  spellcheck?: DOMAttribute<State, boolean>
  title?: DOMAttribute<State, string>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  scrollLeft?: DOMAttribute<State, number>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module html {
  export function del<State, Action>(
    attributes: HTMLModElementAttributes<State, Action> & CSSAttributes<State> & MoodAttributes<State, HTMLModElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLModElement> {
    return el<State, Action, HTMLModElement>('del', attributes as never, ...children)
  }
}

export module html {
  export function ins<State, Action>(
    attributes: HTMLModElementAttributes<State, Action> & CSSAttributes<State> & MoodAttributes<State, HTMLModElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLModElement> {
    return el<State, Action, HTMLModElement>('ins', attributes as never, ...children)
  }
}

export interface SVGUseElementAttributes<State, Action> {
  className?: DOMAttribute<State, string>
  id?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module svg {
  export function use<State, Action>(
    attributes: SVGUseElementAttributes<State, Action> & CSSAttributes<State> & MoodAttributes<State, SVGUseElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, SVGUseElement> {
    return elNS<State, Action, SVGUseElement>('svg', 'use', attributes as never, ...children)
  }
}

export interface HTMLTableColElementAttributes<State, Action> {
  accessKey?: DOMAttribute<State, string>
  autocapitalize?: DOMAttribute<State, string>
  className?: DOMAttribute<State, string>
  contentEditable?: DOMAttribute<State, string>
  dir?: DOMAttribute<State, string>
  draggable?: DOMAttribute<State, boolean>
  hidden?: DOMAttribute<State, boolean>
  id?: DOMAttribute<State, string>
  inputMode?: DOMAttribute<State, string>
  lang?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  spellcheck?: DOMAttribute<State, boolean>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  span?: DOMAttribute<State, number>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  title?: DOMAttribute<State, string>
  translate?: DOMAttribute<State, boolean>
  ondragover?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module html {
  export function col<State, Action>(
    attributes: HTMLTableColElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, HTMLTableColElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLTableColElement> {
    return el<State, Action, HTMLTableColElement>('col', attributes as never, ...children)
  }
}

export module html {
  export function colgroup<State, Action>(
    attributes: HTMLTableColElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, HTMLTableColElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLTableColElement> {
    return el<State, Action, HTMLTableColElement>('colgroup', attributes as never, ...children)
  }
}

export interface SVGFEFuncBElementAttributes<State, Action> {
  className?: DOMAttribute<State, string>
  id?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module svg {
  export function feFuncB<State, Action>(
    attributes: SVGFEFuncBElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, SVGFEFuncBElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, SVGFEFuncBElement> {
    return elNS<State, Action, SVGFEFuncBElement>('svg', 'feFuncB', attributes as never, ...children)
  }
}

export interface HTMLUListElementAttributes<State, Action> {
  accessKey?: DOMAttribute<State, string>
  autocapitalize?: DOMAttribute<State, string>
  className?: DOMAttribute<State, string>
  contentEditable?: DOMAttribute<State, string>
  dir?: DOMAttribute<State, string>
  draggable?: DOMAttribute<State, boolean>
  hidden?: DOMAttribute<State, boolean>
  id?: DOMAttribute<State, string>
  inputMode?: DOMAttribute<State, string>
  lang?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  spellcheck?: DOMAttribute<State, boolean>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  title?: DOMAttribute<State, string>
  translate?: DOMAttribute<State, boolean>
  ondragover?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module html {
  export function ul<State, Action>(
    attributes: HTMLUListElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, HTMLUListElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLUListElement> {
    return el<State, Action, HTMLUListElement>('ul', attributes as never, ...children)
  }
}

export interface HTMLDivElementAttributes<State, Action> {
  accessKey?: DOMAttribute<State, string>
  autocapitalize?: DOMAttribute<State, string>
  className?: DOMAttribute<State, string>
  contentEditable?: DOMAttribute<State, string>
  dir?: DOMAttribute<State, string>
  draggable?: DOMAttribute<State, boolean>
  hidden?: DOMAttribute<State, boolean>
  id?: DOMAttribute<State, string>
  inputMode?: DOMAttribute<State, string>
  lang?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  spellcheck?: DOMAttribute<State, boolean>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  title?: DOMAttribute<State, string>
  translate?: DOMAttribute<State, boolean>
  ondragover?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module html {
  export function div<State, Action>(
    attributes: HTMLDivElementAttributes<State, Action> & CSSAttributes<State> & MoodAttributes<State, HTMLDivElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLDivElement> {
    return el<State, Action, HTMLDivElement>('div', attributes as never, ...children)
  }
}

export interface SVGFEColorMatrixElementAttributes<State, Action> {
  className?: DOMAttribute<State, string>
  id?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module svg {
  export function feColorMatrix<State, Action>(
    attributes: SVGFEColorMatrixElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, SVGFEColorMatrixElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, SVGFEColorMatrixElement> {
    return elNS<State, Action, SVGFEColorMatrixElement>('svg', 'feColorMatrix', attributes as never, ...children)
  }
}

export interface SVGForeignObjectElementAttributes<State, Action> {
  className?: DOMAttribute<State, string>
  id?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module svg {
  export function foreignObject<State, Action>(
    attributes: SVGForeignObjectElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, SVGForeignObjectElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, SVGForeignObjectElement> {
    return elNS<State, Action, SVGForeignObjectElement>('svg', 'foreignObject', attributes as never, ...children)
  }
}

export interface HTMLBRElementAttributes<State, Action> {
  accessKey?: DOMAttribute<State, string>
  autocapitalize?: DOMAttribute<State, string>
  className?: DOMAttribute<State, string>
  contentEditable?: DOMAttribute<State, string>
  dir?: DOMAttribute<State, string>
  draggable?: DOMAttribute<State, boolean>
  hidden?: DOMAttribute<State, boolean>
  id?: DOMAttribute<State, string>
  inputMode?: DOMAttribute<State, string>
  lang?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  spellcheck?: DOMAttribute<State, boolean>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  title?: DOMAttribute<State, string>
  translate?: DOMAttribute<State, boolean>
  ondragover?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module html {
  export function br<State, Action>(
    attributes: HTMLBRElementAttributes<State, Action> & CSSAttributes<State> & MoodAttributes<State, HTMLBRElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLBRElement> {
    return el<State, Action, HTMLBRElement>('br', attributes as never, ...children)
  }
}

export interface HTMLProgressElementAttributes<State, Action> {
  accessKey?: DOMAttribute<State, string>
  autocapitalize?: DOMAttribute<State, string>
  className?: DOMAttribute<State, string>
  contentEditable?: DOMAttribute<State, string>
  dir?: DOMAttribute<State, string>
  draggable?: DOMAttribute<State, boolean>
  hidden?: DOMAttribute<State, boolean>
  id?: DOMAttribute<State, string>
  inputMode?: DOMAttribute<State, string>
  lang?: DOMAttribute<State, string>
  max?: DOMAttribute<State, number>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  spellcheck?: DOMAttribute<State, boolean>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  translate?: DOMAttribute<State, boolean>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  title?: DOMAttribute<State, string>
  value?: DOMAttribute<State, number>
  ondragleave?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module html {
  export function progress<State, Action>(
    attributes: HTMLProgressElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, HTMLProgressElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLProgressElement> {
    return el<State, Action, HTMLProgressElement>('progress', attributes as never, ...children)
  }
}

export interface HTMLHeadElementAttributes<State, Action> {
  accessKey?: DOMAttribute<State, string>
  autocapitalize?: DOMAttribute<State, string>
  className?: DOMAttribute<State, string>
  contentEditable?: DOMAttribute<State, string>
  dir?: DOMAttribute<State, string>
  draggable?: DOMAttribute<State, boolean>
  hidden?: DOMAttribute<State, boolean>
  id?: DOMAttribute<State, string>
  inputMode?: DOMAttribute<State, string>
  lang?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  spellcheck?: DOMAttribute<State, boolean>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  title?: DOMAttribute<State, string>
  translate?: DOMAttribute<State, boolean>
  ondragover?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module html {
  export function head<State, Action>(
    attributes: HTMLHeadElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, HTMLHeadElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLHeadElement> {
    return el<State, Action, HTMLHeadElement>('head', attributes as never, ...children)
  }
}

export interface SVGTextPathElementAttributes<State, Action> {
  className?: DOMAttribute<State, string>
  id?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module svg {
  export function textPath<State, Action>(
    attributes: SVGTextPathElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, SVGTextPathElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, SVGTextPathElement> {
    return elNS<State, Action, SVGTextPathElement>('svg', 'textPath', attributes as never, ...children)
  }
}

export interface HTMLObjectElementAttributes<State, Action> {
  accessKey?: DOMAttribute<State, string>
  autocapitalize?: DOMAttribute<State, string>
  className?: DOMAttribute<State, string>
  contentEditable?: DOMAttribute<State, string>
  data?: DOMAttribute<State, string>
  dir?: DOMAttribute<State, string>
  draggable?: DOMAttribute<State, boolean>
  height?: DOMAttribute<State, string>
  hidden?: DOMAttribute<State, boolean>
  id?: DOMAttribute<State, string>
  inputMode?: DOMAttribute<State, string>
  lang?: DOMAttribute<State, string>
  name?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  spellcheck?: DOMAttribute<State, boolean>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  title?: DOMAttribute<State, string>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  translate?: DOMAttribute<State, boolean>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  type?: DOMAttribute<State, string>
  useMap?: DOMAttribute<State, string>
  width?: DOMAttribute<State, string>
  ondragenter?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module html {
  export function object<State, Action>(
    attributes: HTMLObjectElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, HTMLObjectElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLObjectElement> {
    return el<State, Action, HTMLObjectElement>('object', attributes as never, ...children)
  }
}

export interface HTMLEmbedElementAttributes<State, Action> {
  accessKey?: DOMAttribute<State, string>
  autocapitalize?: DOMAttribute<State, string>
  className?: DOMAttribute<State, string>
  contentEditable?: DOMAttribute<State, string>
  dir?: DOMAttribute<State, string>
  draggable?: DOMAttribute<State, boolean>
  height?: DOMAttribute<State, string>
  hidden?: DOMAttribute<State, boolean>
  id?: DOMAttribute<State, string>
  inputMode?: DOMAttribute<State, string>
  lang?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  onanimationend?: DOMEventHandler<State, Event, Action>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  spellcheck?: DOMAttribute<State, boolean>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  src?: DOMAttribute<State, string>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  title?: DOMAttribute<State, string>
  translate?: DOMAttribute<State, boolean>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  type?: DOMAttribute<State, string>
  width?: DOMAttribute<State, string>
  ondragexit?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module html {
  export function embed<State, Action>(
    attributes: HTMLEmbedElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, HTMLEmbedElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLEmbedElement> {
    return el<State, Action, HTMLEmbedElement>('embed', attributes as never, ...children)
  }
}

export interface SVGFECompositeElementAttributes<State, Action> {
  className?: DOMAttribute<State, string>
  id?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module svg {
  export function feComposite<State, Action>(
    attributes: SVGFECompositeElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, SVGFECompositeElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, SVGFECompositeElement> {
    return elNS<State, Action, SVGFECompositeElement>('svg', 'feComposite', attributes as never, ...children)
  }
}

export interface SVGSymbolElementAttributes<State, Action> {
  className?: DOMAttribute<State, string>
  id?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module svg {
  export function symbol<State, Action>(
    attributes: SVGSymbolElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, SVGSymbolElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, SVGSymbolElement> {
    return elNS<State, Action, SVGSymbolElement>('svg', 'symbol', attributes as never, ...children)
  }
}

export interface HTMLVideoElementAttributes<State, Action> {
  accessKey?: DOMAttribute<State, string>
  autocapitalize?: DOMAttribute<State, string>
  autoplay?: DOMAttribute<State, boolean>
  className?: DOMAttribute<State, string>
  contentEditable?: DOMAttribute<State, string>
  controls?: DOMAttribute<State, boolean>
  crossOrigin?: DOMAttribute<State, string>
  currentTime?: DOMAttribute<State, number>
  defaultMuted?: DOMAttribute<State, boolean>
  defaultPlaybackRate?: DOMAttribute<State, number>
  dir?: DOMAttribute<State, string>
  draggable?: DOMAttribute<State, boolean>
  height?: DOMAttribute<State, number>
  hidden?: DOMAttribute<State, boolean>
  id?: DOMAttribute<State, string>
  inputMode?: DOMAttribute<State, string>
  lang?: DOMAttribute<State, string>
  loop?: DOMAttribute<State, boolean>
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
  muted?: DOMAttribute<State, boolean>
  nonce?: DOMAttribute<State, string>
  preload?: DOMAttribute<State, string>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  poster?: DOMAttribute<State, string>
  onMSVideoFormatChanged?: DOMEventHandler<State, Event, Action>
  onMSVideoFrameStepCompleted?: DOMEventHandler<State, Event, Action>
  onMSVideoOptimalLayoutChanged?: DOMEventHandler<State, Event, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  playbackRate?: DOMAttribute<State, number>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  spellcheck?: DOMAttribute<State, boolean>
  src?: DOMAttribute<State, string>
  srcObject?: DOMAttribute<State, MediaStream | MediaSource | Blob>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  title?: DOMAttribute<State, string>
  translate?: DOMAttribute<State, boolean>
  volume?: DOMAttribute<State, number>
  width?: DOMAttribute<State, number>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onencrypted?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwaitingforkey?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module html {
  export function video<State, Action>(
    attributes: HTMLVideoElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, HTMLVideoElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLVideoElement> {
    return el<State, Action, HTMLVideoElement>('video', attributes as never, ...children)
  }
}

export interface SVGFEDiffuseLightingElementAttributes<State, Action> {
  className?: DOMAttribute<State, string>
  id?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module svg {
  export function feDiffuseLighting<State, Action>(
    attributes: SVGFEDiffuseLightingElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, SVGFEDiffuseLightingElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, SVGFEDiffuseLightingElement> {
    return elNS<State, Action, SVGFEDiffuseLightingElement>(
      'svg',
      'feDiffuseLighting',
      attributes as never,
      ...children
    )
  }
}

export interface SVGFEComponentTransferElementAttributes<State, Action> {
  className?: DOMAttribute<State, string>
  id?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module svg {
  export function feComponentTransfer<State, Action>(
    attributes: SVGFEComponentTransferElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, SVGFEComponentTransferElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, SVGFEComponentTransferElement> {
    return elNS<State, Action, SVGFEComponentTransferElement>(
      'svg',
      'feComponentTransfer',
      attributes as never,
      ...children
    )
  }
}

export interface SVGFEFloodElementAttributes<State, Action> {
  className?: DOMAttribute<State, string>
  id?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module svg {
  export function feFlood<State, Action>(
    attributes: SVGFEFloodElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, SVGFEFloodElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, SVGFEFloodElement> {
    return elNS<State, Action, SVGFEFloodElement>('svg', 'feFlood', attributes as never, ...children)
  }
}

export interface SVGFEMergeNodeElementAttributes<State, Action> {
  className?: DOMAttribute<State, string>
  id?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module svg {
  export function feMergeNode<State, Action>(
    attributes: SVGFEMergeNodeElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, SVGFEMergeNodeElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, SVGFEMergeNodeElement> {
    return elNS<State, Action, SVGFEMergeNodeElement>('svg', 'feMergeNode', attributes as never, ...children)
  }
}

export interface HTMLPictureElementAttributes<State, Action> {
  accessKey?: DOMAttribute<State, string>
  autocapitalize?: DOMAttribute<State, string>
  className?: DOMAttribute<State, string>
  contentEditable?: DOMAttribute<State, string>
  dir?: DOMAttribute<State, string>
  draggable?: DOMAttribute<State, boolean>
  hidden?: DOMAttribute<State, boolean>
  id?: DOMAttribute<State, string>
  inputMode?: DOMAttribute<State, string>
  lang?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  spellcheck?: DOMAttribute<State, boolean>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  title?: DOMAttribute<State, string>
  translate?: DOMAttribute<State, boolean>
  ondragover?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module html {
  export function picture<State, Action>(
    attributes: HTMLPictureElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, HTMLPictureElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLPictureElement> {
    return el<State, Action, HTMLPictureElement>('picture', attributes as never, ...children)
  }
}

export interface SVGMarkerElementAttributes<State, Action> {
  className?: DOMAttribute<State, string>
  id?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module svg {
  export function marker<State, Action>(
    attributes: SVGMarkerElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, SVGMarkerElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, SVGMarkerElement> {
    return elNS<State, Action, SVGMarkerElement>('svg', 'marker', attributes as never, ...children)
  }
}

export interface HTMLMeterElementAttributes<State, Action> {
  accessKey?: DOMAttribute<State, string>
  autocapitalize?: DOMAttribute<State, string>
  className?: DOMAttribute<State, string>
  contentEditable?: DOMAttribute<State, string>
  dir?: DOMAttribute<State, string>
  draggable?: DOMAttribute<State, boolean>
  hidden?: DOMAttribute<State, boolean>
  high?: DOMAttribute<State, number>
  id?: DOMAttribute<State, string>
  inputMode?: DOMAttribute<State, string>
  lang?: DOMAttribute<State, string>
  low?: DOMAttribute<State, number>
  max?: DOMAttribute<State, number>
  min?: DOMAttribute<State, number>
  nonce?: DOMAttribute<State, string>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  optimum?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  spellcheck?: DOMAttribute<State, boolean>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  title?: DOMAttribute<State, string>
  translate?: DOMAttribute<State, boolean>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  value?: DOMAttribute<State, number>
  ondragenter?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module html {
  export function meter<State, Action>(
    attributes: HTMLMeterElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, HTMLMeterElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLMeterElement> {
    return el<State, Action, HTMLMeterElement>('meter', attributes as never, ...children)
  }
}

export interface SVGFEMergeElementAttributes<State, Action> {
  className?: DOMAttribute<State, string>
  id?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module svg {
  export function feMerge<State, Action>(
    attributes: SVGFEMergeElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, SVGFEMergeElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, SVGFEMergeElement> {
    return elNS<State, Action, SVGFEMergeElement>('svg', 'feMerge', attributes as never, ...children)
  }
}

export interface SVGFESpecularLightingElementAttributes<State, Action> {
  className?: DOMAttribute<State, string>
  id?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module svg {
  export function feSpecularLighting<State, Action>(
    attributes: SVGFESpecularLightingElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, SVGFESpecularLightingElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, SVGFESpecularLightingElement> {
    return elNS<State, Action, SVGFESpecularLightingElement>(
      'svg',
      'feSpecularLighting',
      attributes as never,
      ...children
    )
  }
}

export interface SVGDescElementAttributes<State, Action> {
  className?: DOMAttribute<State, string>
  id?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module svg {
  export function desc<State, Action>(
    attributes: SVGDescElementAttributes<State, Action> & CSSAttributes<State> & MoodAttributes<State, SVGDescElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, SVGDescElement> {
    return elNS<State, Action, SVGDescElement>('svg', 'desc', attributes as never, ...children)
  }
}

export interface SVGClipPathElementAttributes<State, Action> {
  className?: DOMAttribute<State, string>
  id?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module svg {
  export function clipPath<State, Action>(
    attributes: SVGClipPathElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, SVGClipPathElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, SVGClipPathElement> {
    return elNS<State, Action, SVGClipPathElement>('svg', 'clipPath', attributes as never, ...children)
  }
}

export interface HTMLAppletElementAttributes<State, Action> {
  accessKey?: DOMAttribute<State, string>
  autocapitalize?: DOMAttribute<State, string>
  className?: DOMAttribute<State, string>
  contentEditable?: DOMAttribute<State, string>
  dir?: DOMAttribute<State, string>
  draggable?: DOMAttribute<State, boolean>
  hidden?: DOMAttribute<State, boolean>
  id?: DOMAttribute<State, string>
  inputMode?: DOMAttribute<State, string>
  lang?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  spellcheck?: DOMAttribute<State, boolean>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  title?: DOMAttribute<State, string>
  translate?: DOMAttribute<State, boolean>
  ondragover?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module html {
  export function applet<State, Action>(
    attributes: HTMLAppletElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, HTMLAppletElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLAppletElement> {
    return el<State, Action, HTMLAppletElement>('applet', attributes as never, ...children)
  }
}

export interface HTMLSelectElementAttributes<State, Action> {
  accessKey?: DOMAttribute<State, string>
  autocapitalize?: DOMAttribute<State, string>
  autocomplete?: DOMAttribute<State, string>
  autofocus?: DOMAttribute<State, boolean>
  className?: DOMAttribute<State, string>
  contentEditable?: DOMAttribute<State, string>
  dir?: DOMAttribute<State, string>
  disabled?: DOMAttribute<State, boolean>
  draggable?: DOMAttribute<State, boolean>
  hidden?: DOMAttribute<State, boolean>
  id?: DOMAttribute<State, string>
  inputMode?: DOMAttribute<State, string>
  lang?: DOMAttribute<State, string>
  length?: DOMAttribute<State, number>
  multiple?: DOMAttribute<State, boolean>
  name?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  required?: DOMAttribute<State, boolean>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  selectedIndex?: DOMAttribute<State, number>
  size?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  spellcheck?: DOMAttribute<State, boolean>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  title?: DOMAttribute<State, string>
  translate?: DOMAttribute<State, boolean>
  value?: DOMAttribute<State, string>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module html {
  export function select<State, Action>(
    attributes: HTMLSelectElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, HTMLSelectElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLSelectElement> {
    return el<State, Action, HTMLSelectElement>('select', attributes as never, ...children)
  }
}

export interface HTMLMetaElementAttributes<State, Action> {
  accessKey?: DOMAttribute<State, string>
  autocapitalize?: DOMAttribute<State, string>
  className?: DOMAttribute<State, string>
  content?: DOMAttribute<State, string>
  contentEditable?: DOMAttribute<State, string>
  dir?: DOMAttribute<State, string>
  draggable?: DOMAttribute<State, boolean>
  hidden?: DOMAttribute<State, boolean>
  httpEquiv?: DOMAttribute<State, string>
  id?: DOMAttribute<State, string>
  inputMode?: DOMAttribute<State, string>
  lang?: DOMAttribute<State, string>
  name?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  spellcheck?: DOMAttribute<State, boolean>
  style?: DOMAttribute<State, CSSProperties>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  scrollLeft?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  tabIndex?: DOMAttribute<State, number>
  title?: DOMAttribute<State, string>
  translate?: DOMAttribute<State, boolean>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  scrollTop?: DOMAttribute<State, number>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module html {
  export function meta<State, Action>(
    attributes: HTMLMetaElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, HTMLMetaElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLMetaElement> {
    return el<State, Action, HTMLMetaElement>('meta', attributes as never, ...children)
  }
}

export interface SVGScriptElementAttributes<State, Action> {
  className?: DOMAttribute<State, string>
  id?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  type?: DOMAttribute<State, string>
  ondrop?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module svg {
  export function script<State, Action>(
    attributes: SVGScriptElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, SVGScriptElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, SVGScriptElement> {
    return elNS<State, Action, SVGScriptElement>('svg', 'script', attributes as never, ...children)
  }
}

export interface SVGFEDistantLightElementAttributes<State, Action> {
  className?: DOMAttribute<State, string>
  id?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module svg {
  export function feDistantLight<State, Action>(
    attributes: SVGFEDistantLightElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, SVGFEDistantLightElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, SVGFEDistantLightElement> {
    return elNS<State, Action, SVGFEDistantLightElement>('svg', 'feDistantLight', attributes as never, ...children)
  }
}

export interface SVGTitleElementAttributes<State, Action> {
  className?: DOMAttribute<State, string>
  id?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module svg {
  export function title<State, Action>(
    attributes: SVGTitleElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, SVGTitleElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, SVGTitleElement> {
    return elNS<State, Action, SVGTitleElement>('svg', 'title', attributes as never, ...children)
  }
}

export interface HTMLTableCaptionElementAttributes<State, Action> {
  accessKey?: DOMAttribute<State, string>
  autocapitalize?: DOMAttribute<State, string>
  className?: DOMAttribute<State, string>
  contentEditable?: DOMAttribute<State, string>
  dir?: DOMAttribute<State, string>
  draggable?: DOMAttribute<State, boolean>
  hidden?: DOMAttribute<State, boolean>
  id?: DOMAttribute<State, string>
  inputMode?: DOMAttribute<State, string>
  lang?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  spellcheck?: DOMAttribute<State, boolean>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  title?: DOMAttribute<State, string>
  translate?: DOMAttribute<State, boolean>
  ondragover?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module html {
  export function caption<State, Action>(
    attributes: HTMLTableCaptionElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, HTMLTableCaptionElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLTableCaptionElement> {
    return el<State, Action, HTMLTableCaptionElement>('caption', attributes as never, ...children)
  }
}

export interface SVGFEConvolveMatrixElementAttributes<State, Action> {
  className?: DOMAttribute<State, string>
  id?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module svg {
  export function feConvolveMatrix<State, Action>(
    attributes: SVGFEConvolveMatrixElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, SVGFEConvolveMatrixElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, SVGFEConvolveMatrixElement> {
    return elNS<State, Action, SVGFEConvolveMatrixElement>('svg', 'feConvolveMatrix', attributes as never, ...children)
  }
}

export interface SVGFEFuncGElementAttributes<State, Action> {
  className?: DOMAttribute<State, string>
  id?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module svg {
  export function feFuncG<State, Action>(
    attributes: SVGFEFuncGElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, SVGFEFuncGElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, SVGFEFuncGElement> {
    return elNS<State, Action, SVGFEFuncGElement>('svg', 'feFuncG', attributes as never, ...children)
  }
}

export interface HTMLAreaElementAttributes<State, Action> {
  accessKey?: DOMAttribute<State, string>
  alt?: DOMAttribute<State, string>
  autocapitalize?: DOMAttribute<State, string>
  className?: DOMAttribute<State, string>
  contentEditable?: DOMAttribute<State, string>
  coords?: DOMAttribute<State, string>
  dir?: DOMAttribute<State, string>
  download?: DOMAttribute<State, string>
  draggable?: DOMAttribute<State, boolean>
  hash?: DOMAttribute<State, string>
  hidden?: DOMAttribute<State, boolean>
  host?: DOMAttribute<State, string>
  hostname?: DOMAttribute<State, string>
  href?: DOMAttribute<State, string>
  id?: DOMAttribute<State, string>
  inputMode?: DOMAttribute<State, string>
  lang?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  password?: DOMAttribute<State, string>
  pathname?: DOMAttribute<State, string>
  ping?: DOMAttribute<State, string>
  protocol?: DOMAttribute<State, string>
  rel?: DOMAttribute<State, string>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  port?: DOMAttribute<State, string>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  referrerPolicy?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  search?: DOMAttribute<State, string>
  shape?: DOMAttribute<State, string>
  slot?: DOMAttribute<State, string>
  spellcheck?: DOMAttribute<State, boolean>
  tabIndex?: DOMAttribute<State, number>
  target?: DOMAttribute<State, string>
  title?: DOMAttribute<State, string>
  translate?: DOMAttribute<State, boolean>
  username?: DOMAttribute<State, string>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  style?: DOMAttribute<State, CSSProperties>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module html {
  export function area<State, Action>(
    attributes: HTMLAreaElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, HTMLAreaElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLAreaElement> {
    return el<State, Action, HTMLAreaElement>('area', attributes as never, ...children)
  }
}

export interface HTMLButtonElementAttributes<State, Action> {
  accessKey?: DOMAttribute<State, string>
  autocapitalize?: DOMAttribute<State, string>
  autofocus?: DOMAttribute<State, boolean>
  className?: DOMAttribute<State, string>
  contentEditable?: DOMAttribute<State, string>
  dir?: DOMAttribute<State, string>
  disabled?: DOMAttribute<State, boolean>
  draggable?: DOMAttribute<State, boolean>
  formAction?: DOMAttribute<State, string>
  formEnctype?: DOMAttribute<State, string>
  formMethod?: DOMAttribute<State, string>
  formNoValidate?: DOMAttribute<State, boolean>
  formTarget?: DOMAttribute<State, string>
  hidden?: DOMAttribute<State, boolean>
  id?: DOMAttribute<State, string>
  inputMode?: DOMAttribute<State, string>
  lang?: DOMAttribute<State, string>
  name?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  spellcheck?: DOMAttribute<State, boolean>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  title?: DOMAttribute<State, string>
  translate?: DOMAttribute<State, boolean>
  type?: DOMAttribute<State, string>
  value?: DOMAttribute<State, string>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module html {
  export function button<State, Action>(
    attributes: HTMLButtonElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, HTMLButtonElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLButtonElement> {
    return el<State, Action, HTMLButtonElement>('button', attributes as never, ...children)
  }
}

export interface HTMLSourceElementAttributes<State, Action> {
  accessKey?: DOMAttribute<State, string>
  autocapitalize?: DOMAttribute<State, string>
  className?: DOMAttribute<State, string>
  contentEditable?: DOMAttribute<State, string>
  dir?: DOMAttribute<State, string>
  draggable?: DOMAttribute<State, boolean>
  hidden?: DOMAttribute<State, boolean>
  id?: DOMAttribute<State, string>
  inputMode?: DOMAttribute<State, string>
  lang?: DOMAttribute<State, string>
  media?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  scrollTop?: DOMAttribute<State, number>
  sizes?: DOMAttribute<State, string>
  slot?: DOMAttribute<State, string>
  spellcheck?: DOMAttribute<State, boolean>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  src?: DOMAttribute<State, string>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  title?: DOMAttribute<State, string>
  translate?: DOMAttribute<State, boolean>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  srcset?: DOMAttribute<State, string>
  onemptied?: DOMEventHandler<State, Event, Action>
  type?: DOMAttribute<State, string>
  ondragexit?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module html {
  export function source<State, Action>(
    attributes: HTMLSourceElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, HTMLSourceElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLSourceElement> {
    return el<State, Action, HTMLSourceElement>('source', attributes as never, ...children)
  }
}

export interface HTMLHtmlElementAttributes<State, Action> {
  accessKey?: DOMAttribute<State, string>
  autocapitalize?: DOMAttribute<State, string>
  className?: DOMAttribute<State, string>
  contentEditable?: DOMAttribute<State, string>
  dir?: DOMAttribute<State, string>
  draggable?: DOMAttribute<State, boolean>
  hidden?: DOMAttribute<State, boolean>
  id?: DOMAttribute<State, string>
  inputMode?: DOMAttribute<State, string>
  lang?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  spellcheck?: DOMAttribute<State, boolean>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  title?: DOMAttribute<State, string>
  translate?: DOMAttribute<State, boolean>
  ondragover?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module html {
  export function html<State, Action>(
    attributes: HTMLHtmlElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, HTMLHtmlElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLHtmlElement> {
    return el<State, Action, HTMLHtmlElement>('html', attributes as never, ...children)
  }
}

export interface HTMLQuoteElementAttributes<State, Action> {
  accessKey?: DOMAttribute<State, string>
  autocapitalize?: DOMAttribute<State, string>
  cite?: DOMAttribute<State, string>
  className?: DOMAttribute<State, string>
  contentEditable?: DOMAttribute<State, string>
  dir?: DOMAttribute<State, string>
  draggable?: DOMAttribute<State, boolean>
  hidden?: DOMAttribute<State, boolean>
  id?: DOMAttribute<State, string>
  inputMode?: DOMAttribute<State, string>
  lang?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  scrollLeft?: DOMAttribute<State, number>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  spellcheck?: DOMAttribute<State, boolean>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  title?: DOMAttribute<State, string>
  translate?: DOMAttribute<State, boolean>
  ondragover?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module html {
  export function blockquote<State, Action>(
    attributes: HTMLQuoteElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, HTMLQuoteElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLQuoteElement> {
    return el<State, Action, HTMLQuoteElement>('blockquote', attributes as never, ...children)
  }
}

export module html {
  export function q<State, Action>(
    attributes: HTMLQuoteElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, HTMLQuoteElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLQuoteElement> {
    return el<State, Action, HTMLQuoteElement>('q', attributes as never, ...children)
  }
}

export interface SVGDefsElementAttributes<State, Action> {
  className?: DOMAttribute<State, string>
  id?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module svg {
  export function defs<State, Action>(
    attributes: SVGDefsElementAttributes<State, Action> & CSSAttributes<State> & MoodAttributes<State, SVGDefsElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, SVGDefsElement> {
    return elNS<State, Action, SVGDefsElement>('svg', 'defs', attributes as never, ...children)
  }
}

export interface HTMLDListElementAttributes<State, Action> {
  accessKey?: DOMAttribute<State, string>
  autocapitalize?: DOMAttribute<State, string>
  className?: DOMAttribute<State, string>
  contentEditable?: DOMAttribute<State, string>
  dir?: DOMAttribute<State, string>
  draggable?: DOMAttribute<State, boolean>
  hidden?: DOMAttribute<State, boolean>
  id?: DOMAttribute<State, string>
  inputMode?: DOMAttribute<State, string>
  lang?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  spellcheck?: DOMAttribute<State, boolean>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  title?: DOMAttribute<State, string>
  translate?: DOMAttribute<State, boolean>
  ondragover?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module html {
  export function dl<State, Action>(
    attributes: HTMLDListElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, HTMLDListElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLDListElement> {
    return el<State, Action, HTMLDListElement>('dl', attributes as never, ...children)
  }
}

export interface SVGAElementAttributes<State, Action> {
  className?: DOMAttribute<State, string>
  id?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module svg {
  export function a<State, Action>(
    attributes: SVGAElementAttributes<State, Action> & CSSAttributes<State> & MoodAttributes<State, SVGAElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, SVGAElement> {
    return elNS<State, Action, SVGAElement>('svg', 'a', attributes as never, ...children)
  }
}

export interface HTMLFrameSetElementAttributes<State, Action> {
  accessKey?: DOMAttribute<State, string>
  autocapitalize?: DOMAttribute<State, string>
  className?: DOMAttribute<State, string>
  contentEditable?: DOMAttribute<State, string>
  dir?: DOMAttribute<State, string>
  draggable?: DOMAttribute<State, boolean>
  hidden?: DOMAttribute<State, boolean>
  id?: DOMAttribute<State, string>
  inputMode?: DOMAttribute<State, string>
  lang?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  slot?: DOMAttribute<State, string>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  title?: DOMAttribute<State, string>
  translate?: DOMAttribute<State, boolean>
  onafterprint?: DOMEventHandler<State, Event, Action>
  spellcheck?: DOMAttribute<State, boolean>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onbeforeprint?: DOMEventHandler<State, Event, Action>
  onbeforeunload?: DOMEventHandler<State, BeforeUnloadEvent, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  onhashchange?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onlanguagechange?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmessage?: DOMEventHandler<State, Event, Action>
  onmessageerror?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onoffline?: DOMEventHandler<State, Event, Action>
  ononline?: DOMEventHandler<State, Event, Action>
  onpagehide?: DOMEventHandler<State, Event, Action>
  onpageshow?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onstorage?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onunhandledrejection?: DOMEventHandler<State, Event, Action>
  onunload?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module html {
  export function frameset<State, Action>(
    attributes: HTMLFrameSetElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, HTMLFrameSetElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLFrameSetElement> {
    return el<State, Action, HTMLFrameSetElement>('frameset', attributes as never, ...children)
  }
}

export interface SVGSVGElementAttributes<State, Action> {
  className?: DOMAttribute<State, string>
  currentScale?: DOMAttribute<State, number>
  id?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  zoomAndPan?: DOMAttribute<State, number>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onunload?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
  onzoom?: DOMEventHandler<State, Event, Action>
}

export module svg {
  export function svg<State, Action>(
    attributes: SVGSVGElementAttributes<State, Action> & CSSAttributes<State> & MoodAttributes<State, SVGSVGElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, SVGSVGElement> {
    return elNS<State, Action, SVGSVGElement>('svg', 'svg', attributes as never, ...children)
  }
}

export interface HTMLLabelElementAttributes<State, Action> {
  accessKey?: DOMAttribute<State, string>
  autocapitalize?: DOMAttribute<State, string>
  className?: DOMAttribute<State, string>
  contentEditable?: DOMAttribute<State, string>
  dir?: DOMAttribute<State, string>
  draggable?: DOMAttribute<State, boolean>
  hidden?: DOMAttribute<State, boolean>
  htmlFor?: DOMAttribute<State, string>
  id?: DOMAttribute<State, string>
  inputMode?: DOMAttribute<State, string>
  lang?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  spellcheck?: DOMAttribute<State, boolean>
  tabIndex?: DOMAttribute<State, number>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  style?: DOMAttribute<State, CSSProperties>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  title?: DOMAttribute<State, string>
  translate?: DOMAttribute<State, boolean>
  ondragover?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module html {
  export function label<State, Action>(
    attributes: HTMLLabelElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, HTMLLabelElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLLabelElement> {
    return el<State, Action, HTMLLabelElement>('label', attributes as never, ...children)
  }
}

export interface HTMLDirectoryElementAttributes<State, Action> {
  accessKey?: DOMAttribute<State, string>
  autocapitalize?: DOMAttribute<State, string>
  className?: DOMAttribute<State, string>
  contentEditable?: DOMAttribute<State, string>
  dir?: DOMAttribute<State, string>
  draggable?: DOMAttribute<State, boolean>
  hidden?: DOMAttribute<State, boolean>
  id?: DOMAttribute<State, string>
  inputMode?: DOMAttribute<State, string>
  lang?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  spellcheck?: DOMAttribute<State, boolean>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  title?: DOMAttribute<State, string>
  translate?: DOMAttribute<State, boolean>
  ondragover?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module html {
  export function dir<State, Action>(
    attributes: HTMLDirectoryElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, HTMLDirectoryElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLDirectoryElement> {
    return el<State, Action, HTMLDirectoryElement>('dir', attributes as never, ...children)
  }
}

export interface HTMLLegendElementAttributes<State, Action> {
  accessKey?: DOMAttribute<State, string>
  autocapitalize?: DOMAttribute<State, string>
  className?: DOMAttribute<State, string>
  contentEditable?: DOMAttribute<State, string>
  dir?: DOMAttribute<State, string>
  draggable?: DOMAttribute<State, boolean>
  hidden?: DOMAttribute<State, boolean>
  id?: DOMAttribute<State, string>
  inputMode?: DOMAttribute<State, string>
  lang?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  spellcheck?: DOMAttribute<State, boolean>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  title?: DOMAttribute<State, string>
  translate?: DOMAttribute<State, boolean>
  ondragover?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module html {
  export function legend<State, Action>(
    attributes: HTMLLegendElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, HTMLLegendElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLLegendElement> {
    return el<State, Action, HTMLLegendElement>('legend', attributes as never, ...children)
  }
}

export interface SVGTSpanElementAttributes<State, Action> {
  className?: DOMAttribute<State, string>
  id?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module svg {
  export function tspan<State, Action>(
    attributes: SVGTSpanElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, SVGTSpanElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, SVGTSpanElement> {
    return elNS<State, Action, SVGTSpanElement>('svg', 'tspan', attributes as never, ...children)
  }
}

export interface HTMLLIElementAttributes<State, Action> {
  accessKey?: DOMAttribute<State, string>
  autocapitalize?: DOMAttribute<State, string>
  className?: DOMAttribute<State, string>
  contentEditable?: DOMAttribute<State, string>
  dir?: DOMAttribute<State, string>
  draggable?: DOMAttribute<State, boolean>
  hidden?: DOMAttribute<State, boolean>
  id?: DOMAttribute<State, string>
  inputMode?: DOMAttribute<State, string>
  lang?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  spellcheck?: DOMAttribute<State, boolean>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  title?: DOMAttribute<State, string>
  translate?: DOMAttribute<State, boolean>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  value?: DOMAttribute<State, number>
  ondragover?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module html {
  export function li<State, Action>(
    attributes: HTMLLIElementAttributes<State, Action> & CSSAttributes<State> & MoodAttributes<State, HTMLLIElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLLIElement> {
    return el<State, Action, HTMLLIElement>('li', attributes as never, ...children)
  }
}

export interface SVGFEImageElementAttributes<State, Action> {
  className?: DOMAttribute<State, string>
  id?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module svg {
  export function feImage<State, Action>(
    attributes: SVGFEImageElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, SVGFEImageElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, SVGFEImageElement> {
    return elNS<State, Action, SVGFEImageElement>('svg', 'feImage', attributes as never, ...children)
  }
}

export interface SVGStyleElementAttributes<State, Action> {
  className?: DOMAttribute<State, string>
  disabled?: DOMAttribute<State, boolean>
  id?: DOMAttribute<State, string>
  media?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  title?: DOMAttribute<State, string>
  type?: DOMAttribute<State, string>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module svg {
  export function style<State, Action>(
    attributes: SVGStyleElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, SVGStyleElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, SVGStyleElement> {
    return elNS<State, Action, SVGStyleElement>('svg', 'style', attributes as never, ...children)
  }
}

export interface SVGRadialGradientElementAttributes<State, Action> {
  className?: DOMAttribute<State, string>
  id?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module svg {
  export function radialGradient<State, Action>(
    attributes: SVGRadialGradientElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, SVGRadialGradientElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, SVGRadialGradientElement> {
    return elNS<State, Action, SVGRadialGradientElement>('svg', 'radialGradient', attributes as never, ...children)
  }
}

export interface HTMLTableSectionElementAttributes<State, Action> {
  accessKey?: DOMAttribute<State, string>
  autocapitalize?: DOMAttribute<State, string>
  className?: DOMAttribute<State, string>
  contentEditable?: DOMAttribute<State, string>
  dir?: DOMAttribute<State, string>
  draggable?: DOMAttribute<State, boolean>
  hidden?: DOMAttribute<State, boolean>
  id?: DOMAttribute<State, string>
  inputMode?: DOMAttribute<State, string>
  lang?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  spellcheck?: DOMAttribute<State, boolean>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  title?: DOMAttribute<State, string>
  translate?: DOMAttribute<State, boolean>
  ondragover?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module html {
  export function tbody<State, Action>(
    attributes: HTMLTableSectionElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, HTMLTableSectionElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLTableSectionElement> {
    return el<State, Action, HTMLTableSectionElement>('tbody', attributes as never, ...children)
  }
}

export module html {
  export function tfoot<State, Action>(
    attributes: HTMLTableSectionElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, HTMLTableSectionElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLTableSectionElement> {
    return el<State, Action, HTMLTableSectionElement>('tfoot', attributes as never, ...children)
  }
}

export module html {
  export function thead<State, Action>(
    attributes: HTMLTableSectionElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, HTMLTableSectionElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLTableSectionElement> {
    return el<State, Action, HTMLTableSectionElement>('thead', attributes as never, ...children)
  }
}

export interface HTMLInputElementAttributes<State, Action> {
  accept?: DOMAttribute<State, string>
  accessKey?: DOMAttribute<State, string>
  alt?: DOMAttribute<State, string>
  autocapitalize?: DOMAttribute<State, string>
  autocomplete?: DOMAttribute<State, string>
  autofocus?: DOMAttribute<State, boolean>
  checked?: DOMAttribute<State, boolean>
  className?: DOMAttribute<State, string>
  contentEditable?: DOMAttribute<State, string>
  defaultChecked?: DOMAttribute<State, boolean>
  defaultValue?: DOMAttribute<State, string>
  dir?: DOMAttribute<State, string>
  dirName?: DOMAttribute<State, string>
  disabled?: DOMAttribute<State, boolean>
  draggable?: DOMAttribute<State, boolean>
  files?: DOMAttribute<State, FileList | null>
  formAction?: DOMAttribute<State, string>
  formEnctype?: DOMAttribute<State, string>
  formMethod?: DOMAttribute<State, string>
  formNoValidate?: DOMAttribute<State, boolean>
  formTarget?: DOMAttribute<State, string>
  height?: DOMAttribute<State, number>
  hidden?: DOMAttribute<State, boolean>
  id?: DOMAttribute<State, string>
  indeterminate?: DOMAttribute<State, boolean>
  inputMode?: DOMAttribute<State, string>
  lang?: DOMAttribute<State, string>
  max?: DOMAttribute<State, string>
  maxLength?: DOMAttribute<State, number>
  min?: DOMAttribute<State, string>
  minLength?: DOMAttribute<State, number>
  multiple?: DOMAttribute<State, boolean>
  name?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  pattern?: DOMAttribute<State, string>
  placeholder?: DOMAttribute<State, string>
  readOnly?: DOMAttribute<State, boolean>
  required?: DOMAttribute<State, boolean>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  selectionDirection?: DOMAttribute<State, string>
  selectionEnd?: DOMAttribute<State, number>
  selectionStart?: DOMAttribute<State, number>
  size?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  src?: DOMAttribute<State, string>
  step?: DOMAttribute<State, string>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  title?: DOMAttribute<State, string>
  translate?: DOMAttribute<State, boolean>
  type?: DOMAttribute<State, string>
  value?: DOMAttribute<State, string>
  valueAsDate?: DOMAttribute<State, Date | null>
  valueAsNumber?: DOMAttribute<State, number>
  width?: DOMAttribute<State, number>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  spellcheck?: DOMAttribute<State, boolean>
  onemptied?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module html {
  export function input<State, Action>(
    attributes: HTMLInputElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, HTMLInputElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLInputElement> {
    return el<State, Action, HTMLInputElement>('input', attributes as never, ...children)
  }
}

export interface HTMLAnchorElementAttributes<State, Action> {
  accessKey?: DOMAttribute<State, string>
  autocapitalize?: DOMAttribute<State, string>
  className?: DOMAttribute<State, string>
  contentEditable?: DOMAttribute<State, string>
  dir?: DOMAttribute<State, string>
  download?: DOMAttribute<State, string>
  draggable?: DOMAttribute<State, boolean>
  hash?: DOMAttribute<State, string>
  hidden?: DOMAttribute<State, boolean>
  host?: DOMAttribute<State, string>
  hostname?: DOMAttribute<State, string>
  href?: DOMAttribute<State, string>
  hreflang?: DOMAttribute<State, string>
  id?: DOMAttribute<State, string>
  inputMode?: DOMAttribute<State, string>
  lang?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  pathname?: DOMAttribute<State, string>
  port?: DOMAttribute<State, string>
  protocol?: DOMAttribute<State, string>
  referrerPolicy?: DOMAttribute<State, string>
  rel?: DOMAttribute<State, string>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  password?: DOMAttribute<State, string>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  ping?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  search?: DOMAttribute<State, string>
  slot?: DOMAttribute<State, string>
  spellcheck?: DOMAttribute<State, boolean>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  target?: DOMAttribute<State, string>
  text?: DOMAttribute<State, string>
  title?: DOMAttribute<State, string>
  translate?: DOMAttribute<State, boolean>
  type?: DOMAttribute<State, string>
  username?: DOMAttribute<State, string>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module html {
  export function a<State, Action>(
    attributes: HTMLAnchorElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, HTMLAnchorElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLAnchorElement> {
    return el<State, Action, HTMLAnchorElement>('a', attributes as never, ...children)
  }
}

export interface HTMLParamElementAttributes<State, Action> {
  accessKey?: DOMAttribute<State, string>
  autocapitalize?: DOMAttribute<State, string>
  className?: DOMAttribute<State, string>
  contentEditable?: DOMAttribute<State, string>
  dir?: DOMAttribute<State, string>
  draggable?: DOMAttribute<State, boolean>
  hidden?: DOMAttribute<State, boolean>
  id?: DOMAttribute<State, string>
  inputMode?: DOMAttribute<State, string>
  lang?: DOMAttribute<State, string>
  name?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  spellcheck?: DOMAttribute<State, boolean>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  translate?: DOMAttribute<State, boolean>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  title?: DOMAttribute<State, string>
  value?: DOMAttribute<State, string>
  ondragleave?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module html {
  export function param<State, Action>(
    attributes: HTMLParamElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, HTMLParamElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLParamElement> {
    return el<State, Action, HTMLParamElement>('param', attributes as never, ...children)
  }
}

export interface HTMLPreElementAttributes<State, Action> {
  accessKey?: DOMAttribute<State, string>
  autocapitalize?: DOMAttribute<State, string>
  className?: DOMAttribute<State, string>
  contentEditable?: DOMAttribute<State, string>
  dir?: DOMAttribute<State, string>
  draggable?: DOMAttribute<State, boolean>
  hidden?: DOMAttribute<State, boolean>
  id?: DOMAttribute<State, string>
  inputMode?: DOMAttribute<State, string>
  lang?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  spellcheck?: DOMAttribute<State, boolean>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  title?: DOMAttribute<State, string>
  translate?: DOMAttribute<State, boolean>
  ondragover?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module html {
  export function pre<State, Action>(
    attributes: HTMLPreElementAttributes<State, Action> & CSSAttributes<State> & MoodAttributes<State, HTMLPreElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLPreElement> {
    return el<State, Action, HTMLPreElement>('pre', attributes as never, ...children)
  }
}

export module html {
  export function listing<State, Action>(
    attributes: HTMLPreElementAttributes<State, Action> & CSSAttributes<State> & MoodAttributes<State, HTMLPreElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLPreElement> {
    return el<State, Action, HTMLPreElement>('listing', attributes as never, ...children)
  }
}

export module html {
  export function xmp<State, Action>(
    attributes: HTMLPreElementAttributes<State, Action> & CSSAttributes<State> & MoodAttributes<State, HTMLPreElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLPreElement> {
    return el<State, Action, HTMLPreElement>('xmp', attributes as never, ...children)
  }
}

export interface SVGMetadataElementAttributes<State, Action> {
  className?: DOMAttribute<State, string>
  id?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module svg {
  export function metadata<State, Action>(
    attributes: SVGMetadataElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, SVGMetadataElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, SVGMetadataElement> {
    return elNS<State, Action, SVGMetadataElement>('svg', 'metadata', attributes as never, ...children)
  }
}

export interface SVGPolygonElementAttributes<State, Action> {
  className?: DOMAttribute<State, string>
  id?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module svg {
  export function polygon<State, Action>(
    attributes: SVGPolygonElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, SVGPolygonElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, SVGPolygonElement> {
    return elNS<State, Action, SVGPolygonElement>('svg', 'polygon', attributes as never, ...children)
  }
}

export interface SVGFEGaussianBlurElementAttributes<State, Action> {
  className?: DOMAttribute<State, string>
  id?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module svg {
  export function feGaussianBlur<State, Action>(
    attributes: SVGFEGaussianBlurElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, SVGFEGaussianBlurElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, SVGFEGaussianBlurElement> {
    return elNS<State, Action, SVGFEGaussianBlurElement>('svg', 'feGaussianBlur', attributes as never, ...children)
  }
}

export interface SVGPathElementAttributes<State, Action> {
  className?: DOMAttribute<State, string>
  id?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module svg {
  export function path<State, Action>(
    attributes: SVGPathElementAttributes<State, Action> & CSSAttributes<State> & MoodAttributes<State, SVGPathElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, SVGPathElement> {
    return elNS<State, Action, SVGPathElement>('svg', 'path', attributes as never, ...children)
  }
}

export interface HTMLAudioElementAttributes<State, Action> {
  accessKey?: DOMAttribute<State, string>
  autocapitalize?: DOMAttribute<State, string>
  autoplay?: DOMAttribute<State, boolean>
  className?: DOMAttribute<State, string>
  contentEditable?: DOMAttribute<State, string>
  controls?: DOMAttribute<State, boolean>
  crossOrigin?: DOMAttribute<State, string>
  currentTime?: DOMAttribute<State, number>
  defaultMuted?: DOMAttribute<State, boolean>
  defaultPlaybackRate?: DOMAttribute<State, number>
  dir?: DOMAttribute<State, string>
  draggable?: DOMAttribute<State, boolean>
  hidden?: DOMAttribute<State, boolean>
  id?: DOMAttribute<State, string>
  inputMode?: DOMAttribute<State, string>
  lang?: DOMAttribute<State, string>
  loop?: DOMAttribute<State, boolean>
  msAudioCategory?: DOMAttribute<State, string>
  msAudioDeviceType?: DOMAttribute<State, string>
  msPlayToDisabled?: DOMAttribute<State, boolean>
  msPlayToPreferredSourceUri?: DOMAttribute<State, string>
  msPlayToPrimary?: DOMAttribute<State, boolean>
  msRealTime?: DOMAttribute<State, boolean>
  muted?: DOMAttribute<State, boolean>
  nonce?: DOMAttribute<State, string>
  playbackRate?: DOMAttribute<State, number>
  preload?: DOMAttribute<State, string>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  spellcheck?: DOMAttribute<State, boolean>
  src?: DOMAttribute<State, string>
  srcObject?: DOMAttribute<State, MediaStream | MediaSource | Blob>
  style?: DOMAttribute<State, CSSProperties>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  tabIndex?: DOMAttribute<State, number>
  title?: DOMAttribute<State, string>
  translate?: DOMAttribute<State, boolean>
  volume?: DOMAttribute<State, number>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  scrollLeft?: DOMAttribute<State, number>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onencrypted?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwaitingforkey?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module html {
  export function audio<State, Action>(
    attributes: HTMLAudioElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, HTMLAudioElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLAudioElement> {
    return el<State, Action, HTMLAudioElement>('audio', attributes as never, ...children)
  }
}

export interface SVGCircleElementAttributes<State, Action> {
  className?: DOMAttribute<State, string>
  id?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module svg {
  export function circle<State, Action>(
    attributes: SVGCircleElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, SVGCircleElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, SVGCircleElement> {
    return elNS<State, Action, SVGCircleElement>('svg', 'circle', attributes as never, ...children)
  }
}

export interface HTMLBaseFontElementAttributes<State, Action> {
  accessKey?: DOMAttribute<State, string>
  autocapitalize?: DOMAttribute<State, string>
  className?: DOMAttribute<State, string>
  color?: DOMAttribute<State, string>
  contentEditable?: DOMAttribute<State, string>
  dir?: DOMAttribute<State, string>
  draggable?: DOMAttribute<State, boolean>
  hidden?: DOMAttribute<State, boolean>
  id?: DOMAttribute<State, string>
  inputMode?: DOMAttribute<State, string>
  lang?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  scrollLeft?: DOMAttribute<State, number>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  spellcheck?: DOMAttribute<State, boolean>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  title?: DOMAttribute<State, string>
  translate?: DOMAttribute<State, boolean>
  ondragover?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module html {
  export function basefont<State, Action>(
    attributes: HTMLBaseFontElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, HTMLBaseFontElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLBaseFontElement> {
    return el<State, Action, HTMLBaseFontElement>('basefont', attributes as never, ...children)
  }
}

export interface HTMLMarqueeElementAttributes<State, Action> {
  accessKey?: DOMAttribute<State, string>
  autocapitalize?: DOMAttribute<State, string>
  className?: DOMAttribute<State, string>
  contentEditable?: DOMAttribute<State, string>
  dir?: DOMAttribute<State, string>
  draggable?: DOMAttribute<State, boolean>
  hidden?: DOMAttribute<State, boolean>
  id?: DOMAttribute<State, string>
  inputMode?: DOMAttribute<State, string>
  lang?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  spellcheck?: DOMAttribute<State, boolean>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  title?: DOMAttribute<State, string>
  translate?: DOMAttribute<State, boolean>
  ondragover?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module html {
  export function marquee<State, Action>(
    attributes: HTMLMarqueeElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, HTMLMarqueeElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLMarqueeElement> {
    return el<State, Action, HTMLMarqueeElement>('marquee', attributes as never, ...children)
  }
}

export interface SVGFEFuncRElementAttributes<State, Action> {
  className?: DOMAttribute<State, string>
  id?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module svg {
  export function feFuncR<State, Action>(
    attributes: SVGFEFuncRElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, SVGFEFuncRElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, SVGFEFuncRElement> {
    return elNS<State, Action, SVGFEFuncRElement>('svg', 'feFuncR', attributes as never, ...children)
  }
}

export interface SVGFEDisplacementMapElementAttributes<State, Action> {
  className?: DOMAttribute<State, string>
  id?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module svg {
  export function feDisplacementMap<State, Action>(
    attributes: SVGFEDisplacementMapElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, SVGFEDisplacementMapElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, SVGFEDisplacementMapElement> {
    return elNS<State, Action, SVGFEDisplacementMapElement>(
      'svg',
      'feDisplacementMap',
      attributes as never,
      ...children
    )
  }
}

export interface SVGLinearGradientElementAttributes<State, Action> {
  className?: DOMAttribute<State, string>
  id?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module svg {
  export function linearGradient<State, Action>(
    attributes: SVGLinearGradientElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, SVGLinearGradientElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, SVGLinearGradientElement> {
    return elNS<State, Action, SVGLinearGradientElement>('svg', 'linearGradient', attributes as never, ...children)
  }
}

export interface SVGRectElementAttributes<State, Action> {
  className?: DOMAttribute<State, string>
  id?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module svg {
  export function rect<State, Action>(
    attributes: SVGRectElementAttributes<State, Action> & CSSAttributes<State> & MoodAttributes<State, SVGRectElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, SVGRectElement> {
    return elNS<State, Action, SVGRectElement>('svg', 'rect', attributes as never, ...children)
  }
}

export interface SVGPolylineElementAttributes<State, Action> {
  className?: DOMAttribute<State, string>
  id?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module svg {
  export function polyline<State, Action>(
    attributes: SVGPolylineElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, SVGPolylineElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, SVGPolylineElement> {
    return elNS<State, Action, SVGPolylineElement>('svg', 'polyline', attributes as never, ...children)
  }
}

export interface HTMLSpanElementAttributes<State, Action> {
  accessKey?: DOMAttribute<State, string>
  autocapitalize?: DOMAttribute<State, string>
  className?: DOMAttribute<State, string>
  contentEditable?: DOMAttribute<State, string>
  dir?: DOMAttribute<State, string>
  draggable?: DOMAttribute<State, boolean>
  hidden?: DOMAttribute<State, boolean>
  id?: DOMAttribute<State, string>
  inputMode?: DOMAttribute<State, string>
  lang?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  spellcheck?: DOMAttribute<State, boolean>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  title?: DOMAttribute<State, string>
  translate?: DOMAttribute<State, boolean>
  ondragover?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module html {
  export function span<State, Action>(
    attributes: HTMLSpanElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, HTMLSpanElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLSpanElement> {
    return el<State, Action, HTMLSpanElement>('span', attributes as never, ...children)
  }
}

export interface HTMLHeadingElementAttributes<State, Action> {
  accessKey?: DOMAttribute<State, string>
  autocapitalize?: DOMAttribute<State, string>
  className?: DOMAttribute<State, string>
  contentEditable?: DOMAttribute<State, string>
  dir?: DOMAttribute<State, string>
  draggable?: DOMAttribute<State, boolean>
  hidden?: DOMAttribute<State, boolean>
  id?: DOMAttribute<State, string>
  inputMode?: DOMAttribute<State, string>
  lang?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  spellcheck?: DOMAttribute<State, boolean>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  title?: DOMAttribute<State, string>
  translate?: DOMAttribute<State, boolean>
  ondragover?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module html {
  export function h1<State, Action>(
    attributes: HTMLHeadingElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, HTMLHeadingElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLHeadingElement> {
    return el<State, Action, HTMLHeadingElement>('h1', attributes as never, ...children)
  }
}

export module html {
  export function h2<State, Action>(
    attributes: HTMLHeadingElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, HTMLHeadingElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLHeadingElement> {
    return el<State, Action, HTMLHeadingElement>('h2', attributes as never, ...children)
  }
}

export module html {
  export function h3<State, Action>(
    attributes: HTMLHeadingElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, HTMLHeadingElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLHeadingElement> {
    return el<State, Action, HTMLHeadingElement>('h3', attributes as never, ...children)
  }
}

export module html {
  export function h4<State, Action>(
    attributes: HTMLHeadingElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, HTMLHeadingElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLHeadingElement> {
    return el<State, Action, HTMLHeadingElement>('h4', attributes as never, ...children)
  }
}

export module html {
  export function h5<State, Action>(
    attributes: HTMLHeadingElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, HTMLHeadingElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLHeadingElement> {
    return el<State, Action, HTMLHeadingElement>('h5', attributes as never, ...children)
  }
}

export module html {
  export function h6<State, Action>(
    attributes: HTMLHeadingElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, HTMLHeadingElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLHeadingElement> {
    return el<State, Action, HTMLHeadingElement>('h6', attributes as never, ...children)
  }
}

export interface SVGFEOffsetElementAttributes<State, Action> {
  className?: DOMAttribute<State, string>
  id?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module svg {
  export function feOffset<State, Action>(
    attributes: SVGFEOffsetElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, SVGFEOffsetElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, SVGFEOffsetElement> {
    return elNS<State, Action, SVGFEOffsetElement>('svg', 'feOffset', attributes as never, ...children)
  }
}

export interface HTMLFormElementAttributes<State, Action> {
  acceptCharset?: DOMAttribute<State, string>
  accessKey?: DOMAttribute<State, string>
  action?: DOMAttribute<State, string>
  autocapitalize?: DOMAttribute<State, string>
  autocomplete?: DOMAttribute<State, string>
  className?: DOMAttribute<State, string>
  contentEditable?: DOMAttribute<State, string>
  dir?: DOMAttribute<State, string>
  draggable?: DOMAttribute<State, boolean>
  encoding?: DOMAttribute<State, string>
  enctype?: DOMAttribute<State, string>
  hidden?: DOMAttribute<State, boolean>
  id?: DOMAttribute<State, string>
  inputMode?: DOMAttribute<State, string>
  lang?: DOMAttribute<State, string>
  method?: DOMAttribute<State, string>
  name?: DOMAttribute<State, string>
  noValidate?: DOMAttribute<State, boolean>
  nonce?: DOMAttribute<State, string>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  spellcheck?: DOMAttribute<State, boolean>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  target?: DOMAttribute<State, string>
  title?: DOMAttribute<State, string>
  translate?: DOMAttribute<State, boolean>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module html {
  export function form<State, Action>(
    attributes: HTMLFormElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, HTMLFormElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLFormElement> {
    return el<State, Action, HTMLFormElement>('form', attributes as never, ...children)
  }
}

export interface HTMLFieldSetElementAttributes<State, Action> {
  accessKey?: DOMAttribute<State, string>
  autocapitalize?: DOMAttribute<State, string>
  className?: DOMAttribute<State, string>
  contentEditable?: DOMAttribute<State, string>
  dir?: DOMAttribute<State, string>
  disabled?: DOMAttribute<State, boolean>
  draggable?: DOMAttribute<State, boolean>
  hidden?: DOMAttribute<State, boolean>
  id?: DOMAttribute<State, string>
  inputMode?: DOMAttribute<State, string>
  lang?: DOMAttribute<State, string>
  name?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  spellcheck?: DOMAttribute<State, boolean>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  title?: DOMAttribute<State, string>
  translate?: DOMAttribute<State, boolean>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module html {
  export function fieldset<State, Action>(
    attributes: HTMLFieldSetElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, HTMLFieldSetElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLFieldSetElement> {
    return el<State, Action, HTMLFieldSetElement>('fieldset', attributes as never, ...children)
  }
}

export interface HTMLElementAttributes<State, Action> {
  accessKey?: DOMAttribute<State, string>
  autocapitalize?: DOMAttribute<State, string>
  className?: DOMAttribute<State, string>
  contentEditable?: DOMAttribute<State, string>
  dir?: DOMAttribute<State, string>
  draggable?: DOMAttribute<State, boolean>
  hidden?: DOMAttribute<State, boolean>
  id?: DOMAttribute<State, string>
  inputMode?: DOMAttribute<State, string>
  lang?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  spellcheck?: DOMAttribute<State, boolean>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  title?: DOMAttribute<State, string>
  translate?: DOMAttribute<State, boolean>
  ondragover?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module html {
  export function abbr<State, Action>(
    attributes: HTMLElementAttributes<State, Action> & CSSAttributes<State> & MoodAttributes<State, HTMLElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLElement> {
    return el<State, Action, HTMLElement>('abbr', attributes as never, ...children)
  }
}

export module html {
  export function address<State, Action>(
    attributes: HTMLElementAttributes<State, Action> & CSSAttributes<State> & MoodAttributes<State, HTMLElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLElement> {
    return el<State, Action, HTMLElement>('address', attributes as never, ...children)
  }
}

export module html {
  export function article<State, Action>(
    attributes: HTMLElementAttributes<State, Action> & CSSAttributes<State> & MoodAttributes<State, HTMLElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLElement> {
    return el<State, Action, HTMLElement>('article', attributes as never, ...children)
  }
}

export module html {
  export function aside<State, Action>(
    attributes: HTMLElementAttributes<State, Action> & CSSAttributes<State> & MoodAttributes<State, HTMLElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLElement> {
    return el<State, Action, HTMLElement>('aside', attributes as never, ...children)
  }
}

export module html {
  export function b<State, Action>(
    attributes: HTMLElementAttributes<State, Action> & CSSAttributes<State> & MoodAttributes<State, HTMLElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLElement> {
    return el<State, Action, HTMLElement>('b', attributes as never, ...children)
  }
}

export module html {
  export function bdi<State, Action>(
    attributes: HTMLElementAttributes<State, Action> & CSSAttributes<State> & MoodAttributes<State, HTMLElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLElement> {
    return el<State, Action, HTMLElement>('bdi', attributes as never, ...children)
  }
}

export module html {
  export function bdo<State, Action>(
    attributes: HTMLElementAttributes<State, Action> & CSSAttributes<State> & MoodAttributes<State, HTMLElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLElement> {
    return el<State, Action, HTMLElement>('bdo', attributes as never, ...children)
  }
}

export module html {
  export function cite<State, Action>(
    attributes: HTMLElementAttributes<State, Action> & CSSAttributes<State> & MoodAttributes<State, HTMLElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLElement> {
    return el<State, Action, HTMLElement>('cite', attributes as never, ...children)
  }
}

export module html {
  export function code<State, Action>(
    attributes: HTMLElementAttributes<State, Action> & CSSAttributes<State> & MoodAttributes<State, HTMLElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLElement> {
    return el<State, Action, HTMLElement>('code', attributes as never, ...children)
  }
}

export module html {
  export function dd<State, Action>(
    attributes: HTMLElementAttributes<State, Action> & CSSAttributes<State> & MoodAttributes<State, HTMLElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLElement> {
    return el<State, Action, HTMLElement>('dd', attributes as never, ...children)
  }
}

export module html {
  export function dfn<State, Action>(
    attributes: HTMLElementAttributes<State, Action> & CSSAttributes<State> & MoodAttributes<State, HTMLElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLElement> {
    return el<State, Action, HTMLElement>('dfn', attributes as never, ...children)
  }
}

export module html {
  export function dt<State, Action>(
    attributes: HTMLElementAttributes<State, Action> & CSSAttributes<State> & MoodAttributes<State, HTMLElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLElement> {
    return el<State, Action, HTMLElement>('dt', attributes as never, ...children)
  }
}

export module html {
  export function em<State, Action>(
    attributes: HTMLElementAttributes<State, Action> & CSSAttributes<State> & MoodAttributes<State, HTMLElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLElement> {
    return el<State, Action, HTMLElement>('em', attributes as never, ...children)
  }
}

export module html {
  export function figcaption<State, Action>(
    attributes: HTMLElementAttributes<State, Action> & CSSAttributes<State> & MoodAttributes<State, HTMLElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLElement> {
    return el<State, Action, HTMLElement>('figcaption', attributes as never, ...children)
  }
}

export module html {
  export function figure<State, Action>(
    attributes: HTMLElementAttributes<State, Action> & CSSAttributes<State> & MoodAttributes<State, HTMLElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLElement> {
    return el<State, Action, HTMLElement>('figure', attributes as never, ...children)
  }
}

export module html {
  export function footer<State, Action>(
    attributes: HTMLElementAttributes<State, Action> & CSSAttributes<State> & MoodAttributes<State, HTMLElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLElement> {
    return el<State, Action, HTMLElement>('footer', attributes as never, ...children)
  }
}

export module html {
  export function header<State, Action>(
    attributes: HTMLElementAttributes<State, Action> & CSSAttributes<State> & MoodAttributes<State, HTMLElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLElement> {
    return el<State, Action, HTMLElement>('header', attributes as never, ...children)
  }
}

export module html {
  export function hgroup<State, Action>(
    attributes: HTMLElementAttributes<State, Action> & CSSAttributes<State> & MoodAttributes<State, HTMLElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLElement> {
    return el<State, Action, HTMLElement>('hgroup', attributes as never, ...children)
  }
}

export module html {
  export function i<State, Action>(
    attributes: HTMLElementAttributes<State, Action> & CSSAttributes<State> & MoodAttributes<State, HTMLElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLElement> {
    return el<State, Action, HTMLElement>('i', attributes as never, ...children)
  }
}

export module html {
  export function kbd<State, Action>(
    attributes: HTMLElementAttributes<State, Action> & CSSAttributes<State> & MoodAttributes<State, HTMLElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLElement> {
    return el<State, Action, HTMLElement>('kbd', attributes as never, ...children)
  }
}

export module html {
  export function main<State, Action>(
    attributes: HTMLElementAttributes<State, Action> & CSSAttributes<State> & MoodAttributes<State, HTMLElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLElement> {
    return el<State, Action, HTMLElement>('main', attributes as never, ...children)
  }
}

export module html {
  export function mark<State, Action>(
    attributes: HTMLElementAttributes<State, Action> & CSSAttributes<State> & MoodAttributes<State, HTMLElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLElement> {
    return el<State, Action, HTMLElement>('mark', attributes as never, ...children)
  }
}

export module html {
  export function nav<State, Action>(
    attributes: HTMLElementAttributes<State, Action> & CSSAttributes<State> & MoodAttributes<State, HTMLElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLElement> {
    return el<State, Action, HTMLElement>('nav', attributes as never, ...children)
  }
}

export module html {
  export function noscript<State, Action>(
    attributes: HTMLElementAttributes<State, Action> & CSSAttributes<State> & MoodAttributes<State, HTMLElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLElement> {
    return el<State, Action, HTMLElement>('noscript', attributes as never, ...children)
  }
}

export module html {
  export function rp<State, Action>(
    attributes: HTMLElementAttributes<State, Action> & CSSAttributes<State> & MoodAttributes<State, HTMLElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLElement> {
    return el<State, Action, HTMLElement>('rp', attributes as never, ...children)
  }
}

export module html {
  export function rt<State, Action>(
    attributes: HTMLElementAttributes<State, Action> & CSSAttributes<State> & MoodAttributes<State, HTMLElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLElement> {
    return el<State, Action, HTMLElement>('rt', attributes as never, ...children)
  }
}

export module html {
  export function ruby<State, Action>(
    attributes: HTMLElementAttributes<State, Action> & CSSAttributes<State> & MoodAttributes<State, HTMLElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLElement> {
    return el<State, Action, HTMLElement>('ruby', attributes as never, ...children)
  }
}

export module html {
  export function s<State, Action>(
    attributes: HTMLElementAttributes<State, Action> & CSSAttributes<State> & MoodAttributes<State, HTMLElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLElement> {
    return el<State, Action, HTMLElement>('s', attributes as never, ...children)
  }
}

export module html {
  export function samp<State, Action>(
    attributes: HTMLElementAttributes<State, Action> & CSSAttributes<State> & MoodAttributes<State, HTMLElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLElement> {
    return el<State, Action, HTMLElement>('samp', attributes as never, ...children)
  }
}

export module html {
  export function section<State, Action>(
    attributes: HTMLElementAttributes<State, Action> & CSSAttributes<State> & MoodAttributes<State, HTMLElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLElement> {
    return el<State, Action, HTMLElement>('section', attributes as never, ...children)
  }
}

export module html {
  export function small<State, Action>(
    attributes: HTMLElementAttributes<State, Action> & CSSAttributes<State> & MoodAttributes<State, HTMLElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLElement> {
    return el<State, Action, HTMLElement>('small', attributes as never, ...children)
  }
}

export module html {
  export function strong<State, Action>(
    attributes: HTMLElementAttributes<State, Action> & CSSAttributes<State> & MoodAttributes<State, HTMLElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLElement> {
    return el<State, Action, HTMLElement>('strong', attributes as never, ...children)
  }
}

export module html {
  export function sub<State, Action>(
    attributes: HTMLElementAttributes<State, Action> & CSSAttributes<State> & MoodAttributes<State, HTMLElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLElement> {
    return el<State, Action, HTMLElement>('sub', attributes as never, ...children)
  }
}

export module html {
  export function summary<State, Action>(
    attributes: HTMLElementAttributes<State, Action> & CSSAttributes<State> & MoodAttributes<State, HTMLElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLElement> {
    return el<State, Action, HTMLElement>('summary', attributes as never, ...children)
  }
}

export module html {
  export function sup<State, Action>(
    attributes: HTMLElementAttributes<State, Action> & CSSAttributes<State> & MoodAttributes<State, HTMLElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLElement> {
    return el<State, Action, HTMLElement>('sup', attributes as never, ...children)
  }
}

export module html {
  export function u<State, Action>(
    attributes: HTMLElementAttributes<State, Action> & CSSAttributes<State> & MoodAttributes<State, HTMLElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLElement> {
    return el<State, Action, HTMLElement>('u', attributes as never, ...children)
  }
}

export module html {
  export function varEl<State, Action>(
    attributes: HTMLElementAttributes<State, Action> & CSSAttributes<State> & MoodAttributes<State, HTMLElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLElement> {
    return el<State, Action, HTMLElement>('var', attributes as never, ...children)
  }
}

export module html {
  export function wbr<State, Action>(
    attributes: HTMLElementAttributes<State, Action> & CSSAttributes<State> & MoodAttributes<State, HTMLElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLElement> {
    return el<State, Action, HTMLElement>('wbr', attributes as never, ...children)
  }
}

export interface HTMLHRElementAttributes<State, Action> {
  accessKey?: DOMAttribute<State, string>
  autocapitalize?: DOMAttribute<State, string>
  className?: DOMAttribute<State, string>
  contentEditable?: DOMAttribute<State, string>
  dir?: DOMAttribute<State, string>
  draggable?: DOMAttribute<State, boolean>
  hidden?: DOMAttribute<State, boolean>
  id?: DOMAttribute<State, string>
  inputMode?: DOMAttribute<State, string>
  lang?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  spellcheck?: DOMAttribute<State, boolean>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  title?: DOMAttribute<State, string>
  translate?: DOMAttribute<State, boolean>
  ondragover?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module html {
  export function hr<State, Action>(
    attributes: HTMLHRElementAttributes<State, Action> & CSSAttributes<State> & MoodAttributes<State, HTMLHRElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLHRElement> {
    return el<State, Action, HTMLHRElement>('hr', attributes as never, ...children)
  }
}

export interface HTMLOptGroupElementAttributes<State, Action> {
  accessKey?: DOMAttribute<State, string>
  autocapitalize?: DOMAttribute<State, string>
  className?: DOMAttribute<State, string>
  contentEditable?: DOMAttribute<State, string>
  dir?: DOMAttribute<State, string>
  disabled?: DOMAttribute<State, boolean>
  draggable?: DOMAttribute<State, boolean>
  hidden?: DOMAttribute<State, boolean>
  id?: DOMAttribute<State, string>
  inputMode?: DOMAttribute<State, string>
  label?: DOMAttribute<State, string>
  lang?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  spellcheck?: DOMAttribute<State, boolean>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  title?: DOMAttribute<State, string>
  translate?: DOMAttribute<State, boolean>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module html {
  export function optgroup<State, Action>(
    attributes: HTMLOptGroupElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, HTMLOptGroupElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLOptGroupElement> {
    return el<State, Action, HTMLOptGroupElement>('optgroup', attributes as never, ...children)
  }
}

export interface SVGSwitchElementAttributes<State, Action> {
  className?: DOMAttribute<State, string>
  id?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module svg {
  export function switchEl<State, Action>(
    attributes: SVGSwitchElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, SVGSwitchElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, SVGSwitchElement> {
    return elNS<State, Action, SVGSwitchElement>('svg', 'switch', attributes as never, ...children)
  }
}

export interface HTMLDataListElementAttributes<State, Action> {
  accessKey?: DOMAttribute<State, string>
  autocapitalize?: DOMAttribute<State, string>
  className?: DOMAttribute<State, string>
  contentEditable?: DOMAttribute<State, string>
  dir?: DOMAttribute<State, string>
  draggable?: DOMAttribute<State, boolean>
  hidden?: DOMAttribute<State, boolean>
  id?: DOMAttribute<State, string>
  inputMode?: DOMAttribute<State, string>
  lang?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  spellcheck?: DOMAttribute<State, boolean>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  title?: DOMAttribute<State, string>
  translate?: DOMAttribute<State, boolean>
  ondragover?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module html {
  export function datalist<State, Action>(
    attributes: HTMLDataListElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, HTMLDataListElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLDataListElement> {
    return el<State, Action, HTMLDataListElement>('datalist', attributes as never, ...children)
  }
}

export interface SVGStopElementAttributes<State, Action> {
  className?: DOMAttribute<State, string>
  id?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module svg {
  export function stop<State, Action>(
    attributes: SVGStopElementAttributes<State, Action> & CSSAttributes<State> & MoodAttributes<State, SVGStopElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, SVGStopElement> {
    return elNS<State, Action, SVGStopElement>('svg', 'stop', attributes as never, ...children)
  }
}

export interface HTMLTrackElementAttributes<State, Action> {
  accessKey?: DOMAttribute<State, string>
  autocapitalize?: DOMAttribute<State, string>
  className?: DOMAttribute<State, string>
  contentEditable?: DOMAttribute<State, string>
  default?: DOMAttribute<State, boolean>
  dir?: DOMAttribute<State, string>
  draggable?: DOMAttribute<State, boolean>
  hidden?: DOMAttribute<State, boolean>
  id?: DOMAttribute<State, string>
  inputMode?: DOMAttribute<State, string>
  kind?: DOMAttribute<State, string>
  label?: DOMAttribute<State, string>
  lang?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  spellcheck?: DOMAttribute<State, boolean>
  src?: DOMAttribute<State, string>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  srclang?: DOMAttribute<State, string>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  title?: DOMAttribute<State, string>
  translate?: DOMAttribute<State, boolean>
  ondragexit?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module html {
  export function track<State, Action>(
    attributes: HTMLTrackElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, HTMLTrackElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLTrackElement> {
    return el<State, Action, HTMLTrackElement>('track', attributes as never, ...children)
  }
}

export interface HTMLOutputElementAttributes<State, Action> {
  accessKey?: DOMAttribute<State, string>
  autocapitalize?: DOMAttribute<State, string>
  className?: DOMAttribute<State, string>
  contentEditable?: DOMAttribute<State, string>
  defaultValue?: DOMAttribute<State, string>
  dir?: DOMAttribute<State, string>
  draggable?: DOMAttribute<State, boolean>
  hidden?: DOMAttribute<State, boolean>
  id?: DOMAttribute<State, string>
  inputMode?: DOMAttribute<State, string>
  lang?: DOMAttribute<State, string>
  name?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  spellcheck?: DOMAttribute<State, boolean>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  title?: DOMAttribute<State, string>
  translate?: DOMAttribute<State, boolean>
  value?: DOMAttribute<State, string>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module html {
  export function output<State, Action>(
    attributes: HTMLOutputElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, HTMLOutputElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLOutputElement> {
    return el<State, Action, HTMLOutputElement>('output', attributes as never, ...children)
  }
}

export interface HTMLDataElementAttributes<State, Action> {
  accessKey?: DOMAttribute<State, string>
  autocapitalize?: DOMAttribute<State, string>
  className?: DOMAttribute<State, string>
  contentEditable?: DOMAttribute<State, string>
  dir?: DOMAttribute<State, string>
  draggable?: DOMAttribute<State, boolean>
  hidden?: DOMAttribute<State, boolean>
  id?: DOMAttribute<State, string>
  inputMode?: DOMAttribute<State, string>
  lang?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  spellcheck?: DOMAttribute<State, boolean>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  title?: DOMAttribute<State, string>
  translate?: DOMAttribute<State, boolean>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  value?: DOMAttribute<State, string>
  ondragover?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module html {
  export function data<State, Action>(
    attributes: HTMLDataElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, HTMLDataElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLDataElement> {
    return el<State, Action, HTMLDataElement>('data', attributes as never, ...children)
  }
}

export interface SVGMaskElementAttributes<State, Action> {
  className?: DOMAttribute<State, string>
  id?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module svg {
  export function mask<State, Action>(
    attributes: SVGMaskElementAttributes<State, Action> & CSSAttributes<State> & MoodAttributes<State, SVGMaskElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, SVGMaskElement> {
    return elNS<State, Action, SVGMaskElement>('svg', 'mask', attributes as never, ...children)
  }
}

export interface HTMLDetailsElementAttributes<State, Action> {
  accessKey?: DOMAttribute<State, string>
  autocapitalize?: DOMAttribute<State, string>
  className?: DOMAttribute<State, string>
  contentEditable?: DOMAttribute<State, string>
  dir?: DOMAttribute<State, string>
  draggable?: DOMAttribute<State, boolean>
  hidden?: DOMAttribute<State, boolean>
  id?: DOMAttribute<State, string>
  inputMode?: DOMAttribute<State, string>
  lang?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  spellcheck?: DOMAttribute<State, boolean>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  open?: DOMAttribute<State, boolean>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  title?: DOMAttribute<State, string>
  translate?: DOMAttribute<State, boolean>
  ondragover?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module html {
  export function details<State, Action>(
    attributes: HTMLDetailsElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, HTMLDetailsElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLDetailsElement> {
    return el<State, Action, HTMLDetailsElement>('details', attributes as never, ...children)
  }
}

export interface HTMLDialogElementAttributes<State, Action> {
  accessKey?: DOMAttribute<State, string>
  autocapitalize?: DOMAttribute<State, string>
  className?: DOMAttribute<State, string>
  contentEditable?: DOMAttribute<State, string>
  dir?: DOMAttribute<State, string>
  draggable?: DOMAttribute<State, boolean>
  hidden?: DOMAttribute<State, boolean>
  id?: DOMAttribute<State, string>
  inputMode?: DOMAttribute<State, string>
  lang?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  open?: DOMAttribute<State, boolean>
  ondrag?: DOMEventHandler<State, Event, Action>
  returnValue?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  spellcheck?: DOMAttribute<State, boolean>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  title?: DOMAttribute<State, string>
  translate?: DOMAttribute<State, boolean>
  ondragleave?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module html {
  export function dialog<State, Action>(
    attributes: HTMLDialogElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, HTMLDialogElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLDialogElement> {
    return el<State, Action, HTMLDialogElement>('dialog', attributes as never, ...children)
  }
}

export interface HTMLSlotElementAttributes<State, Action> {
  accessKey?: DOMAttribute<State, string>
  autocapitalize?: DOMAttribute<State, string>
  className?: DOMAttribute<State, string>
  contentEditable?: DOMAttribute<State, string>
  dir?: DOMAttribute<State, string>
  draggable?: DOMAttribute<State, boolean>
  hidden?: DOMAttribute<State, boolean>
  id?: DOMAttribute<State, string>
  inputMode?: DOMAttribute<State, string>
  lang?: DOMAttribute<State, string>
  name?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  spellcheck?: DOMAttribute<State, boolean>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragexit?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  title?: DOMAttribute<State, string>
  translate?: DOMAttribute<State, boolean>
  ondragover?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module html {
  export function slot<State, Action>(
    attributes: HTMLSlotElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, HTMLSlotElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLSlotElement> {
    return el<State, Action, HTMLSlotElement>('slot', attributes as never, ...children)
  }
}

export interface HTMLTableDataCellElementAttributes<State, Action> {
  abbr?: DOMAttribute<State, string>
  accessKey?: DOMAttribute<State, string>
  autocapitalize?: DOMAttribute<State, string>
  className?: DOMAttribute<State, string>
  colSpan?: DOMAttribute<State, number>
  contentEditable?: DOMAttribute<State, string>
  dir?: DOMAttribute<State, string>
  draggable?: DOMAttribute<State, boolean>
  headers?: DOMAttribute<State, string>
  hidden?: DOMAttribute<State, boolean>
  id?: DOMAttribute<State, string>
  inputMode?: DOMAttribute<State, string>
  lang?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  rowSpan?: DOMAttribute<State, number>
  scope?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  spellcheck?: DOMAttribute<State, boolean>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  title?: DOMAttribute<State, string>
  translate?: DOMAttribute<State, boolean>
  ondragexit?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module html {
  export function td<State, Action>(
    attributes: HTMLTableDataCellElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, HTMLTableDataCellElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLTableDataCellElement> {
    return el<State, Action, HTMLTableDataCellElement>('td', attributes as never, ...children)
  }
}

export interface HTMLTableHeaderCellElementAttributes<State, Action> {
  abbr?: DOMAttribute<State, string>
  accessKey?: DOMAttribute<State, string>
  autocapitalize?: DOMAttribute<State, string>
  className?: DOMAttribute<State, string>
  colSpan?: DOMAttribute<State, number>
  contentEditable?: DOMAttribute<State, string>
  dir?: DOMAttribute<State, string>
  draggable?: DOMAttribute<State, boolean>
  headers?: DOMAttribute<State, string>
  hidden?: DOMAttribute<State, boolean>
  id?: DOMAttribute<State, string>
  inputMode?: DOMAttribute<State, string>
  lang?: DOMAttribute<State, string>
  nonce?: DOMAttribute<State, string>
  onabort?: DOMEventHandler<State, UIEvent, Action>
  onanimationcancel?: DOMEventHandler<State, Event, Action>
  rowSpan?: DOMAttribute<State, number>
  onanimationend?: DOMEventHandler<State, Event, Action>
  onanimationiteration?: DOMEventHandler<State, Event, Action>
  onanimationstart?: DOMEventHandler<State, Event, Action>
  onauxclick?: DOMEventHandler<State, Event, Action>
  onblur?: DOMEventHandler<State, Event, Action>
  oncancel?: DOMEventHandler<State, Event, Action>
  oncanplay?: DOMEventHandler<State, Event, Action>
  oncanplaythrough?: DOMEventHandler<State, Event, Action>
  onchange?: DOMEventHandler<State, Event, Action>
  onclick?: DOMEventHandler<State, MouseEvent, Action>
  onclose?: DOMEventHandler<State, Event, Action>
  oncontextmenu?: DOMEventHandler<State, Event, Action>
  oncopy?: DOMEventHandler<State, Event, Action>
  oncuechange?: DOMEventHandler<State, Event, Action>
  oncut?: DOMEventHandler<State, Event, Action>
  ondblclick?: DOMEventHandler<State, Event, Action>
  ondrag?: DOMEventHandler<State, Event, Action>
  ondragend?: DOMEventHandler<State, Event, Action>
  ondragenter?: DOMEventHandler<State, Event, Action>
  ondragleave?: DOMEventHandler<State, Event, Action>
  ondragover?: DOMEventHandler<State, Event, Action>
  ondragstart?: DOMEventHandler<State, Event, Action>
  ondrop?: DOMEventHandler<State, Event, Action>
  ondurationchange?: DOMEventHandler<State, Event, Action>
  onemptied?: DOMEventHandler<State, Event, Action>
  onended?: DOMEventHandler<State, Event, Action>
  onerror?: DOMEventHandler<State, ErrorEvent, Action>
  onfocus?: DOMEventHandler<State, Event, Action>
  onfullscreenchange?: DOMEventHandler<State, Event, Action>
  scope?: DOMAttribute<State, string>
  scrollLeft?: DOMAttribute<State, number>
  scrollTop?: DOMAttribute<State, number>
  slot?: DOMAttribute<State, string>
  spellcheck?: DOMAttribute<State, boolean>
  style?: DOMAttribute<State, CSSProperties>
  tabIndex?: DOMAttribute<State, number>
  title?: DOMAttribute<State, string>
  translate?: DOMAttribute<State, boolean>
  ondragexit?: DOMEventHandler<State, Event, Action>
  onfullscreenerror?: DOMEventHandler<State, Event, Action>
  ongotpointercapture?: DOMEventHandler<State, Event, Action>
  oninput?: DOMEventHandler<State, Event, Action>
  oninvalid?: DOMEventHandler<State, Event, Action>
  onkeydown?: DOMEventHandler<State, Event, Action>
  onkeypress?: DOMEventHandler<State, Event, Action>
  onkeyup?: DOMEventHandler<State, Event, Action>
  onload?: DOMEventHandler<State, Event, Action>
  onloadeddata?: DOMEventHandler<State, Event, Action>
  onloadedmetadata?: DOMEventHandler<State, Event, Action>
  onloadend?: DOMEventHandler<State, Event, Action>
  onloadstart?: DOMEventHandler<State, Event, Action>
  onlostpointercapture?: DOMEventHandler<State, Event, Action>
  onmousedown?: DOMEventHandler<State, Event, Action>
  onmouseenter?: DOMEventHandler<State, Event, Action>
  onmouseleave?: DOMEventHandler<State, Event, Action>
  onmousemove?: DOMEventHandler<State, Event, Action>
  onmouseout?: DOMEventHandler<State, Event, Action>
  onmouseover?: DOMEventHandler<State, Event, Action>
  onmouseup?: DOMEventHandler<State, Event, Action>
  onpaste?: DOMEventHandler<State, Event, Action>
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
  onprogress?: DOMEventHandler<State, ProgressEvent, Action>
  onratechange?: DOMEventHandler<State, Event, Action>
  onreset?: DOMEventHandler<State, Event, Action>
  onresize?: DOMEventHandler<State, UIEvent, Action>
  onscroll?: DOMEventHandler<State, Event, Action>
  onsecuritypolicyviolation?: DOMEventHandler<State, Event, Action>
  onseeked?: DOMEventHandler<State, Event, Action>
  onseeking?: DOMEventHandler<State, Event, Action>
  onselect?: DOMEventHandler<State, Event, Action>
  onselectionchange?: DOMEventHandler<State, Event, Action>
  onselectstart?: DOMEventHandler<State, Event, Action>
  onstalled?: DOMEventHandler<State, Event, Action>
  onsubmit?: DOMEventHandler<State, Event, Action>
  onsuspend?: DOMEventHandler<State, Event, Action>
  ontimeupdate?: DOMEventHandler<State, Event, Action>
  ontoggle?: DOMEventHandler<State, Event, Action>
  ontouchcancel?: DOMEventHandler<State, Event, Action>
  ontouchend?: DOMEventHandler<State, Event, Action>
  ontouchmove?: DOMEventHandler<State, Event, Action>
  ontouchstart?: DOMEventHandler<State, Event, Action>
  ontransitioncancel?: DOMEventHandler<State, Event, Action>
  ontransitionend?: DOMEventHandler<State, Event, Action>
  ontransitionrun?: DOMEventHandler<State, Event, Action>
  ontransitionstart?: DOMEventHandler<State, Event, Action>
  onvolumechange?: DOMEventHandler<State, Event, Action>
  onwaiting?: DOMEventHandler<State, Event, Action>
  onwheel?: DOMEventHandler<State, Event, Action>
}

export module html {
  export function th<State, Action>(
    attributes: HTMLTableHeaderCellElementAttributes<State, Action> &
      CSSAttributes<State> &
      MoodAttributes<State, HTMLTableHeaderCellElement>,
    ...children: DOMChild<State, Action>[]
  ): DOMElement<State, Action, HTMLTableHeaderCellElement> {
    return el<State, Action, HTMLTableHeaderCellElement>('th', attributes as never, ...children)
  }
}
