import { mkdtemp, readFile, readdir, realpath, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { build, createServer } from 'vite'
import { expect, onTestFinished, test } from 'vitest'
import { tempo, type TempoViteOptions } from '../src'

const template = '<!doctype html><html><body><div id="app"></div></body></html>'

async function makeSite(entry?: string, html = template) {
  const root = await mkdtemp(join(await realpath(tmpdir()), 'tempo-ssg-'))
  onTestFinished(() => rm(root, { recursive: true, force: true }))
  await writeFile(join(root, 'index.html'), html)
  if (entry !== undefined) await writeFile(join(root, 'server.mjs'), entry)
  return root
}

function buildSite(root: string, options: Partial<TempoViteOptions> = {}) {
  return build({
    root,
    configFile: false,
    logLevel: 'silent',
    plugins: tempo({ mode: 'ssg', ssrEntry: 'server.mjs', hmr: false, ...options }),
  })
}

test.each([
  ['missing entry', undefined, /entry not found/i],
  ['failed import', 'throw new Error("import failed")', /load SSR module/i],
  ['missing render export', 'export const data = 1', /must export/i],
])('rejects %s and removes temporary output', async (_name, entry, message) => {
  const root = await makeSite(entry)
  await expect(buildSite(root)).rejects.toThrow(message)
  expect(await readdir(join(root, 'dist'))).toEqual(['index.html'])
})

test.each([['explicit routes', ['/', '/error']], ['crawled routes', 'crawl']] as const)(
  'rejects a required page failure in %s before publishing any pages',
  async (_name, routes) => {
    const root = await makeSite(`
      export function render(url) {
        if (url === '/error') throw new Error('render failed')
        return '<main><a href="/error">Example</a></main>'
      }
    `)
    await expect(buildSite(root, { routes: routes === 'crawl' ? routes : [...routes] }))
      .rejects.toThrow(/render \/error/i)
    expect(await readFile(join(root, 'dist', 'index.html'), 'utf8')).toContain('<div id="app"></div>')
    expect(await readdir(join(root, 'dist'))).toEqual(['index.html'])
  }
)

test('rejects a built template without the configured container', async () => {
  const root = await makeSite('export function render() { return "content" }')
  await expect(buildSite(root, { container: '#missing' })).rejects.toThrow(/container #missing/i)
})

test('preserves dollar sequences in rendered HTML', async () => {
  const content = '<p>$1 $& $3</p>'
  const root = await makeSite(`export function render() { return ${JSON.stringify(content)} }`)
  await buildSite(root, { routes: ['/'] })
  expect(await readFile(join(root, 'dist', 'index.html'), 'utf8')).toContain(content)
})

const islandEntry = `
  export function App() {
    return {
      render(ctx) {
        const main = ctx.makeChildElement('main');
        main.makeChildElement('h1').makeChildText('Static article');
        const island = main.makeChildElement('div');
        island.makeAccessors('data-tempo-island').set('Counter');
        island.makeAccessors('data-tempo-options').set('{"initial":3}');
        island.makeChildText('3');
        return () => {};
      },
    };
  }
`

test('islands mode pre-renders static content and only the requested island markers', async () => {
  const root = await makeSite(islandEntry)
  await buildSite(root, { mode: 'islands', routes: ['/', '/guide'] })

  for (const page of ['index.html', 'guide/index.html']) {
    const html = await readFile(join(root, 'dist', page), 'utf8')
    expect(html).toContain('<h1>Static article</h1>')
    expect(html).toContain('data-tempo-island="Counter"')
    expect(html).toContain('data-tempo-options="{&quot;initial&quot;:3}"')
    expect(html).not.toContain('data-tempo-id')
  }
})

test('islands mode renders the same markers through the dev server', async () => {
  const root = await makeSite(islandEntry)
  const server = await createServer({
    root,
    configFile: false,
    logLevel: 'silent',
    plugins: tempo({ mode: 'islands', ssrEntry: 'server.mjs', hmr: false }),
    server: { host: '127.0.0.1', port: 0, watch: null, ws: false },
  })
  try {
    await server.listen()
    const address = server.httpServer?.address()
    if (address == null || typeof address === 'string') {
      throw new Error('Expected a Vite HTTP server address')
    }
    const response = await fetch(`http://127.0.0.1:${address.port}/guide`)
    expect(response.status).toBe(200)
    const html = await response.text()
    expect(html).toContain('<h1>Static article</h1>')
    expect(html).toContain('data-tempo-island="Counter"')
  } finally {
    await server.close()
  }
})

const routeAwareApp = `
  export default function App({ url }) {
    return { render(ctx) {
      ctx.makeChildElement('p').makeChildText(url);
      ctx.makeChildElement('strong').makeChildText(
        new URL(ctx.container.currentURL.value).pathname
      );
      return () => {};
    } };
  }
`

test('SSG accepts a default App and initializes the headless route URL', async () => {
  const root = await makeSite(routeAwareApp)
  await buildSite(root, { routes: ['/guide.html'] })
  const html = await readFile(join(root, 'dist', 'guide.html'), 'utf8')
  expect(html).toContain('<p>/guide.html</p><strong>/guide.html</strong>')
})

test('Vite development passes page URLs and query strings to the same App contract', async () => {
  const root = await makeSite(routeAwareApp)
  const server = await createServer({
    root,
    configFile: false,
    logLevel: 'silent',
    plugins: tempo({ mode: 'ssr', ssrEntry: 'server.mjs', hydrate: false, hmr: false }),
    server: { host: '127.0.0.1', port: 0, watch: null, ws: false },
  })
  try {
    await server.listen()
    const address = server.httpServer?.address()
    if (address == null || typeof address === 'string') {
      throw new Error('Expected a Vite HTTP server address')
    }
    const response = await fetch(`http://127.0.0.1:${address.port}/guide.html?format=a.b`)
    expect(response.status).toBe(200)
    expect(await response.text()).toContain(
      '<p>/guide.html?format=a.b</p><strong>/guide.html</strong>'
    )
  } finally {
    await server.close()
  }
})

test('publishes the HTML from each route’s first and only crawl render', async () => {
  const root = await makeSite(`
    const visited = new Set();
    export function render(route) {
      if (visited.has(route)) throw new Error('rendered twice');
      visited.add(route);
      return route === '/'
        ? '<a href="/guide.html">Open guide</a><a href="/guide.html#section">Section</a>'
        : '<h1>Guide</h1><a href="/">Back</a>';
    }
  `)

  await buildSite(root)
  expect(await readFile(join(root, 'dist', 'index.html'), 'utf8')).toContain('Open guide')
  expect(await readFile(join(root, 'dist', 'guide.html'), 'utf8')).toContain('<h1>Guide</h1>')
})
