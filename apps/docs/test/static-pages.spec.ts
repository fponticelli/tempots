import { readFile } from 'node:fs/promises'
import { load } from 'cheerio'
import { expect, test } from 'vitest'
import type { Toc } from '../src/model/domain'

const readDist = (path: string) =>
  readFile(new URL(`../dist/${path}`, import.meta.url), 'utf8')

test('generated docs contain their article content and identify it for client startup', async () => {
  const toc: Toc = JSON.parse(await readDist('toc.json'))
  expect(toc.pages.length).toBeGreaterThan(1)

  for (const page of toc.pages) {
    const output = page.path === 'index' ? 'index.html' : `page/${page.path}.html`
    const html = load(await readDist(output))
    const source = load(await readDist(`pages/${page.path}.html`), {}, false)
    const article = html('[data-tempo-doc-page]')

    expect(article.length, output).toBe(1)
    expect(article.attr('data-tempo-doc-page'), output).toBe(page.path)
    expect(article.text(), output).toBe(source.root().text())
    expect(article.text(), output).not.toContain('loading...')
    expect(article.find('h1, h2').length, output).toBeGreaterThan(0)
  }
})
