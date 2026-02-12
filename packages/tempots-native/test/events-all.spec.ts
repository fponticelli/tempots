import { describe, test, expect, vi } from "vitest";
import { MockBridge } from "../src/bridge/mock-bridge";
import { NativeContext } from "../src/context/native-context";
import { nativeOn } from "../src/renderable/events";

function createTestContext() {
  const bridge = new MockBridge();
  const ctx = new NativeContext(bridge, bridge.root.handle);
  return { bridge, ctx };
}

describe("nativeOn - all event types", () => {
  test("nativeOn.longPress handles long press events", () => {
    const { bridge, ctx } = createTestContext();
    const viewCtx = ctx.makeChildView("View");
    const handler = vi.fn();
    const renderable = nativeOn.longPress(handler);
    const clear = renderable.render(viewCtx);

    const event = {
      locationX: 10,
      locationY: 20,
      pageX: 100,
      pageY: 200,
      timestamp: Date.now(),
      duration: 500,
    };
    bridge.dispatchEvent(viewCtx.handle, "longPress", event);

    expect(handler).toHaveBeenCalledWith(event);
    clear(true);
  });

  test("nativeOn.pressIn handles pressIn events", () => {
    const { bridge, ctx } = createTestContext();
    const viewCtx = ctx.makeChildView("View");
    const handler = vi.fn();
    const renderable = nativeOn.pressIn(handler);
    const clear = renderable.render(viewCtx);

    bridge.dispatchEvent(viewCtx.handle, "pressIn", {
      locationX: 5,
      locationY: 5,
      pageX: 50,
      pageY: 50,
      timestamp: Date.now(),
    });

    expect(handler).toHaveBeenCalledTimes(1);
    clear(true);
  });

  test("nativeOn.pressOut handles pressOut events", () => {
    const { bridge, ctx } = createTestContext();
    const viewCtx = ctx.makeChildView("View");
    const handler = vi.fn();
    const renderable = nativeOn.pressOut(handler);
    const clear = renderable.render(viewCtx);

    bridge.dispatchEvent(viewCtx.handle, "pressOut", {
      locationX: 5,
      locationY: 5,
      pageX: 50,
      pageY: 50,
      timestamp: Date.now(),
    });

    expect(handler).toHaveBeenCalledTimes(1);
    clear(true);
  });

  test("nativeOn.scroll handles scroll events", () => {
    const { bridge, ctx } = createTestContext();
    const viewCtx = ctx.makeChildView("ScrollView");
    const handler = vi.fn();
    const renderable = nativeOn.scroll(handler);
    const clear = renderable.render(viewCtx);

    const scrollEvent = {
      contentOffset: { x: 0, y: 100 },
      contentSize: { width: 375, height: 2000 },
      layoutMeasurement: { width: 375, height: 812 },
    };
    bridge.dispatchEvent(viewCtx.handle, "scroll", scrollEvent);

    expect(handler).toHaveBeenCalledWith(scrollEvent);
    clear(true);
  });

  test("nativeOn.submitEditing handles submit events", () => {
    const { bridge, ctx } = createTestContext();
    const viewCtx = ctx.makeChildView("TextInput");
    const handler = vi.fn();
    const renderable = nativeOn.submitEditing(handler);
    const clear = renderable.render(viewCtx);

    bridge.dispatchEvent(viewCtx.handle, "submitEditing", {
      text: "submitted text",
    });

    expect(handler).toHaveBeenCalledWith({ text: "submitted text" });
    clear(true);
  });

  test("nativeOn.focus handles focus events", () => {
    const { bridge, ctx } = createTestContext();
    const viewCtx = ctx.makeChildView("TextInput");
    const handler = vi.fn();
    const renderable = nativeOn.focus(handler);
    const clear = renderable.render(viewCtx);

    bridge.dispatchEvent(viewCtx.handle, "focus", { focused: true });

    expect(handler).toHaveBeenCalledWith({ focused: true });
    clear(true);
  });

  test("nativeOn.blur handles blur events", () => {
    const { bridge, ctx } = createTestContext();
    const viewCtx = ctx.makeChildView("TextInput");
    const handler = vi.fn();
    const renderable = nativeOn.blur(handler);
    const clear = renderable.render(viewCtx);

    bridge.dispatchEvent(viewCtx.handle, "blur", { focused: false });

    expect(handler).toHaveBeenCalledWith({ focused: false });
    clear(true);
  });

  test("multiple event listeners on same view", () => {
    const { bridge, ctx } = createTestContext();
    const viewCtx = ctx.makeChildView("View");
    const pressHandler = vi.fn();
    const layoutHandler = vi.fn();

    const clear1 = nativeOn.press(pressHandler).render(viewCtx);
    const clear2 = nativeOn.layout(layoutHandler).render(viewCtx);

    bridge.dispatchEvent(viewCtx.handle, "press", {
      locationX: 0,
      locationY: 0,
      pageX: 0,
      pageY: 0,
      timestamp: Date.now(),
    });

    bridge.dispatchEvent(viewCtx.handle, "layout", {
      x: 0,
      y: 0,
      width: 100,
      height: 50,
    });

    expect(pressHandler).toHaveBeenCalledTimes(1);
    expect(layoutHandler).toHaveBeenCalledTimes(1);

    clear1(true);
    clear2(true);
  });

  test("cleanup stops receiving events", () => {
    const { bridge, ctx } = createTestContext();
    const viewCtx = ctx.makeChildView("View");
    const handler = vi.fn();
    const clear = nativeOn.press(handler).render(viewCtx);

    bridge.dispatchEvent(viewCtx.handle, "press");
    expect(handler).toHaveBeenCalledTimes(1);

    clear(true);
    bridge.dispatchEvent(viewCtx.handle, "press");
    expect(handler).toHaveBeenCalledTimes(1);
  });

  test("nativeOn.valueChange handles switch toggle events", () => {
    const { bridge, ctx } = createTestContext();
    const viewCtx = ctx.makeChildView("Switch");
    const handler = vi.fn();
    const renderable = nativeOn.valueChange(handler);
    const clear = renderable.render(viewCtx);

    bridge.dispatchEvent(viewCtx.handle, "valueChange", { value: true });
    expect(handler).toHaveBeenCalledWith({ value: true });

    bridge.dispatchEvent(viewCtx.handle, "valueChange", { value: false });
    expect(handler).toHaveBeenCalledWith({ value: false });
    expect(handler).toHaveBeenCalledTimes(2);
    clear(true);
  });

  test("nativeOn.refresh handles pull-to-refresh events", () => {
    const { bridge, ctx } = createTestContext();
    const viewCtx = ctx.makeChildView("RefreshControl");
    const handler = vi.fn();
    const renderable = nativeOn.refresh(handler);
    const clear = renderable.render(viewCtx);

    bridge.dispatchEvent(viewCtx.handle, "refresh", { refreshing: true });
    expect(handler).toHaveBeenCalledWith({ refreshing: true });
    clear(true);
  });
});
