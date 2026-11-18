import { mkdtemp, readFile, realpath, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { build, createServer } from 'vite'
import { describe, expect, it, onTestFinished, vi } from 'vitest'
import {
  tempo,
  renderApp,
  extractInternalLinks,
  crawlRoutes,
  type TempoMode,
  type TempoViteOptions,
} from '../src/index'
import { html } from '@tempots/dom'
import { serveFixture } from './serve-fixture'

const template = '<!doctype html><html><body><div id="app"></div></body></html>'
const serverEntry = `
  export function render(url) {
    const link = url === '/' ? '<a href="/about">About</a>' : ''
    return '<main>' + url + link + '</main>'
  }
`

async function makeFixture(files: Record<string, string>): Promise<string> {
  const root = await mkdtemp(join(await realpath(tmpdir()), 'tempo-vite-'))
  onTestFinished(() => rm(root, { recursive: true, force: true }))
  await Promise.all(
    Object.entries(files).map(([name, contents]) =>
      writeFile(join(root, name), contents)
    )
  )
  return root
}

describe('tempo plugin', () => {
  it('defaults to SPA and enables HMR', () => {
    expect(tempo().map(plugin => plugin.name)).toEqual(['tempo', 'tempo:hmr'])
  })

  const modes: { mode: TempoMode; plugins: string[] }[] = [
    { mode: 'spa', plugins: ['tempo', 'tempo:hmr'] },
    { mode: 'ssg', plugins: ['tempo', 'tempo:ssg', 'tempo:hmr'] },
    { mode: 'ssr', plugins: ['tempo', 'tempo:ssr-dev', 'tempo:hmr'] },
    {
      mode: 'islands',
      plugins: ['tempo', 'tempo:ssg', 'tempo:ssr-dev', 'tempo:hmr'],
    },
    {
      mode: 'hybrid',
      plugins: ['tempo', 'tempo:ssg', 'tempo:ssr-dev', 'tempo:hmr'],
    },
  ]

  it.each(modes)('registers the plugins for mode $mode', ({ mode, plugins }) => {
    expect(tempo({ mode }).map(plugin => plugin.name)).toEqual(plugins)
  })

  it('uses the build phase for SSG and the serve phase for SSR and HMR', () => {
    const plugins = tempo({ mode: 'hybrid' })
    const phases = Object.fromEntries(
      plugins.map(plugin => [plugin.name, plugin.apply])
    )
    expect(phases['tempo:ssg']).toBe('build')
    expect(phases['tempo:ssr-dev']).toBe('serve')
    expect(phases['tempo:hmr']).toBe('serve')
  })

  it.each([true, false, { errorBoundary: false }])(
    'honors the HMR option %j',
    hmr => {
      const names = tempo({ hmr }).map(plugin => plugin.name)
      expect(names.includes('tempo:hmr')).toBe(hmr !== false)
    }
  )

  it.each([true, false])('honors the devtools option %s', async devtools => {
    const root = await makeFixture({ 'index.html': template })
    const server = await createServer({
      configFile: false,
      root,
      logLevel: 'silent',
      plugins: tempo({ devtools }),
      server: { middlewareMode: true, watch: null, ws: false },
    })

    try {
      const rendered = await server.transformIndexHtml('/', template)
      expect(rendered.includes('tempo-devtools')).toBe(devtools)
    } finally {
      await server.close()
    }
  })

  it('serves nested component calls with HMR boundaries', async () => {
    const root = await makeFixture({
      'index.html': template,
      'components.ts': `
        export const Panel = (child: unknown) => child
        export const Message = () => 'hello'
      `,
      'main.ts': `
        import { Panel, Message } from './components'
        export const app = Panel(Message())
      `,
    })
    const server = await createServer({
      configFile: false,
      root,
      logLevel: 'silent',
      plugins: tempo(),
      resolve: {
        alias: {
          '@tempots/dom': fileURLToPath(import.meta.resolve('@tempots/dom')),
        },
      },
      server: { middlewareMode: true, watch: null, ws: false },
    })

    try {
      const module = (await server.transformRequest('/main.ts'))?.code
      expect(module).toMatch(/__componentBoundary.*Panel/)
      expect(module).toMatch(/__componentBoundary.*Message/)
    } finally {
      await server.close()
    }
  })

  const routeCases: {
    label: string
    options: Pick<TempoViteOptions, 'routes' | 'seedRoutes'>
    pages: Record<string, string>
  }[] = [
    {
      label: 'explicit route paths',
      options: { routes: ['/', '/about'] },
      pages: { 'index.html': '<main>/', 'about/index.html': '<main>/about' },
    },
    {
      label: 'a custom route output',
      options: { routes: [{ path: '/about', output: 'pages/about.html' }] },
      pages: { 'pages/about.html': '<main>/about' },
    },
    {
      label: 'an async route provider',
      options: { routes: async () => ['/dynamic'] },
      pages: { 'dynamic/index.html': '<main>/dynamic' },
    },
    {
      label: 'default route crawling',
      options: {},
      pages: { 'index.html': '<main>/', 'about/index.html': '<main>/about' },
    },
    {
      label: 'route crawling with custom seeds',
      options: { routes: 'crawl', seedRoutes: ['/seed'] },
      pages: { 'seed/index.html': '<main>/seed' },
    },
  ]

  it.each(routeCases)(
    'builds static pages from $label',
    async ({ options, pages }) => {
      const root = await makeFixture({
        'index.html': template,
        'server.mjs': serverEntry,
      })
      const outDir = 'site'
      await build({
        configFile: false,
        root,
        logLevel: 'silent',
        plugins: tempo({ mode: 'ssg', ssrEntry: 'server.mjs', outDir, ...options }),
        build: { outDir },
      })

      for (const [filename, content] of Object.entries(pages)) {
        const page = await readFile(join(root, outDir, filename), 'utf8')
        expect(page).toContain(`<div id="app">${content}`)
      }
    }
  )

  it('serves a rendered route through Vite with a custom template and container', async () => {
    const root = await makeFixture({
      'page.html': template.replace('id="app"', 'id="content"'),
      'server.mjs': serverEntry,
    })
    const server = await serveFixture(root, tempo({
      mode: 'ssr',
      ssrEntry: 'server.mjs',
      template: 'page.html',
      container: '#content',
    }))

    try {
      const response = await fetch(`${server.baseUrl}/about`)
      expect(response.status).toBe(200)
      expect(await response.text()).toContain(
        '<div id="content"><main>/about</main></div>'
      )
    } finally {
      await server.close()
    }
  })
})

describe("renderApp", () => {
  it("should render app to HTML string with hydration markers", async () => {
    const App = () => html.div(html.span("Hello World"));

    const result = await renderApp(App(), { hydrate: true });

    expect(result).toContain("<div");
    expect(result).toMatch(/<span [^>]*data-tempo-position=":0"[^>]*><!--tempo-node:text::0-->Hello World<\/span>/);
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
