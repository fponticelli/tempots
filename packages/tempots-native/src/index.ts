// Bridge
export type { JSIBridge, NativeViewHandle } from "./bridge/jsi-bridge";
export { MockBridge } from "./bridge/mock-bridge";
export type { MockNode } from "./bridge/mock-bridge";

// Context
export { NativeContext } from "./context/native-context";

// Types
export { NATIVE_RENDERABLE_TYPE, nativeRenderable } from "./types/domain";
export type { NativeRenderable } from "./types/domain";
export type { ViewStyle, TextStyle, ImageSource } from "./types/view-types";
export type {
  PressEvent,
  LongPressEvent,
  ScrollEvent,
  TextChangeEvent,
  TextSubmitEvent,
  FocusEvent,
  LayoutEvent,
} from "./types/event-types";

// Shared renderables (from @tempots/render via native kit)
export {
  Empty,
  Fragment,
  When,
  Unless,
  ForEach,
  Repeat,
  OneOf,
  OneOfField,
  OneOfKind,
  OneOfType,
  OneOfValue,
  OneOfTuple,
  MapSignal,
  Ensure,
  EnsureAll,
  NotEmpty,
  Task,
  Async,
  OnDispose,
  Conjunction,
  WithScope,
  WithProvider,
  Provide,
  Use,
  UseMany,
  handleValueOrSignal,
  createReactiveRenderable,
  renderableOfTNode,
} from "./renderable/shared";

// Native-specific renderables
export { NativeEl, view } from "./renderable/element";
export type { NativeViewTypes } from "./renderable/element";
export { applyStyle, applyProp, nativeStyle } from "./renderable/style";
export { nativeOn } from "./renderable/events";
export { Pressable } from "./renderable/pressable";
export type { PressableOptions } from "./renderable/pressable";

// Navigation
export { createNavigator } from "./navigation/navigator";
export type { Navigator } from "./navigation/navigator";

// Lifecycle
export { createAppStateSignal } from "./lifecycle/app-state";
export type { AppState } from "./lifecycle/app-state";
export { createDimensionsSignal } from "./lifecycle/dimensions";
export type { ScreenDimensions } from "./lifecycle/dimensions";
export { createKeyboardSignal } from "./lifecycle/keyboard";
export type { KeyboardState } from "./lifecycle/keyboard";

// Platform
export { renderNative } from "./platform/init";
export type { RenderNativeOptions } from "./platform/init";

// Re-export from @tempots/render for downstream consumers
export type { BaseRenderContext } from "@tempots/render";
export { createRenderKit } from "@tempots/render";
export type { RenderKitConfig, RenderKit } from "@tempots/render";
