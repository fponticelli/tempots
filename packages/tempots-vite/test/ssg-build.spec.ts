import { mkdtemp, readFile, readdir, realpath, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { build } from 'vite'
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
