import fs from 'node:fs'
import { createServer as createHttpServer } from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import { createServer as createViteServer } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function createServer() {
  const app = express()
  const server = createHttpServer(app)

  // Create Vite server in middleware mode
  const vite = await createViteServer({
    server: { middlewareMode: true, hmr: { server } },
    appType: 'custom',
  })

  // Use Vite's connect instance as middleware
  app.use(vite.middlewares)

  app.use(async (req, res, next) => {
    const url = req.originalUrl
    const extension = path.extname(req.path)

    // Skip non-page requests (static assets, special paths, etc.)
    if (
      (req.method !== 'GET' && req.method !== 'HEAD') ||
      req.path.startsWith('/.well-known') ||
      req.path.startsWith('/@') ||
      (extension !== '' && extension !== '.html')
    ) {
      return next()
    }

    try {
      // Read the index.html template
      let template = fs.readFileSync(
        path.resolve(__dirname, 'index.html'),
        'utf-8'
      )

      // Apply Vite HTML transforms
      template = await vite.transformIndexHtml(url, template)

      // Load the server entry point
      const { render } = await vite.ssrLoadModule('/src/entry-server.ts')

      // Render the app to HTML
      const appHtml = await render(url)

      // Inject the rendered app HTML into the template
      const html = template.replace('<!--ssr-outlet-->', () => appHtml)

      // Send the HTML
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e) {
      // Fix Vite stack trace
      vite.ssrFixStacktrace(e)
      console.error(e)
      next(e)
    }
  })

  const port = Number(process.env.PORT ?? 3000)
  server.listen(port, process.env.HOST, () => {
    console.log(`\n  🚀 SSR Demo Server running at http://localhost:${port}\n`)
    console.log(`  Features demonstrated:`)
    console.log(`    - Server-side rendering with @tempots/server`)
    console.log(`    - Client-side hydration with @tempots/client`)
    console.log(`    - Reactive signals across SSR/hydration boundary`)
    console.log(`    - Interactive counter component\n`)
  })
}

createServer()
