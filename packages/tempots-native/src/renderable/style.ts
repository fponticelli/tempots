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

  /** Set accessibility label (VoiceOver on iOS, TalkBack on Android). */
  accessibilityLabel: (label: Value<string>): NativeRenderable =>
    applyProp("accessibilityLabel", label),

  /** Set accessibility hint text. */
  accessibilityHint: (hint: Value<string>): NativeRenderable =>
    applyProp("accessibilityHint", hint),

  /**
   * Set the accessibility role (e.g. 'button', 'header', 'link', 'image').
   * Used by both VoiceOver (iOS) and TalkBack (Android).
   */
  accessibilityRole: (
    role: Value<
      | "none"
      | "button"
      | "link"
      | "search"
      | "image"
      | "text"
      | "adjustable"
      | "header"
      | "summary"
      | "alert"
      | "checkbox"
      | "radio"
      | "menu"
      | "progressbar"
      | "timer"
    >,
  ): NativeRenderable => applyProp("accessibilityRole", role),

  /** Set whether the view is refreshing (for RefreshControl). */
  refreshing: (value: Value<boolean>): NativeRenderable =>
    applyProp("refreshing", value),

  /** Set the return key type for TextInput. */
  returnKeyType: (
    type: Value<"done" | "go" | "next" | "search" | "send" | "default">,
  ): NativeRenderable => applyProp("returnKeyType", type),

  /** Set multiline mode for TextInput. */
  multiline: (value: Value<boolean>): NativeRenderable =>
    applyProp("multiline", value),

  /** Set max length for TextInput. */
  maxLength: (length: Value<number>): NativeRenderable =>
    applyProp("maxLength", length),

  /** Set auto-capitalize mode for TextInput. */
  autoCapitalize: (
    mode: Value<"none" | "sentences" | "words" | "characters">,
  ): NativeRenderable => applyProp("autoCapitalize", mode),

  /** Set auto-correct for TextInput. */
  autoCorrect: (value: Value<boolean>): NativeRenderable =>
    applyProp("autoCorrect", value),

  // --- Image props ---

  /** Set how the image should be resized to fit its container. */
  resizeMode: (
    mode: Value<"cover" | "contain" | "stretch" | "repeat" | "center">,
  ): NativeRenderable => applyProp("resizeMode", mode),

  // --- ScrollView / FlatList props ---

  /** Set whether the list scrolls horizontally. */
  horizontal: (value: Value<boolean>): NativeRenderable =>
    applyProp("horizontal", value),

  /** Show or hide the vertical scroll indicator. */
  showsVerticalScrollIndicator: (value: Value<boolean>): NativeRenderable =>
    applyProp("showsVerticalScrollIndicator", value),

  /** Show or hide the horizontal scroll indicator. */
  showsHorizontalScrollIndicator: (value: Value<boolean>): NativeRenderable =>
    applyProp("showsHorizontalScrollIndicator", value),

  /** Enable or disable paging for ScrollView. */
  pagingEnabled: (value: Value<boolean>): NativeRenderable =>
    applyProp("pagingEnabled", value),

  /** Enable or disable scroll for ScrollView. */
  scrollEnabled: (value: Value<boolean>): NativeRenderable =>
    applyProp("scrollEnabled", value),

  // --- View props ---

  /**
   * Controls whether the view can receive touch events.
   * - 'auto': default behavior
   * - 'none': touch passes through
   * - 'box-none': view ignores touch but children can receive it
   * - 'box-only': view receives touch but children cannot
   */
  pointerEvents: (
    value: Value<"auto" | "none" | "box-none" | "box-only">,
  ): NativeRenderable => applyProp("pointerEvents", value),

  /**
   * Extends the touchable area without changing the view's layout.
   * Useful for making small buttons easier to tap.
   */
  hitSlop: (
    value: Value<
      number | { top?: number; right?: number; bottom?: number; left?: number }
    >,
  ): NativeRenderable => applyProp("hitSlop", value),
};
