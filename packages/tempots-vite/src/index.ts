import type { Plugin, ResolvedConfig } from "vite";
import { renderToString, renderToStaticMarkup } from "@tempots/server";
import type { Renderable } from "@tempots/dom";
import * as fs from "node:fs";
import * as path from "node:path";

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
   * Path to the entry file that exports the app component.
   * @default "src/App.ts" or "src/App.tsx"
   */
  entry?: string;

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
    entry = "src/App.ts",
    template = "index.html",
    container = "#app",
    hydrate = mode === "ssr" || mode === "islands",
    outDir = "dist",
  } = options;

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

      // Entry path for future SSR build integration
      void entry; // Will be used when SSR build is implemented

      console.log(`\n[tempo] Generating ${routes.length} static pages...`);

      for (const route of routes) {
        try {
          // For SSG, we need to dynamically import the built module
          // This is a simplified version - a full implementation would use Vite's SSR
          const outputPath = getOutputPath(
            route,
            path.resolve(config.root, outDir),
          );

          // Create the output directory if it doesn't exist
          const outputDir = path.dirname(outputPath);
          if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
          }

          // For now, just copy the template with a placeholder
          // A full implementation would import and render the app
          const html = templateHtml;

          fs.writeFileSync(outputPath, html);
          console.log(`  [tempo] Generated: ${route.path} -> ${outputPath}`);
        } catch (error) {
          console.error(`  [tempo] Error generating ${route.path}:`, error);
        }
      }
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

          // Load the entry module
          const entryModule = await server.ssrLoadModule(
            path.resolve(config.root, entry),
          );

          // Get the app component
          const App = entryModule.default || entryModule.App;

          if (typeof App !== "function") {
            console.warn(
              "[tempo] Entry module should export a default function or App",
            );
            return next();
          }

          // Render the app
          const appHtml = await renderToString(App({ url }) as Renderable, {
            generatePlaceholders: hydrate,
          });

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
