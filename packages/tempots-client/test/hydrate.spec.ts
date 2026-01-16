import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { hydrate, HydrationContext, HYDRATION_ID_ATTR } from "../src/index";
import { html, on, prop } from "@tempots/dom";

describe("hydrate", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe("basic hydration", () => {
    it("should hydrate server-rendered HTML without re-creating elements", () => {
      // Simulate server-rendered HTML
      container.innerHTML = `<div ${HYDRATION_ID_ATTR}="abc123">Hello</div>`;
      const serverDiv = container.querySelector("div") as HTMLElement;

      const cleanup = hydrate(html.div("Hello"), container);

      // Should reuse existing element, not create new one
      expect(container.querySelector("div")).toBe(serverDiv);

      cleanup();
    });

    it("should attach event handlers to existing elements", () => {
      container.innerHTML = `<button ${HYDRATION_ID_ATTR}="btn1">Click me</button>`;
      const button = container.querySelector("button") as HTMLButtonElement;

      const handleClick = vi.fn();

      const cleanup = hydrate(
        html.button(on.click(handleClick), "Click me"),
        container
      );

      // Click the button
      button.click();
      expect(handleClick).toHaveBeenCalledTimes(1);

      cleanup();

      // After cleanup, handler should be removed (when removeTree=true)
    });

    it("should return a cleanup function", () => {
      container.innerHTML = `<div ${HYDRATION_ID_ATTR}="d1">Content</div>`;

      let cleanupCalled = false;
      const cleanup = hydrate(html.div("Content"), container);

      expect(typeof cleanup).toBe("function");

      cleanup();
      // Cleanup should execute without error
    });
  });

  describe("hydration markers", () => {
    it("should remove hydration markers by default", () => {
      container.innerHTML = `<div ${HYDRATION_ID_ATTR}="m1" data-tts-node="true">Content</div>`;

      hydrate(html.div("Content"), container);

      const div = container.querySelector("div") as HTMLElement;
      expect(div.hasAttribute(HYDRATION_ID_ATTR)).toBe(false);
      expect(div.hasAttribute("data-tts-node")).toBe(false);
    });

    it("should keep hydration markers when removeMarkers is false", () => {
      container.innerHTML = `<div ${HYDRATION_ID_ATTR}="m2">Content</div>`;

      hydrate(html.div("Content"), container, { removeMarkers: false });

      const div = container.querySelector("div") as HTMLElement;
      expect(div.hasAttribute(HYDRATION_ID_ATTR)).toBe(true);
    });
  });

  describe("text node hydration", () => {
    it("should reuse existing text nodes", () => {
      container.innerHTML = `<div ${HYDRATION_ID_ATTR}="d1">Hello World</div>`;
      const div = container.querySelector("div") as HTMLElement;
      const textNode = div.firstChild as Text;

      hydrate(html.div("Hello World"), container);

      // Should reuse existing text node
      expect(div.firstChild).toBe(textNode);
      expect(textNode.textContent).toBe("Hello World");
    });

    it("should update text content if different", () => {
      container.innerHTML = `<div ${HYDRATION_ID_ATTR}="d2">Old text</div>`;
      const div = container.querySelector("div") as HTMLElement;

      hydrate(html.div("New text"), container);

      expect(div.textContent).toBe("New text");
    });
  });

  describe("nested elements", () => {
    it("should hydrate nested element structures", () => {
      container.innerHTML = `
        <div ${HYDRATION_ID_ATTR}="outer">
          <span ${HYDRATION_ID_ATTR}="inner">Nested</span>
        </div>
      `.trim();

      const outerDiv = container.querySelector("div") as HTMLElement;
      const innerSpan = container.querySelector("span") as HTMLElement;

      hydrate(
        html.div(html.span("Nested")),
        container
      );

      // Both elements should be reused
      expect(container.querySelector("div")).toBe(outerDiv);
      expect(container.querySelector("span")).toBe(innerSpan);
    });
  });

  describe("hydration mismatch handling", () => {
    it("should create new element when tag name doesn't match", () => {
      container.innerHTML = `<span ${HYDRATION_ID_ATTR}="s1">Wrong tag</span>`;
      const consoleWarn = vi.spyOn(console, "warn").mockImplementation(() => {});

      hydrate(html.div("Expected div"), container);

      // Should warn about mismatch
      expect(consoleWarn).toHaveBeenCalledWith(
        expect.stringContaining("Hydration mismatch")
      );

      // Should create new div element
      expect(container.querySelector("div")).toBeTruthy();

      consoleWarn.mockRestore();
    });

    it("should create text node when none exists", () => {
      container.innerHTML = `<div ${HYDRATION_ID_ATTR}="d1"></div>`;

      hydrate(html.div("New text"), container);

      const div = container.querySelector("div") as HTMLElement;
      expect(div.textContent).toBe("New text");
    });
  });

  describe("cleanup with removeTree option", () => {
    it("should remove DOM elements when cleanup is called with removeTree=true", () => {
      container.innerHTML = `<div ${HYDRATION_ID_ATTR}="d1">Content</div>`;

      const cleanup = hydrate(html.div("Content"), container);

      expect(container.querySelector("div")).toBeTruthy();

      cleanup(true);

      expect(container.querySelector("div")).toBeFalsy();
    });

    it("should keep DOM elements when cleanup is called without removeTree", () => {
      container.innerHTML = `<div ${HYDRATION_ID_ATTR}="d1">Content</div>`;

      const cleanup = hydrate(html.div("Content"), container);

      expect(container.querySelector("div")).toBeTruthy();

      cleanup();

      expect(container.querySelector("div")).toBeTruthy();
    });
  });
});

