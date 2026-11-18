import { type Plugin, type ResolvedConfig, build } from 'vite'
import { renderToString, renderToStaticMarkup } from '@tempots/server'
import { domRenderable, type Renderable } from '@tempots/dom'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { pathToFileURL } from 'node:url'
import { tempoHmrPlugin } from './hmr/plugin'
import { getSsgOutputPath, validateSsgRoutePath } from './ssg-path'
import { makeSsgOutput, SsgBuildError, SsgRecoveryError } from './ssg-output'

/**
 * Rendering mode for the Tempo Vite plugin.
 * @public
 */
export type TempoMode = 'spa' | 'ssg' | 'ssr' | 'islands' | 'hybrid'

/**
 * HMR configuration options.
 * @public
 */
export interface TempoHmrOptions {
  /**
   * Inject a Catch error boundary around the root renderable
   * during HMR updates.
   * @default true
   */
  errorBoundary?: boolean
}

/**
 * Route configuration for SSG.
 * @public
 */
export interface RouteConfig {
  /**
   * The URL path for this route (e.g., "/", "/about", "/blog/my-post").
   */
  path: string

  /**
   * Optional file path relative to the output directory. Defaults to the
   * route path plus "/index.html" unless the route already ends in ".html".
   */
  output?: string
}

/**
 * Configuration options for the Tempo Vite plugin.
 * @public
 */
export interface TempoViteOptions {
  /**
   * Rendering mode.
   * - "spa": Single-Page Application - pure client-side rendering, no SSR/SSG pipeline
   * - "ssg": Static Site Generation - pre-render pages at build time
   * - "ssr": Server-Side Rendering - render on each request
   * - "islands": Pre-render routes for production and render on demand in development.
   *   Use @tempots/client to activate the marked islands.
   * - "hybrid": Combine SSG for static pages with SSR for dynamic ones
   *
   * @default "spa"
   */
  mode?: TempoMode

  /**
   * Routes to pre-render for SSG mode.
   * - Array: Explicit list of routes to render
   * - Function: Async function that returns routes
   * - 'crawl': Automatically discover routes by crawling links (default)
   *
   * @default 'crawl'
   */
  routes?:
    | string[]
    | RouteConfig[]
    | (() => Promise<string[] | RouteConfig[]>)
    | 'crawl'

  /**
   * Seed routes for crawl mode. Crawling starts from these URLs.
   * @default ['/']
   */
  seedRoutes?: string[]

  /**
   * Path to the client entry file.
   * @default "src/entry-client.ts"
   */
  entry?: string

  /**
   * Path to the server entry file for SSR/SSG.
   * Should export `render(url)` or an app component as `App` or the default export.
   * @default "src/entry-server.ts"
   */
  ssrEntry?: string

  /**
   * Path to the HTML template file.
   * @default "index.html"
   */
  template?: string

  /**
   * Selector for the app container in the template.
   * @default "#app"
   */
  container?: string

  /**
   * Whether to generate full-tree hydration markers for an App export.
   * Island attributes are authored by the app and work independently.
   * @default true for "ssr", false for other modes
   */
  hydrate?: boolean

  /**
   * Output directory for SSG.
   * @default "dist"
   */
  outDir?: string

  /**
   * HMR configuration. Set to false to disable.
   * Enabled by default in dev mode.
   * @default true
   */
  hmr?: boolean | TempoHmrOptions

  /**
   * Enable Tempo DevTools panel in dev mode.
   * Shows signal inspector and performance profiler.
   * @default false
   */
  devtools?: boolean
}

/**
 * Normalizes route configuration to RouteConfig objects.
 */
function normalizeRoutes(
  routes: string[] | RouteConfig[] | undefined
): RouteConfig[] {
  if (!routes) {
    return [{ path: '/' }]
  }

  return routes.map(route => {
    if (typeof route === 'string') {
      return { path: route }
    }
    return route
  })
}

/**
 * Extracts internal links from HTML content.
 * Filters to paths starting with / (excluding // protocol-relative URLs)
 * and excludes static assets (URLs containing a dot in the path).
 */
