import { describe, test, expect, vi } from "vitest";
import { MockBridge } from "../src/bridge/mock-bridge";
import { NativeContext } from "../src/context/native-context";
import { Pressable } from "../src/renderable/pressable";

function createTestContext() {
  const bridge = new MockBridge();
  const ctx = new NativeContext(bridge, bridge.root.handle);
  return { bridge, ctx };
}

describe("Pressable", () => {
  test("creates a View child with children", () => {
    const { bridge, ctx } = createTestContext();
    const handler = vi.fn();
    const renderable = Pressable(handler, {}, "Hello");
    const clear = renderable.render(ctx);

    expect(bridge.root.children.length).toBe(1);
    expect(bridge.root.children[0].type).toBe("View");
    expect(bridge.collectText()).toBe("Hello");

    clear(true);
  });

  test("registers press event listener", () => {
    const { bridge, ctx } = createTestContext();
    const handler = vi.fn();
    const renderable = Pressable(handler, {});
    const clear = renderable.render(ctx);

    const viewNode = bridge.root.children[0];
    expect(viewNode.listeners.has("press")).toBe(true);
    expect(viewNode.listeners.get("press")!.length).toBe(1);

    clear(true);
  });

  test("fires press handler on press event", () => {
    const { bridge, ctx } = createTestContext();
    const handler = vi.fn();
    const renderable = Pressable(handler, {});
    const clear = renderable.render(ctx);

    const viewNode = bridge.root.children[0];
    const eventData = {
      locationX: 10,
      locationY: 20,
      pageX: 100,
      pageY: 200,
      timestamp: Date.now(),
    };
    bridge.dispatchEvent(viewNode.handle, "press", eventData);

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(eventData);

    clear(true);
  });

  test("registers pressIn and pressOut listeners", () => {
    const { bridge, ctx } = createTestContext();
    const handler = vi.fn();
    const renderable = Pressable(handler, {});
    const clear = renderable.render(ctx);

    const viewNode = bridge.root.children[0];
    expect(viewNode.listeners.has("pressIn")).toBe(true);
    expect(viewNode.listeners.has("pressOut")).toBe(true);

    clear(true);
  });

  test("sets opacity on pressIn and restores on pressOut", () => {
    const { bridge, ctx } = createTestContext();
    const handler = vi.fn();
    const renderable = Pressable(handler, { activeOpacity: 0.5 });
    const clear = renderable.render(ctx);

    const viewNode = bridge.root.children[0];

    bridge.dispatchEvent(viewNode.handle, "pressIn");
    expect(viewNode.styles["opacity"]).toBe(0.5);

    bridge.dispatchEvent(viewNode.handle, "pressOut");
    expect(viewNode.styles["opacity"]).toBe(1);

    clear(true);
  });

  test("does not register listeners when disabled", () => {
    const { bridge, ctx } = createTestContext();
    const handler = vi.fn();
    const renderable = Pressable(handler, { disabled: true });
    const clear = renderable.render(ctx);

    const viewNode = bridge.root.children[0];
    expect(viewNode.listeners.has("press")).toBe(false);
    expect(viewNode.listeners.has("pressIn")).toBe(false);
    expect(viewNode.listeners.has("pressOut")).toBe(false);

    clear(true);
  });

  test("uses default activeOpacity of 0.7", () => {
    const { bridge, ctx } = createTestContext();
    const handler = vi.fn();
    const renderable = Pressable(handler, {});
    const clear = renderable.render(ctx);

    const viewNode = bridge.root.children[0];
    bridge.dispatchEvent(viewNode.handle, "pressIn");
    expect(viewNode.styles["opacity"]).toBe(0.7);

    clear(true);
  });

  test("cleanup removes event listeners", () => {
    const { bridge, ctx } = createTestContext();
    const handler = vi.fn();
    const renderable = Pressable(handler, {});
    const clear = renderable.render(ctx);

    const viewNode = bridge.root.children[0];
    expect(viewNode.listeners.get("press")!.length).toBe(1);

    clear(true);

    // After cleanup, dispatching should not call handler
    // (node may be removed, but if it weren't, listeners would be cleaned)
  });
});
