import { renderToString } from '@tempots/server'
import { App } from './components/app'
import * as fs from 'node:fs'
import * as path from 'node:path'

// Load toc.json at module init time
const tocPath = path.resolve(process.cwd(), 'public/toc.json')
const toc = JSON.parse(fs.readFileSync(tocPath, 'utf-8'))

// Store original fetch for external requests
const originalFetch = globalThis.fetch

/**
 * Custom fetch that handles relative URLs by reading from dist folder.
 * This is needed because Node.js fetch doesn't support relative URLs.
 */
function ssrFetch(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  if (typeof input === 'string' && input.startsWith('/')) {
    // Serve from public folder during build, dist folder after client build
    const publicPath = path.resolve(process.cwd(), 'public', input.slice(1))
    const distPath = path.resolve(process.cwd(), 'dist', input.slice(1))

    const filePath = fs.existsSync(distPath) ? distPath : publicPath

    try {
      const content = fs.readFileSync(filePath, 'utf-8')
      return Promise.resolve(
        new Response(content, {
          status: 200,
          headers: { 'Content-Type': 'text/html' },
        })
      )
    } catch {
      return Promise.resolve(new Response('Not found', { status: 404 }))
    }
  }

  // External requests use original fetch
  return originalFetch(input, init)
}

/**
 * Renders the app to an HTML string for the given URL.
 * Used by @tempots/vite during SSG build.
 */
export async function render(url: string): Promise<string> {
  // Install custom fetch for this render
  globalThis.fetch = ssrFetch

  try {
    const html = await renderToString(App(toc), {
      url: `https://tempo-ts.com${url}`,
      selector: '#app',
      generatePlaceholders: true,
    })
    return html
  } finally {
    // Restore original fetch
    globalThis.fetch = originalFetch
  }
}

export { App }
