import type { TNode } from "@tempots/core";
import type { NativeRenderable } from "../types/domain";
import { nativeRenderable, NATIVE_RENDERABLE_TYPE } from "../types/domain";
import { NativeContext } from "../context/native-context";
import { renderableOfTNode } from "./shared";

/**
 * Creates a native view renderable.
 *
 * @param viewType - The native view type (e.g. 'View', 'Text', 'Image')
 * @param children - Child renderables
 * @returns A renderable that creates the native view
 * @public
 */
export const NativeEl = (
  viewType: string,
  ...children: TNode<NativeContext, typeof NATIVE_RENDERABLE_TYPE>[]
): NativeRenderable =>
  nativeRenderable((ctx: NativeContext) => {
    const newCtx = ctx.makeChildView(viewType);
    const clears = children.map((child) =>
      renderableOfTNode(child).render(newCtx),
    );
    return (removeTree: boolean) => {
      clears.forEach((clear) => clear(false));
      newCtx.clear(removeTree);
    };
  });

/** Helper type for a view factory function. */
type ViewFactory = (
  ...children: TNode<NativeContext, typeof NATIVE_RENDERABLE_TYPE>[]
) => NativeRenderable;

/**
 * Common native view types available on both iOS and Android.
 *
 * This interface defines all recognized native view types. Accessing
 * an unknown property on the `view` proxy will cause a compile-time
 * error, catching typos early. For custom native view types, use
 * `view.custom('MyView', ...)` or call `NativeEl('MyView', ...)`
 * directly.
 *
 * @public
 */
export type NativeViewTypes = {
  // --- Core layout ---

  /** Generic container view. */
  View: ViewFactory;
  /** Text display. */
  Text: ViewFactory;
  /** Image display (use `nativeStyle.source` for the image URI). */
  Image: ViewFactory;
  /** Image as a background with children rendered on top. */
  ImageBackground: ViewFactory;

  // --- Scrolling & lists ---

  /** Scrollable container. */
  ScrollView: ViewFactory;
  /** Optimized scrollable list for large datasets. */
  FlatList: ViewFactory;
  /** Section-based list with headers. */
  SectionList: ViewFactory;
  /** Base virtualized list (used by FlatList/SectionList internally). */
  VirtualizedList: ViewFactory;

  // --- Input ---

  /** Text input field. */
  TextInput: ViewFactory;
  /** Simple platform-styled button. */
  Button: ViewFactory;
  /** Toggle switch. */
  Switch: ViewFactory;

  // --- Pressables / touchables ---

  /** Modern pressable view with configurable feedback (replaces Touchable* family). */
  Pressable: ViewFactory;
  /** Touchable view with opacity feedback. */
  TouchableOpacity: ViewFactory;
  /** Touchable with highlight feedback. */
  TouchableHighlight: ViewFactory;
  /** Touchable with no visual feedback. */
  TouchableWithoutFeedback: ViewFactory;
  /** Touchable with native platform feedback (ripple on Android). */
  TouchableNativeFeedback: ViewFactory;

  // --- Layout containers ---

  /** Container that respects device safe areas (notch, status bar). */
  SafeAreaView: ViewFactory;
  /** Container that adjusts for the keyboard. */
  KeyboardAvoidingView: ViewFactory;

  // --- Overlays & feedback ---

  /** Modal overlay. */
  Modal: ViewFactory;
  /** Status bar configuration. */
  StatusBar: ViewFactory;
  /** Loading spinner indicator. */
  ActivityIndicator: ViewFactory;
  /** Refresh control for pull-to-refresh. */
  RefreshControl: ViewFactory;

  // --- Android-specific views ---

  /** Android drawer layout navigation. */
  DrawerLayoutAndroid: ViewFactory;
  /** Android toolbar / action bar. */
  ToolbarAndroid: ViewFactory;

  // --- iOS-specific views ---

  /** iOS date/time picker. */
  DatePickerIOS: ViewFactory;

  // --- Escape hatch ---

  /**
   * Create a renderable for a custom native view type not in the
   * built-in list.
   *
   * @example
   * ```typescript
   * view.custom('MapView',
   *   nativeStyle.style({ flex: 1 }),
   *   nativeStyle.prop('region', regionSignal),
   * )
   * ```
   *
   * @param viewType - The custom native view type name
   * @param children - Child renderables
   * @returns A NativeRenderable for the custom view type
   */
  custom: (
    viewType: string,
    ...children: TNode<NativeContext, typeof NATIVE_RENDERABLE_TYPE>[]
  ) => NativeRenderable;
};

/**
 * A convenience object to create renderables for native views.
 *
 * @example
 * ```typescript
 * view.View(
 *   view.Text('Hello, World!'),
 *   view.Image(nativeStyle.source({ uri: 'https://example.com/image.png' }))
 * )
 * ```
 *
 * @public
 */
export const view = new Proxy({} as NativeViewTypes, {
  get: (_, prop: string) => {
    if (prop === "custom") {
      return (
        viewType: string,
        ...children: TNode<NativeContext, typeof NATIVE_RENDERABLE_TYPE>[]
      ) => NativeEl(viewType, ...children);
    }
    return (
      ...children: TNode<NativeContext, typeof NATIVE_RENDERABLE_TYPE>[]
    ) => NativeEl(prop, ...children);
  },
});
