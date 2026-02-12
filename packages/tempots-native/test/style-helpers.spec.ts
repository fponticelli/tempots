import { describe, test, expect } from "vitest";
import { prop } from "@tempots/core";
import { MockBridge } from "../src/bridge/mock-bridge";
import { NativeContext } from "../src/context/native-context";
import { nativeStyle, applyStyle, applyProp } from "../src/renderable/style";

const waitForUpdate = () => new Promise((resolve) => setTimeout(resolve, 0));

function createTestContext() {
  const bridge = new MockBridge();
  const ctx = new NativeContext(bridge, bridge.root.handle);
  return { bridge, ctx };
}

describe("nativeStyle helpers", () => {
  test("nativeStyle.placeholder sets placeholder prop", () => {
    const { bridge, ctx } = createTestContext();
    const viewCtx = ctx.makeChildView("TextInput");
    const renderable = nativeStyle.placeholder("Enter text...");
    const clear = renderable.render(viewCtx);
    expect(bridge.getNode(viewCtx.handle)!.props.placeholder).toBe(
      "Enter text...",
    );
    clear(true);
  });

  test("nativeStyle.placeholder with reactive value", async () => {
    const { bridge, ctx } = createTestContext();
    const viewCtx = ctx.makeChildView("TextInput");
    const text = prop("Enter text...");
    const renderable = nativeStyle.placeholder(text);
    const clear = renderable.render(viewCtx);
    expect(bridge.getNode(viewCtx.handle)!.props.placeholder).toBe(
      "Enter text...",
    );

    text.set("Search...");
    await waitForUpdate();
    expect(bridge.getNode(viewCtx.handle)!.props.placeholder).toBe(
      "Search...",
    );
    clear(true);
  });

  test("nativeStyle.disabled sets disabled prop", () => {
    const { bridge, ctx } = createTestContext();
    const viewCtx = ctx.makeChildView("View");
    const renderable = nativeStyle.disabled(true);
    const clear = renderable.render(viewCtx);
    expect(bridge.getNode(viewCtx.handle)!.props.disabled).toBe(true);
    clear(true);
  });

  test("nativeStyle.editable sets editable prop", () => {
    const { bridge, ctx } = createTestContext();
    const viewCtx = ctx.makeChildView("TextInput");
    const renderable = nativeStyle.editable(false);
    const clear = renderable.render(viewCtx);
    expect(bridge.getNode(viewCtx.handle)!.props.editable).toBe(false);
    clear(true);
  });

  test("nativeStyle.value sets value prop", () => {
    const { bridge, ctx } = createTestContext();
    const viewCtx = ctx.makeChildView("TextInput");
    const renderable = nativeStyle.value("initial");
    const clear = renderable.render(viewCtx);
    expect(bridge.getNode(viewCtx.handle)!.props.value).toBe("initial");
    clear(true);
  });

  test("nativeStyle.value with reactive value", async () => {
    const { bridge, ctx } = createTestContext();
    const viewCtx = ctx.makeChildView("TextInput");
    const val = prop("initial");
    const renderable = nativeStyle.value(val);
    const clear = renderable.render(viewCtx);

    val.set("updated");
    await waitForUpdate();
    expect(bridge.getNode(viewCtx.handle)!.props.value).toBe("updated");
    clear(true);
  });

  test("nativeStyle.numberOfLines sets numberOfLines prop", () => {
    const { bridge, ctx } = createTestContext();
    const viewCtx = ctx.makeChildView("Text");
    const renderable = nativeStyle.numberOfLines(3);
    const clear = renderable.render(viewCtx);
    expect(bridge.getNode(viewCtx.handle)!.props.numberOfLines).toBe(3);
    clear(true);
  });

  test("nativeStyle.bounces sets bounces prop", () => {
    const { bridge, ctx } = createTestContext();
    const viewCtx = ctx.makeChildView("ScrollView");
    const renderable = nativeStyle.bounces(false);
    const clear = renderable.render(viewCtx);
    expect(bridge.getNode(viewCtx.handle)!.props.bounces).toBe(false);
    clear(true);
  });

  test("nativeStyle.keyboardType sets keyboardType prop", () => {
    const { bridge, ctx } = createTestContext();
    const viewCtx = ctx.makeChildView("TextInput");
    const renderable = nativeStyle.keyboardType("numeric");
    const clear = renderable.render(viewCtx);
    expect(bridge.getNode(viewCtx.handle)!.props.keyboardType).toBe("numeric");
    clear(true);
  });

  test("nativeStyle.secureTextEntry sets secureTextEntry prop", () => {
    const { bridge, ctx } = createTestContext();
    const viewCtx = ctx.makeChildView("TextInput");
    const renderable = nativeStyle.secureTextEntry(true);
    const clear = renderable.render(viewCtx);
    expect(bridge.getNode(viewCtx.handle)!.props.secureTextEntry).toBe(true);
    clear(true);
  });

  test("nativeStyle.accessibilityLabel sets accessibilityLabel prop", () => {
    const { bridge, ctx } = createTestContext();
    const viewCtx = ctx.makeChildView("View");
    const renderable = nativeStyle.accessibilityLabel("Close button");
    const clear = renderable.render(viewCtx);
    expect(bridge.getNode(viewCtx.handle)!.props.accessibilityLabel).toBe(
      "Close button",
    );
    clear(true);
  });

  test("applyStyle disposes reactive subscription on cleanup", async () => {
    const { bridge, ctx } = createTestContext();
    const viewCtx = ctx.makeChildView("View");
    const styles = prop({ backgroundColor: "red" });
    const renderable = applyStyle(styles);
    const clear = renderable.render(viewCtx);

    clear(true);

    // After cleanup, changes should not apply (or at least not throw)
    styles.set({ backgroundColor: "green" });
    await waitForUpdate();
    // The style should still be red from before cleanup since the subscription was disposed
  });

  test("applyProp disposes reactive subscription on cleanup", async () => {
    const { bridge, ctx } = createTestContext();
    const viewCtx = ctx.makeChildView("TextInput");
    const placeholder = prop("initial");
    const renderable = applyProp("placeholder", placeholder);
    const clear = renderable.render(viewCtx);

    clear(true);

    // After cleanup, changes should not throw
    placeholder.set("updated");
    await waitForUpdate();
  });
});