describe("HydrationContext", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe("makeChildElement", () => {
    it("should find existing child by tag name", () => {
      container.innerHTML = `<div><span>Test</span></div>`;
      const existingSpan = container.querySelector("span");

      const ctx = new HydrationContext(
        document,
        container.querySelector("div") as HTMLElement,
        undefined,
        {},
        new Map(),
        0
      );

      const childCtx = ctx.makeChildElement("span", undefined);
      expect(childCtx.element).toBe(existingSpan);
    });

    it("should find element by hydration ID", () => {
      container.innerHTML = `<div><button ${HYDRATION_ID_ATTR}="btn1">Click</button></div>`;
      const existingButton = container.querySelector("button");

      const hydrationMap = new Map<string, HTMLElement>();
      hydrationMap.set("btn1", existingButton as HTMLElement);

      const ctx = new HydrationContext(
        document,
        container.querySelector("div") as HTMLElement,
        undefined,
        {},
        hydrationMap,
        0
      );

      const childCtx = ctx.makeChildElement("button", undefined);
      expect(childCtx.element).toBe(existingButton);
    });
  });

  describe("makeChildText", () => {
    it("should find and reuse existing text node", () => {
      container.innerHTML = `<div>Existing text</div>`;
      const div = container.querySelector("div") as HTMLElement;
      const textNode = div.firstChild;

      const ctx = new HydrationContext(document, div, undefined, {}, new Map(), 0);

      const textCtx = ctx.makeChildText("Existing text");
      expect(textCtx.reference).toBe(textNode);
    });
  });

  describe("makeRef", () => {
    it("should find existing empty text node for reference", () => {
      const div = document.createElement("div");
      const emptyText = document.createTextNode("");
      div.appendChild(emptyText);
      container.appendChild(div);

      const ctx = new HydrationContext(document, div, undefined, {}, new Map(), 0);

      const refCtx = ctx.makeRef();
      expect(refCtx.reference).toBe(emptyText);
    });

    it("should create new text node if none exists", () => {
      const div = document.createElement("div");
      div.innerHTML = "Some content";
      container.appendChild(div);

      const ctx = new HydrationContext(document, div, undefined, {}, new Map(), 0);

      const refCtx = ctx.makeRef();
      expect(refCtx.reference).toBeInstanceOf(Text);
    });
  });

  describe("makePortal", () => {
    it("should find portal target by selector", () => {
      const portalTarget = document.createElement("div");
      portalTarget.id = "portal";
      document.body.appendChild(portalTarget);

      const ctx = new HydrationContext(
        document,
        container,
        undefined,
        {},
        new Map(),
        0
      );

      const portalCtx = ctx.makePortal("#portal");
      expect(portalCtx.element).toBe(portalTarget);

      portalTarget.remove();
    });

    it("should throw when portal target not found", () => {
      const ctx = new HydrationContext(
        document,
        container,
        undefined,
        {},
        new Map(),
        0
      );

      expect(() => ctx.makePortal("#nonexistent")).toThrow(
        "Cannot find element by selector for portal"
      );
    });
  });

  describe("provider methods", () => {
    it("should set and get providers", () => {
      const mark = Symbol("test") as unknown as string;
      const ctx = new HydrationContext(
        document,
        container,
        undefined,
        {},
        new Map(),
        0
      );

      const newCtx = ctx.setProvider(mark, "test-value", undefined);
      const result = newCtx.getProvider(mark);

      expect(result.value).toBe("test-value");
    });

    it("should throw when provider not found", () => {
      const mark = Symbol("missing") as unknown as string;
      const ctx = new HydrationContext(
        document,
        container,
        undefined,
        {},
        new Map(),
        0
      );

      expect(() => ctx.getProvider(mark)).toThrow("Provider not found");
    });
  });

  describe("class methods", () => {
    it("should add and remove classes", () => {
      const div = document.createElement("div");
      container.appendChild(div);

      const ctx = new HydrationContext(document, div, undefined, {}, new Map(), 0);

      ctx.addClasses(["foo", "bar"]);
      expect(div.classList.contains("foo")).toBe(true);
      expect(div.classList.contains("bar")).toBe(true);

      ctx.removeClasses(["foo"]);
      expect(div.classList.contains("foo")).toBe(false);
      expect(div.classList.contains("bar")).toBe(true);
    });

    it("should get classes", () => {
      const div = document.createElement("div");
      div.className = "a b c";
      container.appendChild(div);

      const ctx = new HydrationContext(document, div, undefined, {}, new Map(), 0);

      expect(ctx.getClasses()).toEqual(["a", "b", "c"]);
    });
  });

  describe("style methods", () => {
    it("should set and get styles", () => {
      const div = document.createElement("div");
      container.appendChild(div);

      const ctx = new HydrationContext(document, div, undefined, {}, new Map(), 0);

      ctx.setStyle("color", "red");
      expect(ctx.getStyle("color")).toBe("red");
    });
  });

  describe("text methods", () => {
    it("should set and get text from reference node", () => {
      const div = document.createElement("div");
      const text = document.createTextNode("initial");
      div.appendChild(text);
      container.appendChild(div);

      const ctx = new HydrationContext(document, div, text, {}, new Map(), 0);

      expect(ctx.getText()).toBe("initial");

      ctx.setText("updated");
      expect(ctx.getText()).toBe("updated");
    });
  });

  describe("type guards", () => {
    it("should identify as browser environment but not BrowserContext", () => {
      const ctx = new HydrationContext(
        document,
        container,
        undefined,
        {},
        new Map(),
        0
      );

      // isBrowser() returns true since hydration runs in browser environment
      expect(ctx.isBrowser()).toBe(true);
      // isBrowserDOM() returns false since this is not a BrowserContext instance
      expect(ctx.isBrowserDOM()).toBe(false);
      expect(ctx.isHeadless()).toBe(false);
      expect(ctx.isHeadlessDOM()).toBe(false);
    });
  });

  describe("makeAccessors", () => {
    it("should create property accessors", () => {
      const div = document.createElement("div");
      container.appendChild(div);

      const ctx = new HydrationContext(document, div, undefined, {}, new Map(), 0);

      const accessors = ctx.makeAccessors("title");
      accessors.set("Hello");
      expect(accessors.get()).toBe("Hello");
      expect(div.title).toBe("Hello");
    });
  });
});
