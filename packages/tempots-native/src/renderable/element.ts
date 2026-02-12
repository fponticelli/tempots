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
 * The `view` proxy supports any string view type, but this interface
 * provides autocomplete for the most commonly used ones.
 *
 * @public
 */
export type NativeViewTypes = {
  // --- Cross-platform views ---

  /** Generic container view. */
  View: ViewFactory;
  /** Text display. */
  Text: ViewFactory;
  /** Image display (use `nativeStyle.source` for the image URI). */
  Image: ViewFactory;
  /** Scrollable container. */
  ScrollView: ViewFactory;
  /** Optimized scrollable list for large datasets. */
  FlatList: ViewFactory;
  /** Text input field. */
  TextInput: ViewFactory;
  /** Touchable view with opacity feedback. */
  TouchableOpacity: ViewFactory;
  /** Container that respects device safe areas (notch, status bar). */
  SafeAreaView: ViewFactory;
  /** Status bar configuration. */
  StatusBar: ViewFactory;
  /** Modal overlay. */
  Modal: ViewFactory;
  /** Loading spinner indicator. */
  ActivityIndicator: ViewFactory;
  /** Toggle switch. */
  Switch: ViewFactory;
  /** Container that adjusts for the keyboard. */
  KeyboardAvoidingView: ViewFactory;
  /** Section-based list. */
  SectionList: ViewFactory;
  /** Touchable with no visual feedback. */
  TouchableWithoutFeedback: ViewFactory;
  /** Touchable with highlight feedback. */
  TouchableHighlight: ViewFactory;
  /** Touchable with native platform feedback (ripple on Android). */
  TouchableNativeFeedback: ViewFactory;
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
export const view = new Proxy(
  {} as NativeViewTypes &
    Record<
      string,
      (
        ...children: TNode<NativeContext, typeof NATIVE_RENDERABLE_TYPE>[]
      ) => NativeRenderable
    >,
  {
    get: (_, viewType: string) => {
      return (
        ...children: TNode<NativeContext, typeof NATIVE_RENDERABLE_TYPE>[]
      ) => NativeEl(viewType, ...children);
    },
  },
);
