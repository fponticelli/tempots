import { type Plugin, type ResolvedConfig, build } from "vite";
import { renderToString, renderToStaticMarkup } from "@tempots/server";
import type { Renderable } from "@tempots/dom";
import * as fs from "node:fs";
import * as path from "node:path";
import { pathToFileURL } from "node:url";

/**
 * Rendering mode for the Tempo Vite plugin.
 * @public
 */
export type TempoMode = "ssg" | "ssr" | "islands" | "hybrid";

/**
 * Route configuration for SSG.
 * @public
 */
export interface RouteConfig {
  /**
   * The URL path for this route (e.g., "/", "/about", "/blog/my-post").
   */
  path: string;

  /**
   * Optional output file path. Defaults to path + "/index.html".
   */
  output?: string;
}

/**
 * Configuration options for the Tempo Vite plugin.
 * @public
 */
export interface TempoViteOptions {
  /**
   * Rendering mode.
   * - "ssg": Static Site Generation - pre-render pages at build time
   * - "ssr": Server-Side Rendering - render on each request
   * - "islands": Islands architecture - static by default, hydrate marked components
   * - "hybrid": Combine SSG for static pages with SSR for dynamic ones
   *
   * @default "ssg"
   */
  mode?: TempoMode;

  /**
   * Routes to pre-render for SSG mode.
   * Can be an array of paths/configs or a function that returns them.
   */
  routes?: string[] | RouteConfig[] | (() => Promise<string[] | RouteConfig[]>);

  /**
   * Path to the client entry file.
   * @default "src/entry-client.ts"
   */
  entry?: string;

  /**
   * Path to the server entry file for SSR/SSG.
   * Should export `render(url)` function or `App` component.
   * @default "src/entry-server.ts"
   */
  ssrEntry?: string;

  /**
   * Path to the HTML template file.
   * @default "index.html"
   */
  template?: string;

  /**
   * Selector for the app container in the template.
   * @default "#app"
   */
  container?: string;

  /**
   * Whether to generate hydration markers in the HTML.
   * Required for client-side hydration.
   * @default true for "ssr" and "islands" modes, false for "ssg"
   */
  hydrate?: boolean;

  /**
   * Output directory for SSG.
   * @default "dist"
   */
  outDir?: string;
}

/**
 * Normalizes route configuration to RouteConfig objects.
 */
function normalizeRoutes(
  routes: string[] | RouteConfig[] | undefined,
): RouteConfig[] {
  if (!routes) {
    return [{ path: "/" }];
  }

  return routes.map((route) => {
    if (typeof route === "string") {
      return { path: route };
    }
    return route;
  });
}

/**
 * Gets the output file path for a route.
 */
