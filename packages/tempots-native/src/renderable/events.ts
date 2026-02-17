import type { NativeRenderable } from '../types/domain'
import { nativeRenderable } from '../types/domain'
import type { NativeContext } from '../context/native-context'
import type {
  PressEvent,
  LongPressEvent,
  ScrollEvent,
  TextChangeEvent,
  TextSubmitEvent,
  FocusEvent,
  LayoutEvent,
  ValueChangeEvent,
  RefreshEvent,
  EndReachedEvent,
  ContentSizeChangeEvent,
  MomentumScrollEndEvent,
  ScrollDragEvent,
} from '../types/event-types'

/**
 * Creates a renderable that attaches an event listener to the current view.
 *
 * @param event - The event name
 * @param handler - The event handler
 * @returns A renderable that manages the event listener lifecycle
 * @internal
 */
const onEvent = <E>(event: string, handler: (e: E) => void): NativeRenderable =>
  nativeRenderable((ctx: NativeContext) => {
    const clear = ctx.on(event, handler)
    return () => clear()
  })

/**
 * Event listeners for native views.
 * @public
 */
export const nativeOn = {
  /** Listen for press events. */
  press: (handler: (e: PressEvent) => void): NativeRenderable =>
    onEvent('press', handler),

  /** Listen for long press events. */
  longPress: (handler: (e: LongPressEvent) => void): NativeRenderable =>
    onEvent('longPress', handler),

  /** Listen for press-in events. */
  pressIn: (handler: (e: PressEvent) => void): NativeRenderable =>
    onEvent('pressIn', handler),

  /** Listen for press-out events. */
  pressOut: (handler: (e: PressEvent) => void): NativeRenderable =>
    onEvent('pressOut', handler),

  /** Listen for scroll events. */
  scroll: (handler: (e: ScrollEvent) => void): NativeRenderable =>
    onEvent('scroll', handler),

  /** Listen for text change events. */
  changeText: (handler: (e: TextChangeEvent) => void): NativeRenderable =>
    onEvent('changeText', handler),

  /** Listen for text submit events. */
  submitEditing: (handler: (e: TextSubmitEvent) => void): NativeRenderable =>
    onEvent('submitEditing', handler),

  /** Listen for focus events. */
  focus: (handler: (e: FocusEvent) => void): NativeRenderable =>
    onEvent('focus', handler),

  /** Listen for blur events. */
  blur: (handler: (e: FocusEvent) => void): NativeRenderable =>
    onEvent('blur', handler),

  /** Listen for layout events. */
  layout: (handler: (e: LayoutEvent) => void): NativeRenderable =>
    onEvent('layout', handler),

  /** Listen for value change events (e.g. Switch toggle). */
  valueChange: (handler: (e: ValueChangeEvent) => void): NativeRenderable =>
    onEvent('valueChange', handler),

  /** Listen for refresh events (e.g. pull-to-refresh). */
  refresh: (handler: (e: RefreshEvent) => void): NativeRenderable =>
    onEvent('refresh', handler),

  /** Listen for end-reached events (FlatList/SectionList infinite scroll). */
  endReached: (handler: (e: EndReachedEvent) => void): NativeRenderable =>
    onEvent('endReached', handler),

  /** Listen for content size change events (auto-growing TextInput). */
  contentSizeChange: (
    handler: (e: ContentSizeChangeEvent) => void
  ): NativeRenderable => onEvent('contentSizeChange', handler),

  /** Listen for momentum scroll end events (pagination / snap). */
  momentumScrollEnd: (
    handler: (e: MomentumScrollEndEvent) => void
  ): NativeRenderable => onEvent('momentumScrollEnd', handler),

  /** Listen for scroll drag begin events. */
  scrollBeginDrag: (handler: (e: ScrollDragEvent) => void): NativeRenderable =>
    onEvent('scrollBeginDrag', handler),

  /** Listen for scroll drag end events. */
  scrollEndDrag: (handler: (e: ScrollDragEvent) => void): NativeRenderable =>
    onEvent('scrollEndDrag', handler),
}
