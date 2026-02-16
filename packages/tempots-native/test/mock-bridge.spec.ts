import { describe, test, expect, vi } from "vitest";
import { MockBridge } from "../src/bridge/mock-bridge";

describe("MockBridge", () => {
  test("root node exists on construction", () => {
    const bridge = new MockBridge();
    expect(bridge.root).toBeDefined();
    expect(bridge.root.type).toBe("root");
    expect(bridge.root.children).toEqual([]);
  });

  describe("createView", () => {
    test("creates a view with the correct type", () => {
      const bridge = new MockBridge();
      const handle = bridge.createView("View", bridge.root.handle);
      const node = bridge.getNode(handle);
      expect(node).toBeDefined();
      expect(node!.type).toBe("View");
    });

    test("appends to parent by default", () => {
      const bridge = new MockBridge();
      bridge.createView("View", bridge.root.handle);
      bridge.createView("Text", bridge.root.handle);
      expect(bridge.root.children.length).toBe(2);
      expect(bridge.root.children[0].type).toBe("View");
      expect(bridge.root.children[1].type).toBe("Text");
    });

    test("inserts before a sibling when specified", () => {
      const bridge = new MockBridge();
      const first = bridge.createView("First", bridge.root.handle);
      const second = bridge.createView("Second", bridge.root.handle);
      bridge.createView("Inserted", bridge.root.handle, first);

      expect(bridge.root.children.length).toBe(3);
      expect(bridge.root.children[0].type).toBe("Inserted");
      expect(bridge.root.children[1].type).toBe("First");
      expect(bridge.root.children[2].type).toBe("Second");
    });

    test("appends if before node is not a child of parent", () => {
      const bridge = new MockBridge();
      const child = bridge.createView("Child", bridge.root.handle);
      const otherParent = bridge.createView("Other", bridge.root.handle);
      const grandchild = bridge.createView(
        "Grandchild",
        otherParent,
      );

      // Try to insert before grandchild in root (grandchild is not a child of root)
      bridge.createView("Inserted", bridge.root.handle, grandchild);
      expect(bridge.root.children.length).toBe(3);
      expect(bridge.root.children[2].type).toBe("Inserted");
    });

    test("sets parent reference on child", () => {
      const bridge = new MockBridge();
      const handle = bridge.createView("View", bridge.root.handle);
      const node = bridge.getNode(handle);
      expect(node!.parent).toBe(bridge.root);
    });

    test("assigns unique handles", () => {
      const bridge = new MockBridge();
      const h1 = bridge.createView("A", bridge.root.handle);
      const h2 = bridge.createView("B", bridge.root.handle);
      const h3 = bridge.createView("C", bridge.root.handle);
      expect(h1).not.toBe(h2);
      expect(h2).not.toBe(h3);
      expect(h1).not.toBe(h3);
    });

    test("throws for invalid parent handle", () => {
      const bridge = new MockBridge();
      expect(() => bridge.createView("View", 999)).toThrow(
        "MockBridge: node 999 not found",
      );
    });
  });

  describe("createTextView", () => {
    test("creates a __text__ node with content", () => {
      const bridge = new MockBridge();
      const handle = bridge.createTextView("Hello", bridge.root.handle);
      const node = bridge.getNode(handle);
      expect(node).toBeDefined();
      expect(node!.type).toBe("__text__");
      expect(node!.text).toBe("Hello");
    });

    test("inserts before a sibling when specified", () => {
      const bridge = new MockBridge();
      const first = bridge.createTextView("First", bridge.root.handle);
      bridge.createTextView("Inserted", bridge.root.handle, first);

      expect(bridge.root.children.length).toBe(2);
      expect(bridge.root.children[0].text).toBe("Inserted");
      expect(bridge.root.children[1].text).toBe("First");
    });

    test("creates text view with empty string", () => {
      const bridge = new MockBridge();
      const handle = bridge.createTextView("", bridge.root.handle);
      const node = bridge.getNode(handle);
      expect(node!.text).toBe("");
    });
  });

  describe("removeView", () => {
    test("removes view from parent", () => {
      const bridge = new MockBridge();
      const handle = bridge.createView("View", bridge.root.handle);
      expect(bridge.root.children.length).toBe(1);

      bridge.removeView(handle);
      expect(bridge.root.children.length).toBe(0);
    });

    test("removes node from internal map", () => {
      const bridge = new MockBridge();
      const handle = bridge.createView("View", bridge.root.handle);
      bridge.removeView(handle);
      expect(bridge.getNode(handle)).toBeUndefined();
    });

    test("throws for unknown handle", () => {
      const bridge = new MockBridge();
      expect(() => bridge.removeView(999)).toThrow(
        "MockBridge: node 999 not found",
      );
    });

    test("sets parent to null on removed node", () => {
      const bridge = new MockBridge();
      const handle = bridge.createView("View", bridge.root.handle);
      const node = bridge.getNode(handle)!;
      expect(node.parent).toBe(bridge.root);
      bridge.removeView(handle);
      expect(node.parent).toBeNull();
    });

    test("removes correct node when multiple children exist", () => {
      const bridge = new MockBridge();
      bridge.createView("First", bridge.root.handle);
      const second = bridge.createView("Second", bridge.root.handle);
      bridge.createView("Third", bridge.root.handle);

      bridge.removeView(second);
      expect(bridge.root.children.length).toBe(2);
      expect(bridge.root.children[0].type).toBe("First");
      expect(bridge.root.children[1].type).toBe("Third");
    });
  });

  describe("setViewProp / setViewProps", () => {
    test("setViewProp sets a single property", () => {
      const bridge = new MockBridge();
      const handle = bridge.createView("TextInput", bridge.root.handle);
      bridge.setViewProp(handle, "placeholder", "Type here");
      expect(bridge.getNode(handle)!.props.placeholder).toBe("Type here");
    });

    test("setViewProps sets multiple properties", () => {
      const bridge = new MockBridge();
      const handle = bridge.createView("TextInput", bridge.root.handle);
      bridge.setViewProps(handle, { placeholder: "Type", editable: true });
      const node = bridge.getNode(handle)!;
      expect(node.props.placeholder).toBe("Type");
      expect(node.props.editable).toBe(true);
    });

    test("setViewProp overwrites existing property", () => {
      const bridge = new MockBridge();
      const handle = bridge.createView("View", bridge.root.handle);
      bridge.setViewProp(handle, "testID", "first");
      bridge.setViewProp(handle, "testID", "second");
      expect(bridge.getNode(handle)!.props.testID).toBe("second");
    });

    test("throws for invalid handle", () => {
      const bridge = new MockBridge();
      expect(() => bridge.setViewProp(999, "foo", "bar")).toThrow();
      expect(() => bridge.setViewProps(999, { foo: "bar" })).toThrow();
    });
  });

  describe("setTextContent / getTextContent", () => {
    test("updates and reads text content", () => {
      const bridge = new MockBridge();
      const handle = bridge.createTextView("Hello", bridge.root.handle);
      expect(bridge.getTextContent(handle)).toBe("Hello");

      bridge.setTextContent(handle, "World");
      expect(bridge.getTextContent(handle)).toBe("World");
    });

    test("handles empty text", () => {
      const bridge = new MockBridge();
      const handle = bridge.createTextView("Hello", bridge.root.handle);
      bridge.setTextContent(handle, "");
      expect(bridge.getTextContent(handle)).toBe("");
    });

    test("throws for invalid handle", () => {
      const bridge = new MockBridge();
      expect(() => bridge.setTextContent(999, "text")).toThrow();
      expect(() => bridge.getTextContent(999)).toThrow();
    });
  });

  describe("setStyle", () => {
    test("sets style properties", () => {
      const bridge = new MockBridge();
      const handle = bridge.createView("View", bridge.root.handle);
      bridge.setStyle(handle, { backgroundColor: "red", flex: 1 });
      const node = bridge.getNode(handle)!;
      expect(node.styles.backgroundColor).toBe("red");
      expect(node.styles.flex).toBe(1);
    });

    test("merges with existing styles", () => {
      const bridge = new MockBridge();
      const handle = bridge.createView("View", bridge.root.handle);
      bridge.setStyle(handle, { backgroundColor: "red" });
      bridge.setStyle(handle, { flex: 1 });
      const node = bridge.getNode(handle)!;
      expect(node.styles.backgroundColor).toBe("red");
      expect(node.styles.flex).toBe(1);
    });

    test("overwrites existing style properties", () => {
      const bridge = new MockBridge();
      const handle = bridge.createView("View", bridge.root.handle);
      bridge.setStyle(handle, { backgroundColor: "red" });
      bridge.setStyle(handle, { backgroundColor: "blue" });
      expect(bridge.getNode(handle)!.styles.backgroundColor).toBe("blue");
    });
  });

  describe("addEventListener", () => {
    test("adds and invokes a listener", () => {
      const bridge = new MockBridge();
      const handle = bridge.createView("View", bridge.root.handle);
      const handler = vi.fn();

      bridge.addEventListener(handle, "press", handler);
      bridge.dispatchEvent(handle, "press", { x: 10 });

      expect(handler).toHaveBeenCalledWith({ x: 10 });
    });

    test("supports multiple listeners for same event", () => {
      const bridge = new MockBridge();
      const handle = bridge.createView("View", bridge.root.handle);
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      bridge.addEventListener(handle, "press", handler1);
      bridge.addEventListener(handle, "press", handler2);
      bridge.dispatchEvent(handle, "press");

      expect(handler1).toHaveBeenCalledTimes(1);
      expect(handler2).toHaveBeenCalledTimes(1);
    });

    test("cleanup function removes only the specific listener", () => {
      const bridge = new MockBridge();
      const handle = bridge.createView("View", bridge.root.handle);
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      const cleanup1 = bridge.addEventListener(handle, "press", handler1);
      bridge.addEventListener(handle, "press", handler2);

      cleanup1();
      bridge.dispatchEvent(handle, "press");

      expect(handler1).not.toHaveBeenCalled();
      expect(handler2).toHaveBeenCalledTimes(1);
    });

    test("does not call handlers for different event types", () => {
      const bridge = new MockBridge();
      const handle = bridge.createView("View", bridge.root.handle);
      const handler = vi.fn();

      bridge.addEventListener(handle, "press", handler);
      bridge.dispatchEvent(handle, "longPress");

      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe("measure", () => {
    test("returns a resolved promise with layout", async () => {
      const bridge = new MockBridge();
      const handle = bridge.createView("View", bridge.root.handle);
      const layout = await bridge.measure(handle);

      expect(layout).toEqual({ x: 0, y: 0, width: 100, height: 50 });
    });

    test("throws for invalid handle", () => {
      const bridge = new MockBridge();
      expect(() => bridge.measure(999)).toThrow();
    });
  });

  describe("requestAnimationFrame / cancelAnimationFrame", () => {
    test("returns incrementing ids", () => {
      const bridge = new MockBridge();
      const id1 = bridge.requestAnimationFrame(() => {});
      const id2 = bridge.requestAnimationFrame(() => {});
      expect(id2).toBeGreaterThan(id1);
    });

    test("executes callback asynchronously", async () => {
      const bridge = new MockBridge();
      let called = false;
      bridge.requestAnimationFrame(() => {
        called = true;
      });
      expect(called).toBe(false);
      await new Promise((resolve) => setTimeout(resolve, 20));
      expect(called).toBe(true);
    });

    test("cancelAnimationFrame does not throw", () => {
      const bridge = new MockBridge();
      const id = bridge.requestAnimationFrame(() => {});
      expect(() => bridge.cancelAnimationFrame(id)).not.toThrow();
    });
  });

  describe("dispatchEvent", () => {
    test("uses empty object as default data", () => {
      const bridge = new MockBridge();
      const handle = bridge.createView("View", bridge.root.handle);
      const handler = vi.fn();

      bridge.addEventListener(handle, "press", handler);
      bridge.dispatchEvent(handle, "press");

      expect(handler).toHaveBeenCalledWith({});
    });

    test("throws for invalid handle", () => {
      const bridge = new MockBridge();
      expect(() => bridge.dispatchEvent(999, "press")).toThrow();
    });

    test("no-ops when no listeners for event", () => {
      const bridge = new MockBridge();
      const handle = bridge.createView("View", bridge.root.handle);
      // Should not throw
      bridge.dispatchEvent(handle, "nonexistent");
    });
  });

  describe("collectText", () => {
    test("collects text from root by default", () => {
      const bridge = new MockBridge();
      bridge.createTextView("Hello ", bridge.root.handle);
      bridge.createTextView("World", bridge.root.handle);
      expect(bridge.collectText()).toBe("Hello World");
    });

    test("collects text from a specific subtree", () => {
      const bridge = new MockBridge();
      const parent = bridge.createView("View", bridge.root.handle);
      bridge.createTextView("Inside", parent);
      bridge.createTextView("Outside", bridge.root.handle);
      expect(bridge.collectText(parent)).toBe("Inside");
    });

    test("returns empty string for empty tree", () => {
      const bridge = new MockBridge();
      expect(bridge.collectText()).toBe("");
    });

    test("collects nested text depth-first", () => {
      const bridge = new MockBridge();
      const div = bridge.createView("View", bridge.root.handle);
      bridge.createTextView("A", div);
      const inner = bridge.createView("View", div);
      bridge.createTextView("B", inner);
      bridge.createTextView("C", div);
      expect(bridge.collectText()).toBe("ABC");
    });
  });

  describe("getNode", () => {
    test("returns undefined for unknown handle", () => {
      const bridge = new MockBridge();
      expect(bridge.getNode(999)).toBeUndefined();
    });

    test("returns node for valid handle", () => {
      const bridge = new MockBridge();
      const handle = bridge.createView("View", bridge.root.handle);
      const node = bridge.getNode(handle);
      expect(node).toBeDefined();
      expect(node!.handle).toBe(handle);
    });
  });
});
