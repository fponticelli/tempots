import { describe, it, expect } from "vitest";
import { tempo, renderApp } from "../src/index";
import { html } from "@tempots/dom";

describe("tempo plugin", () => {
  describe("tempo()", () => {
    it("should return an array of plugins", () => {
      const plugins = tempo();

      expect(Array.isArray(plugins)).toBe(true);
      expect(plugins.length).toBe(3);
    });

    it("should have correct plugin names", () => {
      const plugins = tempo();

      expect(plugins[0].name).toBe("tempo");
      expect(plugins[1].name).toBe("tempo:ssg");
      expect(plugins[2].name).toBe("tempo:ssr-dev");
    });

    it("should accept mode option", () => {
      const ssgPlugins = tempo({ mode: "ssg" });
      const ssrPlugins = tempo({ mode: "ssr" });
      const islandsPlugins = tempo({ mode: "islands" });
      const hybridPlugins = tempo({ mode: "hybrid" });

      expect(ssgPlugins.length).toBe(3);
      expect(ssrPlugins.length).toBe(3);
      expect(islandsPlugins.length).toBe(3);
      expect(hybridPlugins.length).toBe(3);
    });

    it("should accept routes as string array", () => {
      const plugins = tempo({
        routes: ["/", "/about", "/contact"],
      });

      expect(plugins.length).toBe(3);
    });

    it("should accept routes as RouteConfig array", () => {
      const plugins = tempo({
        routes: [
          { path: "/" },
          { path: "/about", output: "about.html" },
        ],
      });

      expect(plugins.length).toBe(3);
    });

    it("should accept routes as async function", () => {
      const plugins = tempo({
        routes: async () => ["/", "/about"],
      });

      expect(plugins.length).toBe(3);
    });

    it("should accept custom entry path", () => {
      const plugins = tempo({
        entry: "src/main.ts",
      });

      expect(plugins.length).toBe(3);
    });

    it("should accept custom template path", () => {
      const plugins = tempo({
        template: "public/index.html",
      });

      expect(plugins.length).toBe(3);
    });

    it("should accept custom container selector", () => {
      const plugins = tempo({
        container: "#root",
      });

      expect(plugins.length).toBe(3);
    });

    it("should accept hydrate option", () => {
      const plugins = tempo({
        hydrate: true,
      });

      expect(plugins.length).toBe(3);
    });

    it("should accept custom outDir", () => {
      const plugins = tempo({
        outDir: "build",
      });

      expect(plugins.length).toBe(3);
    });
  });

  describe("ssg plugin", () => {
    it("should apply to build only", () => {
      const plugins = tempo({ mode: "ssg" });
      const ssgPlugin = plugins[1];

      expect(ssgPlugin.apply).toBe("build");
    });
  });

  describe("ssr-dev plugin", () => {
    it("should apply to serve only", () => {
      const plugins = tempo({ mode: "ssr" });
      const ssrDevPlugin = plugins[2];

      expect(ssrDevPlugin.apply).toBe("serve");
    });
  });
});

describe("renderApp", () => {
  it("should render app to HTML string with hydration markers", async () => {
    const App = () => html.div(html.span("Hello World"));

    const result = await renderApp(App(), { hydrate: true });

    expect(result).toContain("<div");
    expect(result).toContain("<span>Hello World</span>");
    expect(result).toContain("data-tempo-id");
  });

  it("should render app to static HTML without hydration markers", async () => {
    const App = () => html.div(html.span("Hello World"));

    const result = await renderApp(App(), { hydrate: false });

    expect(result).toContain("<div");
    expect(result).toContain("<span>Hello World</span>");
    expect(result).not.toContain("data-tempo-id");
  });

  it("should default to hydrate: true", async () => {
    const App = () => html.div("Test");

    const result = await renderApp(App());

    expect(result).toContain("data-tempo-id");
  });
});
