import { describe, it, expect, vi } from "vitest";
import { tempo, renderApp, extractInternalLinks, crawlRoutes } from "../src/index";
import { html } from "@tempots/dom";

describe("tempo plugin", () => {
  describe("tempo()", () => {
    it("should return an array of plugins", () => {
      const plugins = tempo();

      expect(Array.isArray(plugins)).toBe(true);
      expect(plugins.length).toBe(4);
    });

    it("should have correct plugin names", () => {
      const plugins = tempo();

      expect(plugins[0].name).toBe("tempo");
      expect(plugins[1].name).toBe("tempo:ssg");
      expect(plugins[2].name).toBe("tempo:ssr-dev");
      expect(plugins[3].name).toBe("tempo:hmr");
    });

    it("should accept mode option", () => {
      const ssgPlugins = tempo({ mode: "ssg" });
      const ssrPlugins = tempo({ mode: "ssr" });
      const islandsPlugins = tempo({ mode: "islands" });
      const hybridPlugins = tempo({ mode: "hybrid" });

      expect(ssgPlugins.length).toBe(4);
      expect(ssrPlugins.length).toBe(4);
      expect(islandsPlugins.length).toBe(4);
      expect(hybridPlugins.length).toBe(4);
    });

    describe("HMR plugin", () => {
      it("should include HMR plugin in returned array by default", () => {
        const plugins = tempo();
        expect(plugins.length).toBe(4);
        expect(plugins[3].name).toBe("tempo:hmr");
      });

      it("should include HMR plugin when hmr is true", () => {
        const plugins = tempo({ hmr: true });
        expect(plugins.some((p) => p.name === "tempo:hmr")).toBe(true);
      });

      it("should not include HMR plugin when hmr is false", () => {
        const plugins = tempo({ hmr: false });
        expect(plugins.some((p) => p.name === "tempo:hmr")).toBe(false);
      });

      it("should include HMR plugin when hmr is an options object", () => {
        const plugins = tempo({ hmr: { errorBoundary: false } });
        expect(plugins.some((p) => p.name === "tempo:hmr")).toBe(true);
      });
    });

    describe("devtools option", () => {
      it("should accept devtools: true", () => {
        const plugins = tempo({ devtools: true });
        expect(plugins.length).toBe(4);
      });

      it("should accept devtools: false", () => {
        const plugins = tempo({ devtools: false });
        expect(plugins.length).toBe(4);
      });
    });

    it("should accept routes as string array", () => {
      const plugins = tempo({
        routes: ["/", "/about", "/contact"],
      });

      expect(plugins.length).toBe(4);
    });

    it("should accept routes as RouteConfig array", () => {
      const plugins = tempo({
        routes: [
          { path: "/" },
          { path: "/about", output: "about.html" },
        ],
      });

      expect(plugins.length).toBe(4);
    });

    it("should accept routes as async function", () => {
      const plugins = tempo({
        routes: async () => ["/", "/about"],
      });

      expect(plugins.length).toBe(4);
    });

    it("should accept custom entry path", () => {
      const plugins = tempo({
        entry: "src/main.ts",
      });

      expect(plugins.length).toBe(4);
    });

    it("should accept custom template path", () => {
      const plugins = tempo({
        template: "public/index.html",
      });

      expect(plugins.length).toBe(4);
    });

    it("should accept custom container selector", () => {
      const plugins = tempo({
        container: "#root",
      });

      expect(plugins.length).toBe(4);
    });

    it("should accept hydrate option", () => {
      const plugins = tempo({
        hydrate: true,
      });

      expect(plugins.length).toBe(4);
    });

    it("should accept custom outDir", () => {
      const plugins = tempo({
        outDir: "build",
      });

      expect(plugins.length).toBe(4);
    });

    it("should accept routes as 'crawl' string", () => {
      const plugins = tempo({
        routes: "crawl",
      });

      expect(plugins.length).toBe(4);
    });

    it("should accept seedRoutes option", () => {
      const plugins = tempo({
        routes: "crawl",
        seedRoutes: ["/", "/api"],
      });

      expect(plugins.length).toBe(4);
    });

    it("should default routes to 'crawl'", () => {
      const plugins = tempo({});

      // Just verify it doesn't throw - actual crawling happens at build time
      expect(plugins.length).toBe(4);
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

describe("extractInternalLinks", () => {
  it("should extract internal links starting with /", () => {
    const html = `
      <a href="/">Home</a>
      <a href="/about">About</a>
      <a href="/blog/post-1">Blog Post</a>
    `;

    const links = extractInternalLinks(html);

    expect(links).toContain("/");
    expect(links).toContain("/about");
    expect(links).toContain("/blog/post-1");
  });

  it("should exclude external links", () => {
    const html = `
      <a href="https://example.com">External</a>
      <a href="//cdn.example.com/file.js">Protocol-relative</a>
      <a href="mailto:test@example.com">Email</a>
    `;

    const links = extractInternalLinks(html);

    expect(links).toHaveLength(0);
  });

  it("should exclude static assets", () => {
    const html = `
      <a href="/assets/style.css">CSS</a>
      <a href="/images/logo.png">Image</a>
      <a href="/scripts/app.js">Script</a>
    `;

    const links = extractInternalLinks(html);

    expect(links).toHaveLength(0);
  });

  it("should allow .html routes", () => {
    const html = `
      <a href="/about.html">About</a>
      <a href="/contact.html">Contact</a>
    `;

    const links = extractInternalLinks(html);

    expect(links).toContain("/about.html");
    expect(links).toContain("/contact.html");
  });

  it("should strip hash and query strings", () => {
    const html = `
      <a href="/page#section">With hash</a>
      <a href="/search?q=test">With query</a>
      <a href="/both?q=test#section">With both</a>
    `;

    const links = extractInternalLinks(html);

    expect(links).toContain("/page");
    expect(links).toContain("/search");
    expect(links).toContain("/both");
    expect(links).not.toContain("/page#section");
    expect(links).not.toContain("/search?q=test");
  });

  it("should deduplicate links", () => {
    const html = `
      <a href="/about">About 1</a>
      <a href="/about">About 2</a>
      <a href="/about#section">About 3</a>
    `;

    const links = extractInternalLinks(html);

    expect(links.filter((l) => l === "/about")).toHaveLength(1);
  });
});

describe("crawlRoutes", () => {
  it("should discover routes by following links", async () => {
    const pages: Record<string, string> = {
      "/": '<a href="/about">About</a><a href="/contact">Contact</a>',
      "/about": '<a href="/">Home</a><a href="/team">Team</a>',
      "/contact": '<a href="/">Home</a>',
      "/team": '<a href="/about">About</a>',
    };

    const renderFn = async (url: string) => pages[url] || "";
    const logger = { log: vi.fn() };

    const routes = await crawlRoutes(renderFn, ["/"], logger);

    expect(routes).toContain("/");
    expect(routes).toContain("/about");
    expect(routes).toContain("/contact");
    expect(routes).toContain("/team");
    expect(routes).toHaveLength(4);
  });

  it("should start from multiple seed routes", async () => {
    const pages: Record<string, string> = {
      "/": '<a href="/page1">Page 1</a>',
      "/api": '<a href="/api/docs">API Docs</a>',
      "/page1": "",
      "/api/docs": "",
    };

    const renderFn = async (url: string) => pages[url] || "";
    const logger = { log: vi.fn() };

    const routes = await crawlRoutes(renderFn, ["/", "/api"], logger);

    expect(routes).toContain("/");
    expect(routes).toContain("/api");
    expect(routes).toContain("/page1");
    expect(routes).toContain("/api/docs");
  });

  it("should handle render errors gracefully", async () => {
    const renderFn = async (url: string) => {
      if (url === "/broken") throw new Error("Render failed");
      return '<a href="/broken">Broken</a>';
    };
    const logger = { log: vi.fn() };

    const routes = await crawlRoutes(renderFn, ["/"], logger);

    expect(routes).toContain("/");
    expect(routes).not.toContain("/broken");
  });

  it("should not visit the same route twice", async () => {
    let renderCount = 0;
    const renderFn = async (url: string) => {
      renderCount++;
      return '<a href="/">Home</a><a href="/about">About</a>';
    };
    const logger = { log: vi.fn() };

    await crawlRoutes(renderFn, ["/"], logger);

    // Should only render / and /about once each
    expect(renderCount).toBe(2);
  });
});
