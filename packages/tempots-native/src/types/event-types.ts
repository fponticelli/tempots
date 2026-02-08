/**
 * Event emitted on press gestures.
 * @public
 */
export interface PressEvent {
  readonly locationX: number;
  readonly locationY: number;
  readonly pageX: number;
  readonly pageY: number;
  readonly timestamp: number;
}

/**
 * Event emitted on long press gestures.
 * @public
 */
export interface LongPressEvent extends PressEvent {
  readonly duration: number;
}

/**
 * Event emitted on scroll gestures.
 * @public
 */
export interface ScrollEvent {
  readonly contentOffset: { x: number; y: number };
  readonly contentSize: { width: number; height: number };
  readonly layoutMeasurement: { width: number; height: number };
}

/**
 * Event emitted when text input changes.
 * @public
 */
export interface TextChangeEvent {
  readonly text: string;
}

/**
 * Event emitted on text input submit.
 * @public
 */
export interface TextSubmitEvent {
  readonly text: string;
}

/**
 * Event emitted on text input focus changes.
 * @public
 */
export interface FocusEvent {
  readonly focused: boolean;
}

/**
 * Layout measurement result.
 * @public
 */
export interface LayoutEvent {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}
