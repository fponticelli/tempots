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

/**
 * Common native view types.
 * @public
 */
export type NativeViewTypes = {
  View: (
    ...children: TNode<NativeContext, typeof NATIVE_RENDERABLE_TYPE>[]
  ) => NativeRenderable;
  Text: (
    ...children: TNode<NativeContext, typeof NATIVE_RENDERABLE_TYPE>[]
  ) => NativeRenderable;
  Image: (
    ...children: TNode<NativeContext, typeof NATIVE_RENDERABLE_TYPE>[]
  ) => NativeRenderable;
  ScrollView: (
    ...children: TNode<NativeContext, typeof NATIVE_RENDERABLE_TYPE>[]
  ) => NativeRenderable;
  FlatList: (
    ...children: TNode<NativeContext, typeof NATIVE_RENDERABLE_TYPE>[]
  ) => NativeRenderable;
  TextInput: (
    ...children: TNode<NativeContext, typeof NATIVE_RENDERABLE_TYPE>[]
  ) => NativeRenderable;
  TouchableOpacity: (
    ...children: TNode<NativeContext, typeof NATIVE_RENDERABLE_TYPE>[]
  ) => NativeRenderable;
  SafeAreaView: (
    ...children: TNode<NativeContext, typeof NATIVE_RENDERABLE_TYPE>[]
  ) => NativeRenderable;
  StatusBar: (
    ...children: TNode<NativeContext, typeof NATIVE_RENDERABLE_TYPE>[]
  ) => NativeRenderable;
  Modal: (
    ...children: TNode<NativeContext, typeof NATIVE_RENDERABLE_TYPE>[]
  ) => NativeRenderable;
  ActivityIndicator: (
    ...children: TNode<NativeContext, typeof NATIVE_RENDERABLE_TYPE>[]
  ) => NativeRenderable;
  Switch: (
    ...children: TNode<NativeContext, typeof NATIVE_RENDERABLE_TYPE>[]
  ) => NativeRenderable;
  KeyboardAvoidingView: (
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