function getOutputPath(route: RouteConfig, outDir: string): string {
  if (route.output) {
    return path.join(outDir, route.output);
  }

  // Convert /path to /path/index.html
  let outputPath = route.path;
  if (outputPath.endsWith("/")) {
    outputPath += "index.html";
  } else if (!outputPath.endsWith(".html")) {
    outputPath += "/index.html";
  }

  return path.join(outDir, outputPath);
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
    mode = "ssg",
    routes: routesOption,
    // entry is accepted for configuration but handled by Vite's default behavior
    entry: _entry = "src/entry-client.ts",
    ssrEntry = "src/entry-server.ts",
    template = "index.html",
    container = "#app",
    hydrate = mode === "ssr" || mode === "islands",
    outDir = "dist",
  } = options;

  // Suppress unused variable warning - entry is for configuration documentation
  void _entry;

  let config: ResolvedConfig;

  const mainPlugin: Plugin = {
    name: "tempo",

    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },
  };

  // SSG plugin - generates static HTML at build time
  const ssgPlugin: Plugin = {
    name: "tempo:ssg",
    apply: "build",

    async closeBundle() {
      if (mode !== "ssg" && mode !== "hybrid") {
        return;
      }

      const resolvedRoutes =
        typeof routesOption === "function"
          ? await routesOption()
          : routesOption;
      const routes = normalizeRoutes(resolvedRoutes);

      const templatePath = path.resolve(config.root, template);
      const templateHtml = fs.readFileSync(templatePath, "utf-8");

      const ssrOutDir = path.resolve(config.root, outDir, ".ssr-temp");
      const ssrEntryPath = path.resolve(config.root, ssrEntry);

      // Check if SSR entry exists
      if (!fs.existsSync(ssrEntryPath)) {
        console.error(
          `\n[tempo] SSR entry not found: ${ssrEntry}\n` +
            `  Create an entry-server.ts that exports { render } or { App }`,
        );
        return;
      }

      console.log(`\n[tempo] Building SSR module...`);

      // Build the SSR entry module
      try {
        await build({
          configFile: false,
          root: config.root,
          logLevel: "warn",
          build: {
            ssr: ssrEntryPath,
            outDir: ssrOutDir,
            emptyOutDir: true,
            rollupOptions: {
              output: {
                format: "esm",
                entryFileNames: "entry-server.mjs",
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
        });
      } catch (error) {
        console.error(`[tempo] SSR build failed:`, error);
        return;
      }

      // Import the built SSR module
      const ssrModulePath = path.join(ssrOutDir, "entry-server.mjs");
      const ssrModuleUrl = pathToFileURL(ssrModulePath).href;

      let ssrModule: {
        render?: (url: string) => Promise<string>;
        App?: (options: { url?: string }) => Renderable;
      };

      try {
        // Add cache-busting query to avoid module caching issues
        ssrModule = await import(`${ssrModuleUrl}?t=${Date.now()}`);
      } catch (error) {
        console.error(`[tempo] Failed to load SSR module:`, error);
        return;
      }

      // Get the render function - support both patterns
      let renderFn: (url: string) => Promise<string>;

      if (typeof ssrModule.render === "function") {
        // Pattern 1: createRenderer() style - exports { render }
        renderFn = ssrModule.render;
      } else if (typeof ssrModule.App === "function") {
        // Pattern 2: Direct App export - wrap with renderToString
        const App = ssrModule.App;
        renderFn = async (url: string) => {
          const renderable = App({ url });
          if (hydrate) {
            return renderToString(renderable, { generatePlaceholders: true });
          }
          return renderToStaticMarkup(renderable);
        };
      } else {
        console.error(
          `[tempo] SSR entry must export 'render' function or 'App' component`,
        );
        return;
      }

      console.log(`[tempo] Generating ${routes.length} static pages...`);

      // Extract container ID for injection
      const containerId = container.replace("#", "");
      const containerRegex = new RegExp(
        `(<[^>]*id="${containerId}"[^>]*>)([\\s\\S]*?)(<\\/[^>]+>)`,
      );

      for (const route of routes) {
        try {
          // Render the app for this route
          const appHtml = await renderFn(route.path);

          // Inject rendered HTML into template
          const html = templateHtml.replace(containerRegex, `$1${appHtml}$3`);

          // Write to output file
          const outputPath = getOutputPath(
            route,
            path.resolve(config.root, outDir),
          );

          const outputDir = path.dirname(outputPath);
          if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
          }

          fs.writeFileSync(outputPath, html);
          console.log(`  ✓ ${route.path}`);
        } catch (error) {
          console.error(`  ✗ ${route.path}:`, error);
        }
      }

      // Clean up temporary SSR build
      try {
        fs.rmSync(ssrOutDir, { recursive: true, force: true });
      } catch {
        // Ignore cleanup errors
      }

      console.log(`[tempo] SSG complete!\n`);
    },
  };

  // SSR middleware plugin for development
  const ssrDevPlugin: Plugin = {
    name: "tempo:ssr-dev",
    apply: "serve",

    configureServer(server) {
      if (mode !== "ssr" && mode !== "hybrid") {
        return;
      }

      server.middlewares.use(async (req, res, next) => {
        const url = req.url;

        // Skip static assets and Vite internal requests
        if (
          !url ||
          url.startsWith("/@") ||
          url.startsWith("/__") ||
          url.includes(".")
        ) {
          return next();
        }

        try {
          // Load the template
          const templatePath = path.resolve(config.root, template);
          let templateHtml = fs.readFileSync(templatePath, "utf-8");

          // Apply Vite HTML transforms
          templateHtml = await server.transformIndexHtml(url, templateHtml);

          // Load the SSR entry module
          const ssrModule = await server.ssrLoadModule(
            path.resolve(config.root, ssrEntry),
          );

          // Get the render function - support both patterns
          let appHtml: string;

          if (typeof ssrModule.render === "function") {
            // Pattern 1: createRenderer() style - exports { render }
            appHtml = await ssrModule.render(url);
          } else {
            // Pattern 2: Direct App export
            const App = ssrModule.default || ssrModule.App;

            if (typeof App !== "function") {
              console.warn(
                "[tempo] SSR entry must export 'render' function or 'App' component",
              );
              return next();
            }

            appHtml = await renderToString(App({ url }) as Renderable, {
              generatePlaceholders: hydrate,
            });
          }

          // Inject the rendered HTML into the template
          const html = templateHtml.replace(
            new RegExp(
              `(<[^>]*id="${container.replace("#", "")}"[^>]*>)([\\s\\S]*?)(<\\/[^>]+>)`,
            ),
            `$1${appHtml}$3`,
          );

          res.statusCode = 200;
          res.setHeader("Content-Type", "text/html");
          res.end(html);
        } catch (error) {
          // Pass errors to Vite's error handler
          server.ssrFixStacktrace(error as Error);
          console.error("[tempo] SSR Error:", error);
          next(error);
        }
      });
    },
  };

  return [mainPlugin, ssgPlugin, ssrDevPlugin];
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
  options: { hydrate?: boolean } = {},
): Promise<string> {
  const { hydrate = true } = options;

  if (hydrate) {
    return renderToString(app, { generatePlaceholders: true });
  }

  return renderToStaticMarkup(app);
}

// Re-export types for convenience
export type { Renderable };
