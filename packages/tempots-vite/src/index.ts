import { type Plugin, type ResolvedConfig, build } from 'vite'
import { renderToString, renderToStaticMarkup } from '@tempots/server'
import type { Renderable } from '@tempots/dom'
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
   * Should export `render(url)` function or `App` component.
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

/**
 * Crawls routes starting from seed URLs, discovering new routes by
 * following internal links in rendered HTML.
 */
async function crawlRoutes(
  renderFn: (url: string) => Promise<string>,
  seedRoutes: string[],
  logger: { log: (msg: string) => void },
  failOnError = false
): Promise<string[]> {
  const discovered = new Set<string>()
  const queue = [...seedRoutes]
  const failed = new Set<string>()

  logger.log(`[tempo] Crawling routes starting from: ${seedRoutes.join(', ')}`)

  while (queue.length > 0) {
    const url = queue.shift()!
    validateSsgRoutePath(url)

    if (discovered.has(url) || failed.has(url)) {
      continue
    }

    try {
      const html = await renderFn(url)
      discovered.add(url)

      const links = extractInternalLinks(html)
      for (const link of links) {
        if (!discovered.has(link) && !failed.has(link)) {
          queue.push(link)
        }
      }
    } catch (error) {
      if (failOnError) throw error
      failed.add(url)
      logger.log(`  ⚠ Failed to render ${url}: ${error}`)
    }
  }

  logger.log(`[tempo] Discovered ${discovered.size} routes`)
  return Array.from(discovered)
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
      const containerId = container
        .replace(/^#/, '')
        .replace(/[.*+?^$(){}|[\]\\]/g, '\\$&')
      const containerRegex = new RegExp(
        `(<([a-z][\\w:-]*)\\b[^>]*\\s+id=(["'])${containerId}\\3[^>]*>)[\\s\\S]*?(<\\/\\2\\s*>)`,
        'i'
      )
      if (!containerRegex.test(templateHtml)) {
        throw new Error(
          `[tempo] Built template must contain the container ${container}`
        )
      }

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
        let ssrModule: {
          render?: (url: string) => Promise<string>
          App?: (options: { url?: string }) => Renderable
        }

        try {
          ssrModule = await import(ssrModuleUrl)
        } catch (error) {
          throw new SsgBuildError('[tempo] Failed to load SSR module', error)
        }

        let renderFn: (url: string) => Promise<string>
        if (typeof ssrModule.render === 'function') {
          renderFn = ssrModule.render
        } else if (typeof ssrModule.App === 'function') {
          const App = ssrModule.App
          renderFn = async (url: string) => {
            const renderable = App({ url })
            if (hydrate) {
              return renderToString(renderable, { generatePlaceholders: true })
            }
            return renderToStaticMarkup(renderable)
          }
        } else {
          throw new Error(
            "[tempo] SSR entry must export 'render' function or 'App' component"
          )
        }

        const renderRequired = async (url: string) => {
          try {
            const html = await renderFn(url)
            if (typeof html !== 'string')
              throw new TypeError('Expected rendered HTML')
            return html
          } catch (error) {
            throw new SsgBuildError(`[tempo] Failed to render ${url}`, error)
          }
        }
        const routes =
          typeof routesOption === 'function'
            ? normalizeRoutes(await routesOption())
            : Array.isArray(routesOption)
              ? normalizeRoutes(routesOption)
              : (
                  await crawlRoutes(renderRequired, seedRoutes, console, true)
                ).map(path => ({ path }))

        for (const route of routes) getSsgOutputPath(route, outputRoot)
        console.log(`[tempo] Generating ${routes.length} static pages...`)

        for (const route of routes) {
          const appHtml = await renderRequired(route.path)
          const html = templateHtml.replace(
            containerRegex,
            (_match, start: string, _tag, _quote, end: string) =>
              start + appHtml + end
          )
          output.stage(route, html)
        }
        output.publish()
        for (const route of routes) console.log(`  ✓ ${route.path}`)
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

        // Skip static assets and Vite internal requests
        if (
          !url ||
          url.startsWith('/@') ||
          url.startsWith('/__') ||
          url.includes('.')
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

          // Get the render function - support both patterns
          let appHtml: string

          if (typeof ssrModule.render === 'function') {
            // Pattern 1: createRenderer() style - exports { render }
            appHtml = await ssrModule.render(url)
          } else {
            // Pattern 2: Direct App export
            const App = ssrModule.default || ssrModule.App

            if (typeof App !== 'function') {
              console.warn(
                "[tempo] SSR entry must export 'render' function or 'App' component"
              )
              return next()
            }

            appHtml = await renderToString(App({ url }) as Renderable, {
              generatePlaceholders: hydrate,
            })
          }

          // Inject the rendered HTML into the template
          const html = templateHtml.replace(
            new RegExp(
              `(<[^>]*id="${container.replace('#', '')}"[^>]*>)([\\s\\S]*?)(<\\/[^>]+>)`
            ),
            `$1${appHtml}$3`
          )

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
