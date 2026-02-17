/**
 * Event emitted on press gestures.
 * @public
 */
export interface PressEvent {
  readonly locationX: number
  readonly locationY: number
  readonly pageX: number
  readonly pageY: number
  readonly timestamp: number
}

/**
 * Event emitted on long press gestures.
 * @public
 */
export interface LongPressEvent extends PressEvent {
  readonly duration: number
}

/**
 * Event emitted on scroll gestures.
 * @public
 */
export interface ScrollEvent {
  readonly contentOffset: { x: number; y: number }
  readonly contentSize: { width: number; height: number }
  readonly layoutMeasurement: { width: number; height: number }
}

/**
 * Event emitted when text input changes.
 * @public
 */
export interface TextChangeEvent {
  readonly text: string
}

/**
 * Event emitted on text input submit.
 * @public
 */
export interface TextSubmitEvent {
  readonly text: string
}

/**
 * Event emitted on text input focus changes.
 * @public
 */
export interface FocusEvent {
  readonly focused: boolean
}

/**
 * Layout measurement result.
 * @public
 */
export interface LayoutEvent {
  readonly x: number
  readonly y: number
  readonly width: number
  readonly height: number
}

/**
 * Event emitted when a Switch value changes.
 * @public
 */
export interface ValueChangeEvent {
  readonly value: boolean
}

/**
 * Event emitted on pull-to-refresh.
 * @public
 */
export interface RefreshEvent {
  readonly refreshing: boolean
}

/**
 * Event emitted when a FlatList/SectionList reaches the end of its content.
 * Used for infinite scroll / pagination.
 * @public
 */
export interface EndReachedEvent {
  readonly distanceFromEnd: number
}

/**
 * Event emitted when content size changes (e.g. TextInput auto-growing).
 * @public
 */
export interface ContentSizeChangeEvent {
  readonly contentWidth: number
  readonly contentHeight: number
}

/**
 * Event emitted at the end of a scroll momentum phase
 * (after the user lifts their finger and the scroll decelerates to a stop).
 * Same shape as ScrollEvent.
 * @public
 */
export type MomentumScrollEndEvent = ScrollEvent

/**
 * Event emitted when the user starts or stops dragging the scroll view.
 * Same shape as ScrollEvent.
 * @public
 */
export type ScrollDragEvent = ScrollEvent