function extractInternalLinks(html: string): string[] {
  const hrefRegex = /href=["']([^"']+)["']/g
  const links = new Set<string>()
  let match

  while ((match = hrefRegex.exec(html)) !== null) {
    const href = match[1]

    // Must start with / but not // (protocol-relative)
    if (!href.startsWith('/') || href.startsWith('//')) {
      continue
    }

    // Remove hash and query string
    const cleanPath = href.split('#')[0].split('?')[0]

    // Skip static assets (paths with file extensions in the last segment)
    // e.g., /assets/style.css, /images/logo.png
    // But allow /page.html style routes
    const lastSegment = cleanPath.split('/').pop() || ''
    if (lastSegment.includes('.') && !lastSegment.endsWith('.html')) {
      continue
    }

    if (cleanPath) {
      links.add(cleanPath)
    }
  }

  return Array.from(links)
}

type CrawlLogger = { log: (msg: string) => void }

async function* crawlRenderedRoutes(
  renderFn: (url: string) => Promise<string>,
  seedRoutes: string[],
  logger: CrawlLogger,
  failOnError: boolean
): AsyncGenerator<{ path: string; html: string }> {
  const queued = new Set(seedRoutes)
  const queue = Array.from(queued)
  let discovered = 0
  logger.log(`[tempo] Crawling routes starting from: ${seedRoutes.join(', ')}`)

  for (let i = 0; i < queue.length; i++) {
    const url = queue[i]
    validateSsgRoutePath(url)
    let html: string
    try {
      html = await renderFn(url)
      for (const link of extractInternalLinks(html)) {
        if (queued.has(link)) continue
        queued.add(link)
        queue.push(link)
      }
    } catch (error) {
      if (failOnError) throw error
      logger.log(`  ⚠ Failed to render ${url}: ${error}`)
      continue
    }
    discovered++
    yield { path: url, html }
  }

  logger.log(`[tempo] Discovered ${discovered} routes`)
}

/** Crawls rendered links and returns the discovered route paths. */
async function crawlRoutes(
  renderFn: (url: string) => Promise<string>,
  seedRoutes: string[],
  logger: CrawlLogger,
  failOnError = false
): Promise<string[]> {
  const routes: string[] = []
  for await (const route of crawlRenderedRoutes(
    renderFn,
    seedRoutes,
    logger,
    failOnError
  )) {
    routes.push(route.path)
  }
  return routes
}

type ServerApp = (options: { url: string }) => Renderable
type ServerEntry = {
  render?: (url: string) => string | Promise<string>
  App?: ServerApp
  default?: ServerApp
}

function adaptServerEntry(
  entry: ServerEntry,
  {
    container,
    hydrate,
    origin = 'https://example.com',
  }: {
    container: string
    hydrate: boolean
    origin?: string
  }
): (url: string) => Promise<string> {
  if (typeof entry.render === 'function') {
    const render = entry.render
    return async url => {
      const html = await render(url)
      if (typeof html !== 'string')
        throw new TypeError('Expected rendered HTML')
      return html
    }
  }

  const App = typeof entry.App === 'function' ? entry.App : entry.default
  if (typeof App !== 'function') {
    throw new Error(
      "[tempo] SSR entry must export 'render' or an App component"
    )
  }

  return url =>
    renderToString(
      domRenderable(ctx => App({ url }).render(ctx)),
      {
        url: new URL(url, origin).href,
        selector: container,
        generatePlaceholders: hydrate,
      }
    )
}

function devOrigin(
  config: ResolvedConfig,
  host: string | undefined
): string | undefined {
  if (config.server.origin) return config.server.origin
  return host === undefined
    ? undefined
    : `${config.server.https ? 'https:' : 'http:'}//${host}`
}

