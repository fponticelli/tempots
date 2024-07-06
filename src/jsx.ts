import { type Signal } from './prop'
import { type Renderable } from './renderable'

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace JSX {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type OneDOMNode = Signal<any> | Renderable | string | null | undefined
  export type DOMNode = OneDOMNode | OneDOMNode[]
  export type Element = DOMNode
  export interface TempoDOMAttributes {
    children?: DOMNode
  }

  export type DOMCSSProperties = {
    [key in keyof Omit<
    CSSStyleDeclaration,
    | 'item'
    | 'setProperty'
    | 'removeProperty'
    | 'getPropertyValue'
    | 'getPropertyPriority'
    >]?: string | number | null | undefined;
  }
  export type AllCSSProperties = Record<string, string | number | null | undefined>
  export interface CSSProperties extends AllCSSProperties, DOMCSSProperties {
    cssText?: string | null
  }

  export type TargetedEvent<
    Target extends EventTarget = EventTarget,
    TypedEvent extends Event = Event
  > = Omit<TypedEvent, 'currentTarget'> & {
    readonly currentTarget: Target
  }

  export type TargetedAnimationEvent<
    Target extends EventTarget
  > = TargetedEvent<Target, AnimationEvent>
  export type TargetedClipboardEvent<
    Target extends EventTarget
  > = TargetedEvent<Target, ClipboardEvent>
  export type TargetedCompositionEvent<
    Target extends EventTarget
  > = TargetedEvent<Target, CompositionEvent>
  export type TargetedDragEvent<Target extends EventTarget> = TargetedEvent<
  Target,
  DragEvent
  >
  export type TargetedFocusEvent<Target extends EventTarget> = TargetedEvent<
  Target,
  FocusEvent
  >
  export type TargetedKeyboardEvent<Target extends EventTarget> = TargetedEvent<
  Target,
  KeyboardEvent
  >
  export type TargetedMouseEvent<Target extends EventTarget> = TargetedEvent<
  Target,
  MouseEvent
  >
  export type TargetedPointerEvent<Target extends EventTarget> = TargetedEvent<
  Target,
  PointerEvent
  >
  export type TargetedTouchEvent<Target extends EventTarget> = TargetedEvent<
  Target,
  TouchEvent
  >
  export type TargetedTransitionEvent<
    Target extends EventTarget
  > = TargetedEvent<Target, TransitionEvent>
  export type TargetedUIEvent<Target extends EventTarget> = TargetedEvent<
  Target,
  UIEvent
  >
  export type TargetedWheelEvent<Target extends EventTarget> = TargetedEvent<
  Target,
  WheelEvent
  >

  export type EventHandler<E extends TargetedEvent> = (this: unknown, event: E) => void

  export type AnimationEventHandler<Target extends EventTarget> = EventHandler<
  TargetedAnimationEvent<Target>
  >
  export type ClipboardEventHandler<Target extends EventTarget> = EventHandler<
  TargetedClipboardEvent<Target>
  >
  export type CompositionEventHandler<
    Target extends EventTarget
  > = EventHandler<TargetedCompositionEvent<Target>>
  export type DragEventHandler<Target extends EventTarget> = EventHandler<
  TargetedDragEvent<Target>
  >
  export type FocusEventHandler<Target extends EventTarget> = EventHandler<
  TargetedFocusEvent<Target>
  >
  export type GenericEventHandler<Target extends EventTarget> = EventHandler<
  TargetedEvent<Target>
  >
  export type KeyboardEventHandler<Target extends EventTarget> = EventHandler<
  TargetedKeyboardEvent<Target>
  >
  export type MouseEventHandler<Target extends EventTarget> = EventHandler<
  TargetedMouseEvent<Target>
  >
  export type PointerEventHandler<Target extends EventTarget> = EventHandler<
  TargetedPointerEvent<Target>
  >
  export type TouchEventHandler<Target extends EventTarget> = EventHandler<
  TargetedTouchEvent<Target>
  >
  export type TransitionEventHandler<Target extends EventTarget> = EventHandler<
  TargetedTransitionEvent<Target>
  >
  export type UIEventHandler<Target extends EventTarget> = EventHandler<
  TargetedUIEvent<Target>
  >
  export type WheelEventHandler<Target extends EventTarget> = EventHandler<
  TargetedWheelEvent<Target>
  >

  export interface DOMAttributes<Target extends EventTarget>
    extends TempoDOMAttributes {
    // Image Events
    onLoad?: GenericEventHandler<Target> | undefined
    onLoadCapture?: GenericEventHandler<Target> | undefined
    onError?: GenericEventHandler<Target> | undefined
    onErrorCapture?: GenericEventHandler<Target> | undefined

    // Clipboard Events
    onCopy?: ClipboardEventHandler<Target> | undefined
    onCopyCapture?: ClipboardEventHandler<Target> | undefined
    onCut?: ClipboardEventHandler<Target> | undefined
    onCutCapture?: ClipboardEventHandler<Target> | undefined
    onPaste?: ClipboardEventHandler<Target> | undefined
    onPasteCapture?: ClipboardEventHandler<Target> | undefined

    // Composition Events
    onCompositionEnd?: CompositionEventHandler<Target> | undefined
    onCompositionEndCapture?: CompositionEventHandler<Target> | undefined
    onCompositionStart?: CompositionEventHandler<Target> | undefined
    onCompositionStartCapture?: CompositionEventHandler<Target> | undefined
    onCompositionUpdate?: CompositionEventHandler<Target> | undefined
    onCompositionUpdateCapture?: CompositionEventHandler<Target> | undefined

    // Details Events
    onToggle?: GenericEventHandler<Target> | undefined

    // Focus Events
    onFocus?: FocusEventHandler<Target> | undefined
    onFocusCapture?: FocusEventHandler<Target> | undefined
    onfocusin?: FocusEventHandler<Target> | undefined
    onfocusinCapture?: FocusEventHandler<Target> | undefined
    onfocusout?: FocusEventHandler<Target> | undefined
    onfocusoutCapture?: FocusEventHandler<Target> | undefined
    onBlur?: FocusEventHandler<Target> | undefined
    onBlurCapture?: FocusEventHandler<Target> | undefined

    // Form Events
    onChange?: GenericEventHandler<Target> | undefined
    onChangeCapture?: GenericEventHandler<Target> | undefined
    onInput?: GenericEventHandler<Target> | undefined
    onInputCapture?: GenericEventHandler<Target> | undefined
    onBeforeInput?: GenericEventHandler<Target> | undefined
    onBeforeInputCapture?: GenericEventHandler<Target> | undefined
    onSearch?: GenericEventHandler<Target> | undefined
    onSearchCapture?: GenericEventHandler<Target> | undefined
    onSubmit?: GenericEventHandler<Target> | undefined
    onSubmitCapture?: GenericEventHandler<Target> | undefined
    onInvalid?: GenericEventHandler<Target> | undefined
    onInvalidCapture?: GenericEventHandler<Target> | undefined
    onReset?: GenericEventHandler<Target> | undefined
    onResetCapture?: GenericEventHandler<Target> | undefined
    onFormData?: GenericEventHandler<Target> | undefined
    onFormDataCapture?: GenericEventHandler<Target> | undefined

    // Keyboard Events
    onKeyDown?: KeyboardEventHandler<Target> | undefined
    onKeyDownCapture?: KeyboardEventHandler<Target> | undefined
    onKeyPress?: KeyboardEventHandler<Target> | undefined
    onKeyPressCapture?: KeyboardEventHandler<Target> | undefined
    onKeyUp?: KeyboardEventHandler<Target> | undefined
    onKeyUpCapture?: KeyboardEventHandler<Target> | undefined

    // Media Events
    onAbort?: GenericEventHandler<Target> | undefined
    onAbortCapture?: GenericEventHandler<Target> | undefined
    onCanPlay?: GenericEventHandler<Target> | undefined
    onCanPlayCapture?: GenericEventHandler<Target> | undefined
    onCanPlayThrough?: GenericEventHandler<Target> | undefined
    onCanPlayThroughCapture?: GenericEventHandler<Target> | undefined
    onDurationChange?: GenericEventHandler<Target> | undefined
    onDurationChangeCapture?: GenericEventHandler<Target> | undefined
    onEmptied?: GenericEventHandler<Target> | undefined
    onEmptiedCapture?: GenericEventHandler<Target> | undefined
    onEncrypted?: GenericEventHandler<Target> | undefined
    onEncryptedCapture?: GenericEventHandler<Target> | undefined
    onEnded?: GenericEventHandler<Target> | undefined
    onEndedCapture?: GenericEventHandler<Target> | undefined
    onLoadedData?: GenericEventHandler<Target> | undefined
    onLoadedDataCapture?: GenericEventHandler<Target> | undefined
    onLoadedMetadata?: GenericEventHandler<Target> | undefined
    onLoadedMetadataCapture?: GenericEventHandler<Target> | undefined
    onLoadStart?: GenericEventHandler<Target> | undefined
    onLoadStartCapture?: GenericEventHandler<Target> | undefined
    onPause?: GenericEventHandler<Target> | undefined
    onPauseCapture?: GenericEventHandler<Target> | undefined
    onPlay?: GenericEventHandler<Target> | undefined
    onPlayCapture?: GenericEventHandler<Target> | undefined
    onPlaying?: GenericEventHandler<Target> | undefined
    onPlayingCapture?: GenericEventHandler<Target> | undefined
    onProgress?: GenericEventHandler<Target> | undefined
    onProgressCapture?: GenericEventHandler<Target> | undefined
    onRateChange?: GenericEventHandler<Target> | undefined
    onRateChangeCapture?: GenericEventHandler<Target> | undefined
    onSeeked?: GenericEventHandler<Target> | undefined
    onSeekedCapture?: GenericEventHandler<Target> | undefined
    onSeeking?: GenericEventHandler<Target> | undefined
    onSeekingCapture?: GenericEventHandler<Target> | undefined
    onStalled?: GenericEventHandler<Target> | undefined
    onStalledCapture?: GenericEventHandler<Target> | undefined
    onSuspend?: GenericEventHandler<Target> | undefined
    onSuspendCapture?: GenericEventHandler<Target> | undefined
    onTimeUpdate?: GenericEventHandler<Target> | undefined
    onTimeUpdateCapture?: GenericEventHandler<Target> | undefined
    onVolumeChange?: GenericEventHandler<Target> | undefined
    onVolumeChangeCapture?: GenericEventHandler<Target> | undefined
    onWaiting?: GenericEventHandler<Target> | undefined
    onWaitingCapture?: GenericEventHandler<Target> | undefined

    // MouseEvents
    onClick?: MouseEventHandler<Target> | undefined
    onClickCapture?: MouseEventHandler<Target> | undefined
    onContextMenu?: MouseEventHandler<Target> | undefined
    onContextMenuCapture?: MouseEventHandler<Target> | undefined
    onDblClick?: MouseEventHandler<Target> | undefined
    onDblClickCapture?: MouseEventHandler<Target> | undefined
    onDrag?: DragEventHandler<Target> | undefined
    onDragCapture?: DragEventHandler<Target> | undefined
    onDragEnd?: DragEventHandler<Target> | undefined
    onDragEndCapture?: DragEventHandler<Target> | undefined
    onDragEnter?: DragEventHandler<Target> | undefined
    onDragEnterCapture?: DragEventHandler<Target> | undefined
    onDragExit?: DragEventHandler<Target> | undefined
    onDragExitCapture?: DragEventHandler<Target> | undefined
    onDragLeave?: DragEventHandler<Target> | undefined
    onDragLeaveCapture?: DragEventHandler<Target> | undefined
    onDragOver?: DragEventHandler<Target> | undefined
    onDragOverCapture?: DragEventHandler<Target> | undefined
    onDragStart?: DragEventHandler<Target> | undefined
    onDragStartCapture?: DragEventHandler<Target> | undefined
    onDrop?: DragEventHandler<Target> | undefined
    onDropCapture?: DragEventHandler<Target> | undefined
    onMouseDown?: MouseEventHandler<Target> | undefined
    onMouseDownCapture?: MouseEventHandler<Target> | undefined
    onMouseEnter?: MouseEventHandler<Target> | undefined
    onMouseEnterCapture?: MouseEventHandler<Target> | undefined
    onMouseLeave?: MouseEventHandler<Target> | undefined
    onMouseLeaveCapture?: MouseEventHandler<Target> | undefined
    onMouseMove?: MouseEventHandler<Target> | undefined
    onMouseMoveCapture?: MouseEventHandler<Target> | undefined
    onMouseOut?: MouseEventHandler<Target> | undefined
    onMouseOutCapture?: MouseEventHandler<Target> | undefined
    onMouseOver?: MouseEventHandler<Target> | undefined
    onMouseOverCapture?: MouseEventHandler<Target> | undefined
    onMouseUp?: MouseEventHandler<Target> | undefined
    onMouseUpCapture?: MouseEventHandler<Target> | undefined

    // Selection Events
    onSelect?: GenericEventHandler<Target> | undefined
    onSelectCapture?: GenericEventHandler<Target> | undefined

    // Touch Events
    onTouchCancel?: TouchEventHandler<Target> | undefined
    onTouchCancelCapture?: TouchEventHandler<Target> | undefined
    onTouchEnd?: TouchEventHandler<Target> | undefined
    onTouchEndCapture?: TouchEventHandler<Target> | undefined
    onTouchMove?: TouchEventHandler<Target> | undefined
    onTouchMoveCapture?: TouchEventHandler<Target> | undefined
    onTouchStart?: TouchEventHandler<Target> | undefined
    onTouchStartCapture?: TouchEventHandler<Target> | undefined

    // Pointer Events
    onPointerOver?: PointerEventHandler<Target> | undefined
    onPointerOverCapture?: PointerEventHandler<Target> | undefined
    onPointerEnter?: PointerEventHandler<Target> | undefined
    onPointerEnterCapture?: PointerEventHandler<Target> | undefined
    onPointerDown?: PointerEventHandler<Target> | undefined
    onPointerDownCapture?: PointerEventHandler<Target> | undefined
    onPointerMove?: PointerEventHandler<Target> | undefined
    onPointerMoveCapture?: PointerEventHandler<Target> | undefined
    onPointerUp?: PointerEventHandler<Target> | undefined
    onPointerUpCapture?: PointerEventHandler<Target> | undefined
    onPointerCancel?: PointerEventHandler<Target> | undefined
    onPointerCancelCapture?: PointerEventHandler<Target> | undefined
    onPointerOut?: PointerEventHandler<Target> | undefined
    onPointerOutCapture?: PointerEventHandler<Target> | undefined
    onPointerLeave?: PointerEventHandler<Target> | undefined
    onPointerLeaveCapture?: PointerEventHandler<Target> | undefined
    onGotPointerCapture?: PointerEventHandler<Target> | undefined
    onGotPointerCaptureCapture?: PointerEventHandler<Target> | undefined
    onLostPointerCapture?: PointerEventHandler<Target> | undefined
    onLostPointerCaptureCapture?: PointerEventHandler<Target> | undefined

    // UI Events
    onScroll?: UIEventHandler<Target> | undefined
    onScrollCapture?: UIEventHandler<Target> | undefined

    // Wheel Events
    onWheel?: WheelEventHandler<Target> | undefined
    onWheelCapture?: WheelEventHandler<Target> | undefined

    // Animation Events
    onAnimationStart?: AnimationEventHandler<Target> | undefined
    onAnimationStartCapture?: AnimationEventHandler<Target> | undefined
    onAnimationEnd?: AnimationEventHandler<Target> | undefined
    onAnimationEndCapture?: AnimationEventHandler<Target> | undefined
    onAnimationIteration?: AnimationEventHandler<Target> | undefined
    onAnimationIterationCapture?: AnimationEventHandler<Target> | undefined

    // Transition Events
    onTransitionEnd?: TransitionEventHandler<Target>
    onTransitionEndCapture?: TransitionEventHandler<Target>
  }

  export type VSignal<T> = Signal<T> | Signal<T | undefined> | Signal<T | null> | Signal<T | undefined | null>
  export type VValue<T> = VSignal<T> | T | undefined | null

  export interface HTMLAttributes<RefType extends EventTarget = EventTarget>
    extends DOMAttributes<RefType> {
    // Standard HTML Attributes
    accept?: VValue<string>
    acceptCharset?: VValue<string>
    accessKey?: VValue<string>
    action?: VValue<string>
    allow?: VValue<string>
    allowFullScreen?: VValue<boolean>
    allowTransparency?: VValue<boolean>
    alt?: VValue<string>
    as?: VValue<string>
    async?: VValue<boolean>
    autocomplete?: VValue<string>
    autoComplete?: VValue<string>
    autocorrect?: VValue<string>
    autoCorrect?: VValue<string>
    autofocus?: VValue<boolean>
    autoFocus?: VValue<boolean>
    autoPlay?: VValue<boolean>
    capture?: VValue<string> | VValue<boolean>
    cellPadding?: VValue<string> | VValue<number>
    cellSpacing?: VValue<string> | VValue<number>
    charSet?: VValue<string>
    challenge?: VValue<string>
    checked?: VValue<boolean>
    cite?: VValue<string>
    class?: VValue<string>
    className?: VValue<string>
    cols?: VValue<number>
    colSpan?: VValue<number>
    content?: VValue<string>
    contentEditable?: VValue<boolean>
    contextMenu?: VValue<string>
    controls?: VValue<boolean>
    controlsList?: VValue<string>
    coords?: VValue<string>
    crossOrigin?: VValue<string>
    data?: VValue<string>
    dateTime?: VValue<string>
    default?: VValue<boolean>
    defaultChecked?: VValue<boolean>
    defaultValue?: VValue<string>
    defer?: VValue<boolean>
    dir?: VValue<'auto' | 'rtl' | 'ltr'>
    disabled?: VValue<boolean>
    disableRemotePlayback?: VValue<boolean>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    download?: VValue<any>
    decoding?: VValue<'sync' | 'async' | 'auto' | undefined>
    draggable?: VValue<boolean>
    encType?: VValue<string>
    enterkeyhint?: VValue<'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send'>
    for?: VValue<string>
    form?: VValue<string>
    formAction?: VValue<string>
    formEncType?: VValue<string>
    formMethod?: VValue<string>
    formNoValidate?: VValue<boolean>
    formTarget?: VValue<string>
    frameBorder?: VValue<number | string>
    headers?: VValue<string>
    height?: VValue<number | string>
    hidden?: VValue<boolean>
    high?: VValue<number>
    href?: VValue<string>
    hrefLang?: VValue<string>
    htmlFor?: VValue<string>
    httpEquiv?: VValue<string>
    icon?: VValue<string>
    id?: VValue<string>
    indeterminate?: Signal<boolean>
    inputMode?: VValue<string>
    integrity?: VValue<string>
    is?: VValue<string>
    keyParams?: VValue<string>
    keyType?: VValue<string>
    kind?: VValue<string>
    label?: VValue<string>
    lang?: VValue<string>
    list?: VValue<string>
    loading?: VValue<'eager' | 'lazy'>
    loop?: VValue<boolean>
    low?: VValue<number>
    manifest?: VValue<string>
    marginHeight?: VValue<number>
    marginWidth?: VValue<number>
    max?: VValue<number | string>
    maxLength?: VValue<number>
    media?: VValue<string>
    mediaGroup?: VValue<string>
    method?: VValue<string>
    min?: VValue<number | string>
    minLength?: VValue<number>
    multiple?: VValue<boolean>
    muted?: VValue<boolean>
    name?: VValue<string>
    nomodule?: VValue<boolean>
    nonce?: VValue<string>
    noValidate?: VValue<boolean>
    open?: VValue<boolean>
    optimum?: VValue<number>
    part?: VValue<string>
    pattern?: VValue<string>
    ping?: VValue<string>
    placeholder?: VValue<string>
    playsInline?: VValue<boolean>
    poster?: VValue<string>
    preload?: VValue<string>
    radioGroup?: VValue<string>
    readonly?: VValue<boolean>
    readOnly?: VValue<boolean>
    referrerpolicy?:
    VValue<
    | 'no-referrer'
    | 'no-referrer-when-downgrade'
    | 'origin'
    | 'origin-when-cross-origin'
    | 'same-origin'
    | 'strict-origin'
    | 'strict-origin-when-cross-origin'
    | 'unsafe-url'
    >
    rel?: VValue<string>
    required?: VValue<boolean>
    reversed?: VValue<boolean>
    role?:
    VValue<
    | 'alert'
    | 'alertdialog'
    | 'application'
    | 'article'
    | 'banner'
    | 'button'
    | 'cell'
    | 'checkbox'
    | 'columnheader'
    | 'combobox'
    | 'complementary'
    | 'contentinfo'
    | 'definition'
    | 'dialog'
    | 'directory'
    | 'document'
    | 'feed'
    | 'figure'
    | 'form'
    | 'grid'
    | 'gridcell'
    | 'group'
    | 'heading'
    | 'img'
    | 'link'
    | 'list'
    | 'listbox'
    | 'listitem'
    | 'log'
    | 'main'
    | 'marquee'
    | 'math'
    | 'menu'
    | 'menubar'
    | 'menuitem'
    | 'menuitemcheckbox'
    | 'menuitemradio'
    | 'navigation'
    | 'none'
    | 'note'
    | 'option'
    | 'presentation'
    | 'progressbar'
    | 'radio'
    | 'radiogroup'
    | 'region'
    | 'row'
    | 'rowgroup'
    | 'rowheader'
    | 'scrollbar'
    | 'search'
    | 'searchbox'
    | 'separator'
    | 'slider'
    | 'spinbutton'
    | 'status'
    | 'switch'
    | 'tab'
    | 'table'
    | 'tablist'
    | 'tabpanel'
    | 'term'
    | 'textbox'
    | 'timer'
    | 'toolbar'
    | 'tooltip'
    | 'tree'
    | 'treegrid'
    | 'treeitem'
    >
    rows?: VValue<number>
    rowSpan?: VValue<number>
    sandbox?: VValue<string>
    scope?: VValue<string>
    scoped?: VValue<boolean>
    scrolling?: VValue<string>
    seamless?: VValue<boolean>
    selected?: VValue<boolean>
    shape?: VValue<string>
    size?: VValue<number>
    sizes?: VValue<string>
    slot?: VValue<string>
    span?: VValue<number>
    spellcheck?: VValue<boolean>
    spellCheck?: VValue<boolean>
    src?: VValue<string>
    srcset?: VValue<string>
    srcDoc?: VValue<string>
    srcLang?: VValue<string>
    srcSet?: VValue<string>
    start?: VValue<number>
    step?: VValue<number> | VValue<string>
    style?: VValue<string> | VValue<CSSProperties>
    summary?: VValue<string>
    tabIndex?: VValue<number>
    target?: VValue<string>
    title?: VValue<string>
    type?: VValue<string>
    useMap?: VValue<string>
    value?: VValue<string> | VValue<string[]> | VValue<number>
    volume?: VValue<number> | VValue<string>
    width?: VValue<number> | VValue<string>
    wmode?: VValue<string>
    wrap?: VValue<string>

    // Non-standard Attributes
    autocapitalize?:
    VValue<
    | 'off'
    | 'none'
    | 'on'
    | 'sentences'
    | 'words'
    | 'characters'
    >
    autoCapitalize?:
    VValue<
    | 'off'
    | 'none'
    | 'on'
    | 'sentences'
    | 'words'
    | 'characters'
    >
    disablePictureInPicture?: VValue<boolean>
    results?: VValue<number>
    translate?: VValue<'yes' | 'no'>

    // RDFa Attributes
    about?: VValue<string>
    datatype?: VValue<string>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    inlist?: VValue<any>
    prefix?: VValue<string>
    property?: VValue<string>
    resource?: VValue<string>
    typeof?: VValue<string>
    vocab?: VValue<string>

    // Microdata Attributes
    itemProp?: VValue<string>
    itemScope?: VValue<boolean>
    itemType?: VValue<string>
    itemID?: VValue<string>
    itemRef?: VValue<string>
  }

  export interface SVGAttributes<Target extends EventTarget = SVGElement>
    extends HTMLAttributes<Target> {
    accentHeight?: VValue<number> | VValue<number>
    accumulate?: VValue<'none' | 'sum' | undefined>
    additive?: VValue<'replace' | 'sum' | undefined>
    alignmentBaseline?: VValue<
    | 'auto'
    | 'baseline'
    | 'before-edge'
    | 'text-before-edge'
    | 'middle'
    | 'central'
    | 'after-edge'
    | 'text-after-edge'
    | 'ideographic'
    | 'alphabetic'
    | 'hanging'
    | 'mathematical'
    | 'inherit'
    | undefined
    >
    allowReorder?: VValue<'no' | 'yes' | undefined>
    alphabetic?: VValue<number> | VValue<number>
    amplitude?: VValue<number> | VValue<number>
    arabicForm?: VValue<'initial' | 'medial' | 'terminal' | 'isolated' | undefined>
    ascent?: VValue<number> | VValue<number>
    attributeName?: VValue<string>
    attributeType?: VValue<string>
    autoReverse?: VValue<number> | VValue<number>
    azimuth?: VValue<number> | VValue<number>
    baseFrequency?: VValue<number> | VValue<number>
    baselineShift?: VValue<number> | VValue<number>
    baseProfile?: VValue<number> | VValue<number>
    bbox?: VValue<number> | VValue<number>
    begin?: VValue<number> | VValue<number>
    bias?: VValue<number> | VValue<number>
    by?: VValue<number> | VValue<string>
    calcMode?: VValue<number> | VValue<number>
    capHeight?: VValue<number> | VValue<number>
    clip?: VValue<number> | VValue<number>
    clipPath?: VValue<string>
    clipPathUnits?: VValue<number> | VValue<number>
    clipRule?: VValue<number> | VValue<number>
    colorInterpolation?: VValue<number> | VValue<number>
    colorInterpolationFilters?: VValue<'auto' | 'sRGB' | 'linearRGB' | 'inherit' | undefined>
    colorProfile?: VValue<number> | VValue<number>
    colorRendering?: VValue<number> | VValue<number>
    contentScriptType?: VValue<number> | VValue<number>
    contentStyleType?: VValue<number> | VValue<number>
    cursor?: VValue<number> | VValue<number>
    cx?: VValue<number> | VValue<string>
    cy?: VValue<number> | VValue<string>
    d?: VValue<string>
    decelerate?: VValue<number> | VValue<number>
    descent?: VValue<number> | VValue<number>
    diffuseConstant?: VValue<number> | VValue<number>
    direction?: VValue<number> | VValue<number>
    display?: VValue<number> | VValue<number>
    divisor?: VValue<number> | VValue<number>
    dominantBaseline?: VValue<number> | VValue<number>
    dur?: VValue<number> | VValue<string>
    dx?: VValue<number> | VValue<string>
    dy?: VValue<number> | VValue<string>
    edgeMode?: VValue<number> | VValue<number>
    elevation?: VValue<number> | VValue<number>
    enableBackground?: VValue<number> | VValue<number>
    end?: VValue<number> | VValue<string>
    exponent?: VValue<number> | VValue<number>
    externalResourcesRequired?: VValue<number> | VValue<number>
    fill?: VValue<string>
    fillOpacity?: VValue<number> | VValue<number>
    fillRule?: VValue<'nonzero' | 'evenodd' | 'inherit' | undefined>
    filter?: VValue<string>
    filterRes?: VValue<number> | VValue<number>
    filterUnits?: VValue<number> | VValue<number>
    floodColor?: VValue<number> | VValue<number>
    floodOpacity?: VValue<number> | VValue<number>
    focusable?: VValue<number> | VValue<number>
    fontFamily?: VValue<string>
    fontSize?: VValue<number> | VValue<number>
    fontSizeAdjust?: VValue<number> | VValue<number>
    fontStretch?: VValue<number> | VValue<number>
    fontStyle?: VValue<number> | VValue<number>
    fontVariant?: VValue<number> | VValue<number>
    fontWeight?: VValue<number> | VValue<number>
    format?: VValue<number> | VValue<number>
    from?: VValue<number> | VValue<number>
    fx?: VValue<number> | VValue<string>
    fy?: VValue<number> | VValue<string>
    g1?: VValue<number> | VValue<string>
    g2?: VValue<number> | VValue<string>
    glyphName?: VValue<number> | VValue<number>
    glyphOrientationHorizontal?: VValue<number> | VValue<number>
    glyphOrientationVertical?: VValue<number> | VValue<number>
    glyphRef?: VValue<number> | VValue<number>
    gradientTransform?: VValue<string>
    gradientUnits?: VValue<string>
    hanging?: VValue<number> | VValue<number>
    horizAdvX?: VValue<number> | VValue<number>
    horizOriginX?: VValue<number> | VValue<number>
    ideographic?: VValue<number> | VValue<number>
    imageRendering?: VValue<number> | VValue<number>
    in2?: VValue<number> | VValue<string>
    in?: VValue<string>
    intercept?: VValue<number> | VValue<number>
    k1?: VValue<number> | VValue<string>
    k2?: VValue<number> | VValue<string>
    k3?: VValue<number> | VValue<string>
    k4?: VValue<number> | VValue<string>
    k?: VValue<number> | VValue<string>
    kernelMatrix?: VValue<number> | VValue<number>
    kernelUnitLength?: VValue<number> | VValue<number>
    kerning?: VValue<number> | VValue<number>
    keyPoints?: VValue<number> | VValue<number>
    keySplines?: VValue<number> | VValue<number>
    keyTimes?: VValue<number> | VValue<number>
    lengthAdjust?: VValue<number> | VValue<number>
    letterSpacing?: VValue<number> | VValue<number>
    lightingColor?: VValue<number> | VValue<number>
    limitingConeAngle?: VValue<number> | VValue<number>
    local?: VValue<number> | VValue<number>
    markerEnd?: VValue<string>
    markerHeight?: VValue<number> | VValue<number>
    markerMid?: VValue<string>
    markerStart?: VValue<string>
    markerUnits?: VValue<number> | VValue<number>
    markerWidth?: VValue<number> | VValue<number>
    mask?: VValue<string>
    maskContentUnits?: VValue<number> | VValue<number>
    maskUnits?: VValue<number> | VValue<number>
    mathematical?: VValue<number> | VValue<number>
    mode?: VValue<number> | VValue<number>
    numOctaves?: VValue<number> | VValue<number>
    offset?: VValue<number> | VValue<number>
    opacity?: VValue<number> | VValue<number>
    operator?: VValue<number> | VValue<number>
    order?: VValue<number> | VValue<number>
    orient?: VValue<number> | VValue<number>
    orientation?: VValue<number> | VValue<number>
    origin?: VValue<number> | VValue<number>
    overflow?: VValue<number> | VValue<number>
    overlinePosition?: VValue<number> | VValue<number>
    overlineThickness?: VValue<number> | VValue<number>
    paintOrder?: VValue<number> | VValue<number>
    panose1?: VValue<number> | VValue<number>
    pathLength?: VValue<number> | VValue<number>
    patternContentUnits?: VValue<string>
    patternTransform?: VValue<number> | VValue<number>
    patternUnits?: VValue<string>
    pointerEvents?: VValue<number> | VValue<number>
    points?: VValue<string>
    pointsAtX?: VValue<number> | VValue<number>
    pointsAtY?: VValue<number> | VValue<number>
    pointsAtZ?: VValue<number> | VValue<number>
    preserveAlpha?: VValue<number> | VValue<number>
    preserveAspectRatio?: VValue<string>
    primitiveUnits?: VValue<number> | VValue<number>
    r?: VValue<number> | VValue<string>
    radius?: VValue<number> | VValue<number>
    refX?: VValue<number> | VValue<number>
    refY?: VValue<number> | VValue<number>
    renderingIntent?: VValue<number> | VValue<number>
    repeatCount?: VValue<number> | VValue<number>
    repeatDur?: VValue<number> | VValue<number>
    requiredExtensions?: VValue<number> | VValue<number>
    requiredFeatures?: VValue<number> | VValue<number>
    restart?: VValue<number> | VValue<number>
    result?: VValue<string>
    rotate?: VValue<number> | VValue<number>
    rx?: VValue<number> | VValue<string>
    ry?: VValue<number> | VValue<string>
    scale?: VValue<number> | VValue<number>
    seed?: VValue<number> | VValue<number>
    shapeRendering?: VValue<number> | VValue<number>
    slope?: VValue<number> | VValue<number>
    spacing?: VValue<number> | VValue<number>
    specularConstant?: VValue<number> | VValue<number>
    specularExponent?: VValue<number> | VValue<number>
    speed?: VValue<number> | VValue<number>
    spreadMethod?: VValue<string>
    startOffset?: VValue<number> | VValue<number>
    stdDeviation?: VValue<number> | VValue<number>
    stemh?: VValue<number> | VValue<number>
    stemv?: VValue<number> | VValue<number>
    stitchTiles?: VValue<number> | VValue<number>
    stopColor?: VValue<string>
    stopOpacity?: VValue<number> | VValue<number>
    strikethroughPosition?: VValue<number> | VValue<number>
    strikethroughThickness?: VValue<number> | VValue<number>
    string?: VValue<number> | VValue<number>
    stroke?: VValue<string>
    strokeDasharray?: VValue<number> | VValue<string>
    strokeDashoffset?: VValue<number> | VValue<string>
    strokeLinecap?: VValue<'butt' | 'round' | 'square' | 'inherit' | undefined>
    strokeLinejoin?: VValue<'miter' | 'round' | 'bevel' | 'inherit' | undefined>
    strokeMiterlimit?: VValue<number> | VValue<string>
    strokeOpacity?: VValue<number> | VValue<number>
    strokeWidth?: VValue<number> | VValue<number>
    surfaceScale?: VValue<number> | VValue<number>
    systemLanguage?: VValue<number> | VValue<number>
    tableValues?: VValue<number> | VValue<number>
    targetX?: VValue<number> | VValue<number>
    targetY?: VValue<number> | VValue<number>
    textAnchor?: VValue<string>
    textDecoration?: VValue<number> | VValue<number>
    textLength?: VValue<number> | VValue<number>
    textRendering?: VValue<number> | VValue<number>
    to?: VValue<number> | VValue<string>
    transform?: VValue<string>
    u1?: VValue<number> | VValue<string>
    u2?: VValue<number> | VValue<string>
    underlinePosition?: VValue<number> | VValue<number>
    underlineThickness?: VValue<number> | VValue<number>
    unicode?: VValue<number> | VValue<number>
    unicodeBidi?: VValue<number> | VValue<number>
    unicodeRange?: VValue<number> | VValue<number>
    unitsPerEm?: VValue<number> | VValue<number>
    vAlphabetic?: VValue<number> | VValue<number>
    values?: VValue<string>
    vectorEffect?: VValue<number> | VValue<number>
    version?: VValue<string>
    vertAdvY?: VValue<number> | VValue<number>
    vertOriginX?: VValue<number> | VValue<number>
    vertOriginY?: VValue<number> | VValue<number>
    vHanging?: VValue<number> | VValue<number>
    vIdeographic?: VValue<number> | VValue<number>
    viewBox?: VValue<string>
    viewTarget?: VValue<number> | VValue<number>
    visibility?: VValue<number> | VValue<number>
    vMathematical?: VValue<number> | VValue<number>
    widths?: VValue<number> | VValue<number>
    wordSpacing?: VValue<number> | VValue<number>
    writingMode?: VValue<number> | VValue<number>
    x1?: VValue<number> | VValue<string>
    x2?: VValue<number> | VValue<string>
    x?: VValue<number> | VValue<string>
    xChannelSelector?: VValue<string>
    xHeight?: VValue<number> | VValue<number>
    xlinkActuate?: VValue<string>
    xlinkArcrole?: VValue<string>
    xlinkHref?: VValue<string>
    xlinkRole?: VValue<string>
    xlinkShow?: VValue<string>
    xlinkTitle?: VValue<string>
    xlinkType?: VValue<string>
    xmlBase?: VValue<string>
    xmlLang?: VValue<string>
    xmlns?: VValue<string>
    xmlnsXlink?: VValue<string>
    xmlSpace?: VValue<string>
    y1?: VValue<number> | VValue<string>
    y2?: VValue<number> | VValue<string>
    y?: VValue<number> | VValue<string>
    yChannelSelector?: VValue<string>
    z?: VValue<number> | VValue<string>
    zoomAndPan?: VValue<string>
  }

  export interface PathAttributes {
    d: string
  }

  export interface IntrinsicElements {
    // HTML
    a: HTMLAttributes<HTMLAnchorElement>
    abbr: HTMLAttributes<HTMLElement>
    address: HTMLAttributes<HTMLElement>
    area: HTMLAttributes<HTMLAreaElement>
    article: HTMLAttributes<HTMLElement>
    aside: HTMLAttributes<HTMLElement>
    audio: HTMLAttributes<HTMLAudioElement>
    b: HTMLAttributes<HTMLElement>
    base: HTMLAttributes<HTMLBaseElement>
    bdi: HTMLAttributes<HTMLElement>
    bdo: HTMLAttributes<HTMLElement>
    big: HTMLAttributes<HTMLElement>
    blockquote: HTMLAttributes<HTMLQuoteElement>
    body: HTMLAttributes<HTMLBodyElement>
    br: HTMLAttributes<HTMLBRElement>
    button: HTMLAttributes<HTMLButtonElement>
    canvas: HTMLAttributes<HTMLCanvasElement>
    caption: HTMLAttributes<HTMLTableCaptionElement>
    cite: HTMLAttributes<HTMLElement>
    code: HTMLAttributes<HTMLElement>
    col: HTMLAttributes<HTMLTableColElement>
    colgroup: HTMLAttributes<HTMLTableColElement>
    data: HTMLAttributes<HTMLDataElement>
    datalist: HTMLAttributes<HTMLDataListElement>
    dd: HTMLAttributes<HTMLElement>
    del: HTMLAttributes<HTMLModElement>
    details: HTMLAttributes<HTMLDetailsElement>
    dfn: HTMLAttributes<HTMLElement>
    dialog: HTMLAttributes<HTMLDialogElement>
    div: HTMLAttributes<HTMLDivElement>
    dl: HTMLAttributes<HTMLDListElement>
    dt: HTMLAttributes<HTMLElement>
    em: HTMLAttributes<HTMLElement>
    embed: HTMLAttributes<HTMLEmbedElement>
    fieldset: HTMLAttributes<HTMLFieldSetElement>
    figcaption: HTMLAttributes<HTMLElement>
    figure: HTMLAttributes<HTMLElement>
    footer: HTMLAttributes<HTMLElement>
    form: HTMLAttributes<HTMLFormElement>
    h1: HTMLAttributes<HTMLHeadingElement>
    h2: HTMLAttributes<HTMLHeadingElement>
    h3: HTMLAttributes<HTMLHeadingElement>
    h4: HTMLAttributes<HTMLHeadingElement>
    h5: HTMLAttributes<HTMLHeadingElement>
    h6: HTMLAttributes<HTMLHeadingElement>
    head: HTMLAttributes<HTMLHeadElement>
    header: HTMLAttributes<HTMLElement>
    hgroup: HTMLAttributes<HTMLElement>
    hr: HTMLAttributes<HTMLHRElement>
    html: HTMLAttributes<HTMLHtmlElement>
    i: HTMLAttributes<HTMLElement>
    iframe: HTMLAttributes<HTMLIFrameElement>
    img: HTMLAttributes<HTMLImageElement>
    input: HTMLAttributes<HTMLInputElement>
    ins: HTMLAttributes<HTMLModElement>
    kbd: HTMLAttributes<HTMLElement>
    keygen: HTMLAttributes<HTMLUnknownElement>
    label: HTMLAttributes<HTMLLabelElement>
    legend: HTMLAttributes<HTMLLegendElement>
    li: HTMLAttributes<HTMLLIElement>
    link: HTMLAttributes<HTMLLinkElement>
    main: HTMLAttributes<HTMLElement>
    map: HTMLAttributes<HTMLMapElement>
    mark: HTMLAttributes<HTMLElement>
    marquee: HTMLAttributes<HTMLMarqueeElement>
    menu: HTMLAttributes<HTMLMenuElement>
    menuitem: HTMLAttributes<HTMLUnknownElement>
    meta: HTMLAttributes<HTMLMetaElement>
    meter: HTMLAttributes<HTMLMeterElement>
    nav: HTMLAttributes<HTMLElement>
    noscript: HTMLAttributes<HTMLElement>
    object: HTMLAttributes<HTMLObjectElement>
    ol: HTMLAttributes<HTMLOListElement>
    optgroup: HTMLAttributes<HTMLOptGroupElement>
    option: HTMLAttributes<HTMLOptionElement>
    output: HTMLAttributes<HTMLOutputElement>
    p: HTMLAttributes<HTMLParagraphElement>
    param: HTMLAttributes<HTMLParamElement>
    picture: HTMLAttributes<HTMLPictureElement>
    pre: HTMLAttributes<HTMLPreElement>
    progress: HTMLAttributes<HTMLProgressElement>
    q: HTMLAttributes<HTMLQuoteElement>
    rp: HTMLAttributes<HTMLElement>
    rt: HTMLAttributes<HTMLElement>
    ruby: HTMLAttributes<HTMLElement>
    s: HTMLAttributes<HTMLElement>
    samp: HTMLAttributes<HTMLElement>
    script: HTMLAttributes<HTMLScriptElement>
    section: HTMLAttributes<HTMLElement>
    select: HTMLAttributes<HTMLSelectElement>
    slot: HTMLAttributes<HTMLSlotElement>
    small: HTMLAttributes<HTMLElement>
    source: HTMLAttributes<HTMLSourceElement>
    span: HTMLAttributes<HTMLSpanElement>
    strong: HTMLAttributes<HTMLElement>
    style: HTMLAttributes<HTMLStyleElement>
    sub: HTMLAttributes<HTMLElement>
    summary: HTMLAttributes<HTMLElement>
    sup: HTMLAttributes<HTMLElement>
    table: HTMLAttributes<HTMLTableElement>
    tbody: HTMLAttributes<HTMLTableSectionElement>
    td: HTMLAttributes<HTMLTableCellElement>
    textarea: HTMLAttributes<HTMLTextAreaElement>
    tfoot: HTMLAttributes<HTMLTableSectionElement>
    th: HTMLAttributes<HTMLTableCellElement>
    thead: HTMLAttributes<HTMLTableSectionElement>
    time: HTMLAttributes<HTMLTimeElement>
    title: HTMLAttributes<HTMLTitleElement>
    tr: HTMLAttributes<HTMLTableRowElement>
    track: HTMLAttributes<HTMLTrackElement>
    u: HTMLAttributes<HTMLElement>
    ul: HTMLAttributes<HTMLUListElement>
    var: HTMLAttributes<HTMLElement>
    video: HTMLAttributes<HTMLVideoElement>
    wbr: HTMLAttributes<HTMLElement>

    // SVG
    svg: SVGAttributes<SVGSVGElement>
    animate: SVGAttributes<SVGAnimateElement>
    circle: SVGAttributes<SVGCircleElement>
    animateMotion: SVGAttributes<SVGAnimateMotionElement>
    animateTransform: SVGAttributes<SVGAnimateElement>
    clipPath: SVGAttributes<SVGClipPathElement>
    defs: SVGAttributes<SVGDefsElement>
    desc: SVGAttributes<SVGDescElement>
    ellipse: SVGAttributes<SVGEllipseElement>
    feBlend: SVGAttributes<SVGFEBlendElement>
    feColorMatrix: SVGAttributes<SVGFEColorMatrixElement>
    feComponentTransfer: SVGAttributes<SVGFEComponentTransferElement>
    feComposite: SVGAttributes<SVGFECompositeElement>
    feConvolveMatrix: SVGAttributes<SVGFEConvolveMatrixElement>
    feDiffuseLighting: SVGAttributes<SVGFEDiffuseLightingElement>
    feDisplacementMap: SVGAttributes<SVGFEDisplacementMapElement>
    feDistantLight: SVGAttributes<SVGFEDistantLightElement>
    feDropShadow: SVGAttributes<SVGFEDropShadowElement>
    feFlood: SVGAttributes<SVGFEFloodElement>
    feFuncA: SVGAttributes<SVGFEFuncAElement>
    feFuncB: SVGAttributes<SVGFEFuncBElement>
    feFuncG: SVGAttributes<SVGFEFuncGElement>
    feFuncR: SVGAttributes<SVGFEFuncRElement>
    feGaussianBlur: SVGAttributes<SVGFEGaussianBlurElement>
    feImage: SVGAttributes<SVGFEImageElement>
    feMerge: SVGAttributes<SVGFEMergeElement>
    feMergeNode: SVGAttributes<SVGFEMergeNodeElement>
    feMorphology: SVGAttributes<SVGFEMorphologyElement>
    feOffset: SVGAttributes<SVGFEOffsetElement>
    fePointLight: SVGAttributes<SVGFEPointLightElement>
    feSpecularLighting: SVGAttributes<SVGFESpecularLightingElement>
    feSpotLight: SVGAttributes<SVGFESpotLightElement>
    feTile: SVGAttributes<SVGFETileElement>
    feTurbulence: SVGAttributes<SVGFETurbulenceElement>
    filter: SVGAttributes<SVGFilterElement>
    foreignObject: SVGAttributes<SVGForeignObjectElement>
    g: SVGAttributes<SVGGElement>
    image: SVGAttributes<SVGImageElement>
    line: SVGAttributes<SVGLineElement>
    linearGradient: SVGAttributes<SVGLinearGradientElement>
    marker: SVGAttributes<SVGMarkerElement>
    mask: SVGAttributes<SVGMaskElement>
    metadata: SVGAttributes<SVGMetadataElement>
    mpath: SVGAttributes<SVGMPathElement>
    path: SVGAttributes<SVGPathElement>
    pattern: SVGAttributes<SVGPatternElement>
    polygon: SVGAttributes<SVGPolygonElement>
    polyline: SVGAttributes<SVGPolylineElement>
    radialGradient: SVGAttributes<SVGRadialGradientElement>
    rect: SVGAttributes<SVGRectElement>
    set: SVGAttributes<SVGSetElement>
    stop: SVGAttributes<SVGStopElement>
    switch: SVGAttributes<SVGSwitchElement>
    symbol: SVGAttributes<SVGSymbolElement>
    text: SVGAttributes<SVGTextElement>
    textPath: SVGAttributes<SVGTextPathElement>
    tspan: SVGAttributes<SVGTSpanElement>
    use: SVGAttributes<SVGUseElement>
    view: SVGAttributes<SVGViewElement>
  }
}
