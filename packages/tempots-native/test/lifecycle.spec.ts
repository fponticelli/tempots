import { describe, test, expect } from "vitest";
import { MockBridge } from "../src/bridge/mock-bridge";
import { createAppStateSignal } from "../src/lifecycle/app-state";
import { createDimensionsSignal } from "../src/lifecycle/dimensions";
import { createKeyboardSignal } from "../src/lifecycle/keyboard";

describe("createAppStateSignal", () => {
  test("initializes with active state", () => {
    const bridge = new MockBridge();
    const state = createAppStateSignal(bridge);
    expect(state.value).toBe("active");
  });

  test("updates to background when event dispatched", () => {
    const bridge = new MockBridge();
    const state = createAppStateSignal(bridge);

    bridge.dispatchEvent(0, "appStateChange", { state: "background" });
    expect(state.value).toBe("background");
  });

  test("updates to inactive when event dispatched", () => {
    const bridge = new MockBridge();
    const state = createAppStateSignal(bridge);

    bridge.dispatchEvent(0, "appStateChange", { state: "inactive" });
    expect(state.value).toBe("inactive");
  });

  test("transitions back to active from background", () => {
    const bridge = new MockBridge();
    const state = createAppStateSignal(bridge);

    bridge.dispatchEvent(0, "appStateChange", { state: "background" });
    expect(state.value).toBe("background");

    bridge.dispatchEvent(0, "appStateChange", { state: "active" });
    expect(state.value).toBe("active");
  });

  test("signal listeners are notified on state change", () => {
    const bridge = new MockBridge();
    const state = createAppStateSignal(bridge);

    const states: string[] = [];
    // .on() fires immediately with current value, so skip the initial "active"
    state.on((s) => states.push(s));

    bridge.dispatchEvent(0, "appStateChange", { state: "background" });
    bridge.dispatchEvent(0, "appStateChange", { state: "inactive" });
    bridge.dispatchEvent(0, "appStateChange", { state: "active" });

    expect(states).toEqual(["active", "background", "inactive", "active"]);
  });
});

describe("createDimensionsSignal", () => {
  test("initializes with default dimensions", () => {
    const bridge = new MockBridge();
    const dims = createDimensionsSignal(bridge);
    expect(dims.value).toEqual({
      width: 375,
      height: 812,
      scale: 3,
      fontScale: 1,
    });
  });

  test("initializes with custom dimensions", () => {
    const bridge = new MockBridge();
    const custom = { width: 390, height: 844, scale: 3, fontScale: 1 };
    const dims = createDimensionsSignal(bridge, custom);
    expect(dims.value).toEqual(custom);
  });

  test("updates on dimensionsChange event", () => {
    const bridge = new MockBridge();
    const dims = createDimensionsSignal(bridge);

    const newDims = { width: 768, height: 1024, scale: 2, fontScale: 1 };
    bridge.dispatchEvent(0, "dimensionsChange", newDims);
    expect(dims.value).toEqual(newDims);
  });

  test("handles rotation (landscape)", () => {
    const bridge = new MockBridge();
    const dims = createDimensionsSignal(bridge);

    bridge.dispatchEvent(0, "dimensionsChange", {
      width: 812,
      height: 375,
      scale: 3,
      fontScale: 1,
    });
    expect(dims.value.width).toBe(812);
    expect(dims.value.height).toBe(375);
  });

  test("handles font scale changes", () => {
    const bridge = new MockBridge();
    const dims = createDimensionsSignal(bridge);

    bridge.dispatchEvent(0, "dimensionsChange", {
      width: 375,
      height: 812,
      scale: 3,
      fontScale: 1.5,
    });
    expect(dims.value.fontScale).toBe(1.5);
  });

  test("signal listeners are notified on dimension change", () => {
    const bridge = new MockBridge();
    const dims = createDimensionsSignal(bridge);

    let notified = false;
    dims.on(() => {
      notified = true;
    });

    bridge.dispatchEvent(0, "dimensionsChange", {
      width: 414,
      height: 896,
      scale: 3,
      fontScale: 1,
    });
    expect(notified).toBe(true);
  });
});

describe("createKeyboardSignal", () => {
  test("initializes with hidden state", () => {
    const bridge = new MockBridge();
    const keyboard = createKeyboardSignal(bridge);
    expect(keyboard.value).toEqual({ visible: false, height: 0 });
  });

  test("updates to visible on keyboardShow", () => {
    const bridge = new MockBridge();
    const keyboard = createKeyboardSignal(bridge);

    bridge.dispatchEvent(0, "keyboardShow", { height: 300 });
    expect(keyboard.value).toEqual({ visible: true, height: 300 });
  });

  test("updates to hidden on keyboardHide", () => {
    const bridge = new MockBridge();
    const keyboard = createKeyboardSignal(bridge);

    bridge.dispatchEvent(0, "keyboardShow", { height: 300 });
    expect(keyboard.value.visible).toBe(true);

    bridge.dispatchEvent(0, "keyboardHide");
    expect(keyboard.value).toEqual({ visible: false, height: 0 });
  });

  test("tracks keyboard height changes", () => {
    const bridge = new MockBridge();
    const keyboard = createKeyboardSignal(bridge);

    bridge.dispatchEvent(0, "keyboardShow", { height: 250 });
    expect(keyboard.value.height).toBe(250);

    bridge.dispatchEvent(0, "keyboardShow", { height: 350 });
    expect(keyboard.value.height).toBe(350);
  });

  test("signal listeners are notified on keyboard changes", () => {
    const bridge = new MockBridge();
    const keyboard = createKeyboardSignal(bridge);

    const events: Array<{ visible: boolean; height: number }> = [];
    // .on() fires immediately with current value
    keyboard.on((k) => events.push({ ...k }));

    bridge.dispatchEvent(0, "keyboardShow", { height: 300 });
    bridge.dispatchEvent(0, "keyboardHide");

    expect(events).toEqual([
      { visible: false, height: 0 }, // initial value
      { visible: true, height: 300 },
      { visible: false, height: 0 },
    ]);
  });
});