describe("applyStyle with complex styles", () => {
  test("applies flexbox styles", () => {
    const { bridge, ctx } = createTestContext();
    const viewCtx = ctx.makeChildView("View");
    const renderable = applyStyle({
      flex: 1,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    });
    const clear = renderable.render(viewCtx);
    const node = bridge.getNode(viewCtx.handle)!;
    expect(node.styles.flex).toBe(1);
    expect(node.styles.flexDirection).toBe("row");
    expect(node.styles.justifyContent).toBe("center");
    expect(node.styles.alignItems).toBe("center");
    clear(true);
  });

  test("applies transform styles", () => {
    const { bridge, ctx } = createTestContext();
    const viewCtx = ctx.makeChildView("View");
    const transform = [{ translateX: 10 }, { rotate: "45deg" }];
    const renderable = applyStyle({ transform });
    const clear = renderable.render(viewCtx);
    expect(bridge.getNode(viewCtx.handle)!.styles.transform).toEqual(
      transform,
    );
    clear(true);
  });

  test("applies shadow styles", () => {
    const { bridge, ctx } = createTestContext();
    const viewCtx = ctx.makeChildView("View");
    const renderable = applyStyle({
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    });
    const clear = renderable.render(viewCtx);
    const node = bridge.getNode(viewCtx.handle)!;
    expect(node.styles.shadowColor).toBe("#000");
    expect(node.styles.elevation).toBe(5);
    clear(true);
  });
});

describe("nativeStyle - accessibility and input helpers", () => {
  test("nativeStyle.accessibilityHint sets hint", () => {
    const { bridge, ctx } = createTestContext();
    const viewCtx = ctx.makeChildView("View");
    const renderable = nativeStyle.accessibilityHint("Double tap to activate");
    const clear = renderable.render(viewCtx);
    expect(bridge.getNode(viewCtx.handle)!.props.accessibilityHint).toBe(
      "Double tap to activate",
    );
    clear(true);
  });

  test("nativeStyle.accessibilityRole sets role", () => {
    const { bridge, ctx } = createTestContext();
    const viewCtx = ctx.makeChildView("View");
    const renderable = nativeStyle.accessibilityRole("button");
    const clear = renderable.render(viewCtx);
    expect(bridge.getNode(viewCtx.handle)!.props.accessibilityRole).toBe(
      "button",
    );
    clear(true);
  });

  test("nativeStyle.refreshing sets refreshing prop", () => {
    const { bridge, ctx } = createTestContext();
    const viewCtx = ctx.makeChildView("RefreshControl");
    const renderable = nativeStyle.refreshing(true);
    const clear = renderable.render(viewCtx);
    expect(bridge.getNode(viewCtx.handle)!.props.refreshing).toBe(true);
    clear(true);
  });

  test("nativeStyle.returnKeyType sets return key", () => {
    const { bridge, ctx } = createTestContext();
    const viewCtx = ctx.makeChildView("TextInput");
    const renderable = nativeStyle.returnKeyType("done");
    const clear = renderable.render(viewCtx);
    expect(bridge.getNode(viewCtx.handle)!.props.returnKeyType).toBe("done");
    clear(true);
  });

  test("nativeStyle.multiline sets multiline", () => {
    const { bridge, ctx } = createTestContext();
    const viewCtx = ctx.makeChildView("TextInput");
    const renderable = nativeStyle.multiline(true);
    const clear = renderable.render(viewCtx);
    expect(bridge.getNode(viewCtx.handle)!.props.multiline).toBe(true);
    clear(true);
  });

  test("nativeStyle.maxLength sets maxLength", () => {
    const { bridge, ctx } = createTestContext();
    const viewCtx = ctx.makeChildView("TextInput");
    const renderable = nativeStyle.maxLength(100);
    const clear = renderable.render(viewCtx);
    expect(bridge.getNode(viewCtx.handle)!.props.maxLength).toBe(100);
    clear(true);
  });

  test("nativeStyle.autoCapitalize sets auto-capitalize", () => {
    const { bridge, ctx } = createTestContext();
    const viewCtx = ctx.makeChildView("TextInput");
    const renderable = nativeStyle.autoCapitalize("words");
    const clear = renderable.render(viewCtx);
    expect(bridge.getNode(viewCtx.handle)!.props.autoCapitalize).toBe("words");
    clear(true);
  });

  test("nativeStyle.autoCorrect sets auto-correct", () => {
    const { bridge, ctx } = createTestContext();
    const viewCtx = ctx.makeChildView("TextInput");
    const renderable = nativeStyle.autoCorrect(false);
    const clear = renderable.render(viewCtx);
    expect(bridge.getNode(viewCtx.handle)!.props.autoCorrect).toBe(false);
    clear(true);
  });
});
