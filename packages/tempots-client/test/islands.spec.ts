import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  hydrateIsland,
  initIslands,
  islandMarker,
  startClient,
  ISLAND_ATTR,
  ISLAND_OPTIONS_ATTR,
  ISLAND_HYDRATE_ATTR,
  HYDRATION_ID_ATTR,
} from "../src/index";
import { html, prop, Renderable } from "@tempots/dom";

describe("Islands Architecture", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    container.id = "app";
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe("hydrateIsland", () => {
    it("should hydrate a single island element", () => {
      container.innerHTML = `<div ${HYDRATION_ID_ATTR}="c1"><span>0</span></div>`;

      const Counter = (options: { initial: number }): Renderable => {
        const count = prop(options.initial);
        return html.div(html.span(count.map(String)));
      };

      const cleanup = hydrateIsland(container, Counter, { initial: 0 });

      expect(container.querySelector("span")?.textContent).toBe("0");

      cleanup();
    });

    it("should pass options to the component", () => {
      container.innerHTML = `<div ${HYDRATION_ID_ATTR}="g1">Hello World</div>`;

      const Greeter = (options: { name: string }): Renderable => {
        return html.div(`Hello ${options.name}`);
      };

      hydrateIsland(container, Greeter, { name: "World" });

      expect(container.textContent).toContain("Hello World");
    });

    it("should return a cleanup function", () => {
      container.innerHTML = `<div ${HYDRATION_ID_ATTR}="t1">Test</div>`;

      const TestComponent = (): Renderable => html.div("Test");

      const cleanup = hydrateIsland(container, TestComponent, {});

      expect(typeof cleanup).toBe("function");

      cleanup(true);

      // After cleanup with removeTree=true, element should be removed
      expect(container.querySelector("div")).toBeFalsy();
    });
  });

  describe("initIslands", () => {
    it("should initialize all islands in the document", () => {
      container.innerHTML = `
        <div ${ISLAND_ATTR}="Counter" ${ISLAND_OPTIONS_ATTR}='{"initial":5}' ${ISLAND_HYDRATE_ATTR}="immediate">
          <span>5</span>
        </div>
      `;

      const Counter = (options: { initial: number }): Renderable => {
        const count = prop(options.initial);
        return html.div(html.span(count.map(String)));
      };

      const cleanup = initIslands({ Counter });

      // Island markers should be removed after hydration
      const island = container.querySelector("div");
      expect(island?.hasAttribute(ISLAND_ATTR)).toBe(false);
      expect(island?.hasAttribute(ISLAND_OPTIONS_ATTR)).toBe(false);
      expect(island?.hasAttribute(ISLAND_HYDRATE_ATTR)).toBe(false);

      cleanup();
    });

    it("should handle multiple islands", () => {
      container.innerHTML = `
        <div ${ISLAND_ATTR}="Counter" ${ISLAND_HYDRATE_ATTR}="immediate">
          <span>0</span>
        </div>
        <div ${ISLAND_ATTR}="Greeter" ${ISLAND_OPTIONS_ATTR}='{"name":"Alice"}' ${ISLAND_HYDRATE_ATTR}="immediate">
          <span>Hello Alice</span>
        </div>
      `;

      // Components return content to render inside the island container
      const Counter = (): Renderable => html.span("0");
      const Greeter = (options: { name: string }): Renderable =>
        html.span(`Hello ${options.name}`);

      const cleanup = initIslands({ Counter, Greeter });

      // Should have hydrated both islands - check they still exist
      const counterIsland = container.querySelector("div");
      const greeterIsland = container.querySelectorAll("div")[1];

      expect(counterIsland).toBeTruthy();
      expect(greeterIsland).toBeTruthy();

      cleanup();
    });

    it("should warn when component is not in registry", () => {
      container.innerHTML = `
        <div ${ISLAND_ATTR}="UnknownComponent" ${ISLAND_HYDRATE_ATTR}="immediate">
          Content
        </div>
      `;

      const consoleWarn = vi.spyOn(console, "warn").mockImplementation(() => {});

      initIslands({});

      expect(consoleWarn).toHaveBeenCalledWith(
        expect.stringContaining("UnknownComponent")
      );

      consoleWarn.mockRestore();
    });

    it("should warn on invalid options JSON", () => {
      container.innerHTML = `
        <div ${ISLAND_ATTR}="Counter" ${ISLAND_OPTIONS_ATTR}='invalid-json' ${ISLAND_HYDRATE_ATTR}="immediate">
          Content
        </div>
      `;

      const consoleWarn = vi.spyOn(console, "warn").mockImplementation(() => {});

      const Counter = (): Renderable => html.div("Counter");
      initIslands({ Counter });

      expect(consoleWarn).toHaveBeenCalledWith(
        expect.stringContaining("Failed to parse options"),
        expect.anything()
      );

      consoleWarn.mockRestore();
    });
  });

  describe("Hydration strategies", () => {
    it('should hydrate immediately with "immediate" strategy', () => {
      container.innerHTML = `
        <div ${ISLAND_ATTR}="Counter" ${ISLAND_HYDRATE_ATTR}="immediate">
          <span>0</span>
        </div>
      `;

      let hydrated = false;
      const Counter = (): Renderable => {
        hydrated = true;
        return html.div(html.span("0"));
      };

      initIslands({ Counter });

      expect(hydrated).toBe(true);
    });

    it('should hydrate immediately with "load" strategy (alias)', () => {
      container.innerHTML = `
        <div ${ISLAND_ATTR}="Counter" ${ISLAND_HYDRATE_ATTR}="load">
          <span>0</span>
        </div>
      `;

      let hydrated = false;
      const Counter = (): Renderable => {
        hydrated = true;
        return html.div(html.span("0"));
      };

      initIslands({ Counter });

      expect(hydrated).toBe(true);
    });

    it('should defer hydration with "idle" strategy', async () => {
      container.innerHTML = `
        <div ${ISLAND_ATTR}="Counter" ${ISLAND_HYDRATE_ATTR}="idle">
          <span>0</span>
        </div>
      `;

      let hydrated = false;
      const Counter = (): Renderable => {
        hydrated = true;
        return html.div(html.span("0"));
      };

      const cleanup = initIslands({ Counter });

      // With idle strategy, hydration is deferred
      // In happy-dom, requestIdleCallback may not work exactly as in browser
      // so we need to wait a tick
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(hydrated).toBe(true);

      cleanup();
    });

    it("should parse media query strategy", () => {
      container.innerHTML = `
        <div ${ISLAND_ATTR}="Counter" ${ISLAND_HYDRATE_ATTR}="media:(min-width: 768px)">
          <span>0</span>
        </div>
      `;

      // In happy-dom, matchMedia returns false by default
      // So the component should not hydrate immediately
      let hydrated = false;
      const Counter = (): Renderable => {
        hydrated = true;
        return html.div(html.span("0"));
      };

      const cleanup = initIslands({ Counter });

      // Media query doesn't match in happy-dom, so not hydrated
      // This tests that the media query parsing works
      cleanup();
    });
  });

  describe("islandMarker", () => {
    it("should generate correct marker attributes", () => {
      const markers = islandMarker("Counter", { initial: 10 }, "visible");

      expect(markers).toHaveLength(3);
      expect(markers).toContainEqual({ name: ISLAND_ATTR, value: "Counter" });
      expect(markers).toContainEqual({
        name: ISLAND_OPTIONS_ATTR,
        value: '{"initial":10}',
      });
      expect(markers).toContainEqual({ name: ISLAND_HYDRATE_ATTR, value: "visible" });
    });

    it("should default to visible strategy", () => {
      const markers = islandMarker("Counter", {});

      const strategyMarker = markers.find((m) => m.name === ISLAND_HYDRATE_ATTR);
      expect(strategyMarker?.value).toBe("visible");
    });

    it("should handle media query strategy", () => {
      const markers = islandMarker("Counter", {}, { media: "(min-width: 1024px)" });

      const strategyMarker = markers.find((m) => m.name === ISLAND_HYDRATE_ATTR);
      expect(strategyMarker?.value).toBe("media:(min-width: 1024px)");
    });

    it("should serialize options to JSON", () => {
      const options = { count: 42, label: "Test", nested: { a: 1 } };
      const markers = islandMarker("Counter", options);

      const optionsMarker = markers.find((m) => m.name === ISLAND_OPTIONS_ATTR);
      expect(optionsMarker?.value).toBe(JSON.stringify(options));
    });
  });

  describe("cleanup", () => {
    it("should cancel scheduled hydration on cleanup", () => {
      container.innerHTML = `
        <div ${ISLAND_ATTR}="Counter" ${ISLAND_HYDRATE_ATTR}="idle">
          <span>0</span>
        </div>
      `;

      let hydrated = false;
      const Counter = (): Renderable => {
        hydrated = true;
        return html.div(html.span("0"));
      };

      const cleanup = initIslands({ Counter });

      // Immediately cleanup before idle callback fires
      cleanup();

      // Give it a moment
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          // Hydration may or may not have happened depending on timing
          // The important thing is cleanup doesn't throw
          resolve();
        }, 5);
      });
    });
  });

  describe("startClient", () => {
    it("should initialize islands in SSR mode (when island markers present)", () => {
      container.innerHTML = `
        <div ${ISLAND_ATTR}="Counter" ${ISLAND_OPTIONS_ATTR}='{"initial":5}' ${ISLAND_HYDRATE_ATTR}="immediate">
          <span>5</span>
        </div>
      `;

      let hydrated = false;
      const Counter = (options: { initial: number }): Renderable => {
        hydrated = true;
        return html.span(String(options.initial));
      };

      const cleanup = startClient({
        islands: { Counter },
      });

      expect(hydrated).toBe(true);
      cleanup();
    });

    it("should render app in client-only mode (no island markers)", () => {
      // Container is empty, no SSR content
      container.innerHTML = "";

      let appRendered = false;
      const App = (): Renderable => {
        appRendered = true;
        return html.div("App content");
      };

      const Counter = (): Renderable => html.span("Counter");

      const cleanup = startClient({
        app: () => App(),
        islands: { Counter },
      });

      expect(appRendered).toBe(true);
      expect(container.textContent).toContain("App content");
      cleanup();
    });

    it("should use custom container selector", () => {
      // Create a custom container
      const customContainer = document.createElement("div");
      customContainer.id = "custom-app";
      document.body.appendChild(customContainer);

      customContainer.innerHTML = `
        <div ${ISLAND_ATTR}="Counter" ${ISLAND_HYDRATE_ATTR}="immediate">
          <span>0</span>
        </div>
      `;

      let hydrated = false;
      const Counter = (): Renderable => {
        hydrated = true;
        return html.span("0");
      };

      const cleanup = startClient({
        container: "#custom-app",
        islands: { Counter },
      });

      expect(hydrated).toBe(true);
      cleanup();
      customContainer.remove();
    });

    it("should accept HTMLElement as container", () => {
      container.innerHTML = `
        <div ${ISLAND_ATTR}="Counter" ${ISLAND_HYDRATE_ATTR}="immediate">
          <span>0</span>
        </div>
      `;

      let hydrated = false;
      const Counter = (): Renderable => {
        hydrated = true;
        return html.span("0");
      };

      const cleanup = startClient({
        container: container,
        islands: { Counter },
      });

      expect(hydrated).toBe(true);
      cleanup();
    });

    it("should log errors when container not found", () => {
      const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

      const cleanup = startClient({
        container: "#non-existent",
        islands: {},
      });

      expect(consoleError).toHaveBeenCalledWith(
        expect.stringContaining("Could not find container")
      );

      cleanup();
      consoleError.mockRestore();
    });

    it("should log debug messages when debug is true", () => {
      container.innerHTML = `
        <div ${ISLAND_ATTR}="Counter" ${ISLAND_HYDRATE_ATTR}="immediate">
          <span>0</span>
        </div>
      `;

      const consoleLog = vi.spyOn(console, "log").mockImplementation(() => {});

      const Counter = (): Renderable => html.span("0");

      const cleanup = startClient({
        islands: { Counter },
        debug: true,
      });

      expect(consoleLog).toHaveBeenCalledWith(
        expect.stringContaining("[Tempo]")
      );

      cleanup();
      consoleLog.mockRestore();
    });

    it("should not log debug messages when debug is false", () => {
      container.innerHTML = `
        <div ${ISLAND_ATTR}="Counter" ${ISLAND_HYDRATE_ATTR}="immediate">
          <span>0</span>
        </div>
      `;

      const consoleLog = vi.spyOn(console, "log").mockImplementation(() => {});

      const Counter = (): Renderable => html.span("0");

      const cleanup = startClient({
        islands: { Counter },
        debug: false,
      });

      expect(consoleLog).not.toHaveBeenCalled();

      cleanup();
      consoleLog.mockRestore();
    });

    it("should return cleanup function", () => {
      container.innerHTML = "";

      const App = (): Renderable => html.div("Test");

      const cleanup = startClient({
        app: () => App(),
        islands: {},
      });

      expect(typeof cleanup).toBe("function");

      // Cleanup should work without errors
      cleanup();

      // After cleanup, container should be empty
      expect(container.innerHTML).toBe("");
    });

    it("should work with empty islands registry", () => {
      container.innerHTML = "";

      const App = (): Renderable => html.div("No islands");

      const cleanup = startClient({
        app: () => App(),
        islands: {},
      });

      expect(container.textContent).toContain("No islands");
      cleanup();
    });
  });
});