function makeTemplateInjector(templateHtml: string, container: string) {
  const containerId = container
    .replace(/^#/, '')
    .replace(/[.*+?^$(){}|[\]\\]/g, '\\$&')
  const containerRegex = new RegExp(
    `(<([a-z][\\w:-]*)\\b[^>]*\\s+id=(["'])${containerId}\\3[^>]*>)[\\s\\S]*?(<\\/\\2\\s*>)`,
    'i'
  )
  if (!containerRegex.test(templateHtml)) {
    throw new Error(
      `[tempo] HTML template must contain the container ${container}`
    )
  }
  return (appHtml: string) =>
    templateHtml.replace(
      containerRegex,
      (_match, start: string, _tag, _quote, end: string) =>
        start + appHtml + end
    )
}

/**
 * Creates the Tempo Vite plugin.
 *
 * @example
 * ```typescript
 * // vite.config.ts
 * import { tempo } from '@tempots/vite'
 *
 * export default {
 *   plugins: [
 *     tempo({
 *       mode: 'ssg',
 *       routes: ['/', '/about', '/contact'],
 *     })
 *   ]
 * }
 * ```
 *
 * @param options - Plugin configuration options.
 * @returns An array of Vite plugins.
 * @public
 */
export function tempo(options: TempoViteOptions = {}): Plugin[] {
  const {
    mode = 'spa',
    routes: routesOption = 'crawl',
    seedRoutes = ['/'],
    // entry is accepted for configuration but handled by Vite's default behavior
    entry: _entry = 'src/entry-client.ts',
    ssrEntry = 'src/entry-server.ts',
    template = 'index.html',
    container = '#app',
    hydrate = mode === 'ssr',
    outDir = 'dist',
    hmr = true,
    devtools = false,
  } = options

  // Suppress unused variable warning - entry is for configuration documentation
  void _entry

  let config: ResolvedConfig

  const mainPlugin: Plugin = {
    name: 'tempo',

    configResolved(resolvedConfig) {
      config = resolvedConfig
    },
  }

  // SSG plugin - generates static HTML at build time
  const ssgPlugin: Plugin = {
    name: 'tempo:ssg',
    apply: 'build',

    async closeBundle() {
      const outPath = path.resolve(config.root, outDir)
      const builtTemplatePath = path.join(outPath, 'index.html')
      if (!fs.existsSync(builtTemplatePath)) {
        throw new Error(
          `[tempo] Built template not found: ${builtTemplatePath}`
        )
      }
      const templateHtml = fs.readFileSync(builtTemplatePath, 'utf-8')
      const inject = makeTemplateInjector(templateHtml, container)

      const ssrEntryPath = path.resolve(config.root, ssrEntry)
      if (!fs.existsSync(ssrEntryPath)) {
        throw new Error(`[tempo] SSR entry not found: ${ssrEntry}`)
      }
      const outputRoot = fs.realpathSync(outPath)
      const staging = fs.mkdtempSync(path.join(outputRoot, '.tempo-ssg-'))
      const ssrOutDir = path.join(staging, 'server')
      const output = makeSsgOutput(outputRoot, staging)

      let preserveStaging = false
      try {
        console.log(`\n[tempo] Building SSR module...`)
        try {
          await build({
            configFile: false,
            root: config.root,
            logLevel: 'warn',
            build: {
              ssr: ssrEntryPath,
              outDir: ssrOutDir,
              emptyOutDir: true,
              copyPublicDir: false,
              rollupOptions: {
                output: {
                  format: 'esm',
                  entryFileNames: 'entry-server.mjs',
                },
              },
            },
            // Suppress console output during SSR build
            customLogger: {
              ...config.logger,
              info: () => {},
              warn: config.logger.warn,
              error: config.logger.error,
              warnOnce: config.logger.warnOnce,
              hasWarned: config.logger.hasWarned,
              clearScreen: () => {},
              hasErrorLogged: config.logger.hasErrorLogged,
            },
          })
        } catch (error) {
          throw new SsgBuildError('[tempo] SSR build failed', error)
        }

        const ssrModuleUrl = pathToFileURL(
          path.join(ssrOutDir, 'entry-server.mjs')
        ).href
        let ssrModule: ServerEntry

        try {
          ssrModule = await import(ssrModuleUrl)
        } catch (error) {
          throw new SsgBuildError('[tempo] Failed to load SSR module', error)
        }

        const renderFn = adaptServerEntry(ssrModule, { container, hydrate })
        const renderRequired = async (url: string) => {
          try {
            return await renderFn(url)
          } catch (error) {
            throw new SsgBuildError(`[tempo] Failed to render ${url}`, error)
          }
        }
        const stagedRoutes: string[] = []
        const stage = (route: RouteConfig, html: string) => {
          output.stage(route, inject(html))
          stagedRoutes.push(route.path)
        }
        if (routesOption === 'crawl') {
          for await (const { path, html } of crawlRenderedRoutes(
            renderRequired,
            seedRoutes,
            console,
            true
          )) {
            stage({ path }, html)
          }
        } else {
          const routes = normalizeRoutes(
            typeof routesOption === 'function'
              ? await routesOption()
              : routesOption
          )
          for (const route of routes) getSsgOutputPath(route, outputRoot)
          for (const route of routes)
            stage(route, await renderRequired(route.path))
        }

        console.log(`[tempo] Publishing ${stagedRoutes.length} static pages...`)
        output.publish()
        for (const route of stagedRoutes) console.log(`  ✓ ${route}`)
      } catch (error) {
        preserveStaging = error instanceof SsgRecoveryError
        throw error
      } finally {
        if (!preserveStaging)
          fs.rmSync(staging, { recursive: true, force: true })
      }

      console.log(`[tempo] SSG complete!\n`)
    },
  }

  // SSR middleware plugin for development
  const ssrDevPlugin: Plugin = {
    name: 'tempo:ssr-dev',
    apply: 'serve',

    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url

        if (!url) return next()
        const pathname = url.split('?')[0]
        const extension = path.extname(pathname)

        // Page URLs can end in .html. Other assets and Vite internals pass through.
        if (
          pathname.startsWith('/@') ||
          pathname.startsWith('/__') ||
          url.includes('?html-proxy') ||
          (extension !== '' && extension !== '.html')
        ) {
          return next()
        }

        try {
          // Load the template
          const templatePath = path.resolve(config.root, template)
          let templateHtml = fs.readFileSync(templatePath, 'utf-8')

          // Apply Vite HTML transforms
          templateHtml = await server.transformIndexHtml(url, templateHtml)

          // Load the SSR entry module
          const ssrModule = await server.ssrLoadModule(
            path.resolve(config.root, ssrEntry)
          )

          const render = adaptServerEntry(ssrModule, {
            container,
            hydrate,
            origin: devOrigin(config, req.headers.host),
          })
          const appHtml = await render(url)
          const html = makeTemplateInjector(templateHtml, container)(appHtml)

          res.statusCode = 200
          res.setHeader('Content-Type', 'text/html')
          res.end(html)
        } catch (error) {
          // Pass errors to Vite's error handler
          server.ssrFixStacktrace(error as Error)
          console.error('[tempo] SSR Error:', error)
          next(error)
        }
      })
    },
  }

  const hmrEnabled = hmr !== false
  const plugins: Plugin[] = [mainPlugin]

  if (mode === 'ssg' || mode === 'hybrid' || mode === 'islands') {
    plugins.push(ssgPlugin)
  }
  if (mode === 'ssr' || mode === 'hybrid' || mode === 'islands') {
    plugins.push(ssrDevPlugin)
  }

  if (hmrEnabled) {
    plugins.push(tempoHmrPlugin(true, devtools))
  }

  return plugins
}

/**
 * Helper to render a Tempo app to HTML string.
 * Useful for custom SSR setups.
 *
 * @param app - The app renderable to render.
 * @param options - Render options.
 * @returns The rendered HTML string.
 * @public
 */
export async function renderApp(
  app: Renderable,
  options: { hydrate?: boolean } = {}
): Promise<string> {
  const { hydrate = true } = options

  if (hydrate) {
    return renderToString(app, { generatePlaceholders: true })
  }

  return renderToStaticMarkup(app)
}

// Re-export types for convenience
export type { Renderable }

// Export utilities for testing
export { extractInternalLinks, crawlRoutes }
