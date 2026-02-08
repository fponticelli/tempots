import { Signal, Value } from "@tempots/core";
import type { NativeRenderable } from "../types/domain";
import { nativeRenderable } from "../types/domain";
import type { NativeContext } from "../context/native-context";
import type { ViewStyle, TextStyle, ImageSource } from "../types/view-types";

/**
 * Applies static or reactive styles to the current native view.
 *
 * @param styles - A static style object or a signal of styles
 * @returns A renderable that applies the styles
 * @public
 */
export const applyStyle = (
  styles: Value<ViewStyle | TextStyle>,
): NativeRenderable =>
  nativeRenderable((ctx: NativeContext) => {
    if (Signal.is(styles)) {
      const sig = styles as Signal<ViewStyle | TextStyle>;
      const dispose = sig.on((s) => ctx.setStyle(s as Record<string, unknown>));
      return () => dispose();
    } else {
      ctx.setStyle(styles as Record<string, unknown>);
      return () => {};
    }
  });

/**
 * Applies a single view property reactively.
 *
 * @param name - The property name
 * @param value - Static or reactive value
 * @returns A renderable that applies the property
 * @public
 */
export const applyProp = (
  name: string,
  value: Value<unknown>,
): NativeRenderable =>
  nativeRenderable((ctx: NativeContext) => {
    if (Signal.is(value)) {
      const sig = value as Signal<unknown>;
      const dispose = sig.on((v) => ctx.setProp(name, v));
      return () => dispose();
    } else {
      ctx.setProp(name, value);
      return () => {};
    }
  });

/**
 * Convenience object for applying common native style properties.
 * @public
 */
export const nativeStyle = {
  /** Apply a full style object. */
  style: applyStyle,

  /** Apply a single prop. */
  prop: applyProp,

  /** Set the image source. */
  source: (source: Value<ImageSource>): NativeRenderable =>
    applyProp("source", source),

  /** Set the placeholder text for TextInput. */
  placeholder: (text: Value<string>): NativeRenderable =>
    applyProp("placeholder", text),

  /** Set whether a view is disabled. */
  disabled: (value: Value<boolean>): NativeRenderable =>
    applyProp("disabled", value),

  /** Set whether a view is editable. */
  editable: (value: Value<boolean>): NativeRenderable =>
    applyProp("editable", value),

  /** Set the content for a TextInput. */
  value: (text: Value<string>): NativeRenderable => applyProp("value", text),

  /** Set the number of lines for Text. */
  numberOfLines: (lines: Value<number>): NativeRenderable =>
    applyProp("numberOfLines", lines),

  /** Set whether a ScrollView bounces. */
  bounces: (value: Value<boolean>): NativeRenderable =>
    applyProp("bounces", value),

  /** Set the keyboard type for TextInput. */
  keyboardType: (
    type: Value<
      | "default"
      | "numeric"
      | "email-address"
      | "phone-pad"
      | "decimal-pad"
      | "url"
    >,
  ): NativeRenderable => applyProp("keyboardType", type),

  /** Set whether text input is secure (password). */
  secureTextEntry: (value: Value<boolean>): NativeRenderable =>
    applyProp("secureTextEntry", value),

  /** Set the testID for testing. */
  testID: (id: string): NativeRenderable => applyProp("testID", id),

  /** Set accessibility label. */
  accessibilityLabel: (label: Value<string>): NativeRenderable =>
    applyProp("accessibilityLabel", label),
};
