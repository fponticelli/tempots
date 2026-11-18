import { lstat, mkdir, mkdtemp, realpath, rm, symlink } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { expect, onTestFinished, test } from 'vitest'
import { getSsgOutputPath } from '../src/ssg-path'

async function makeOutputRoot(): Promise<string> {
  const root = await mkdtemp(join(await realpath(tmpdir()), 'tempo-output-'))
  onTestFinished(() => rm(root, { recursive: true, force: true }))
  return root
}

test('resolves default and custom page files inside the output tree', async () => {
  const root = await makeOutputRoot()
  expect(getSsgOutputPath({ path: '/' }, root)).toBe(join(root, 'index.html'))
  expect(getSsgOutputPath({ path: '/guide/' }, root)).toBe(
    join(root, 'guide', 'index.html')
  )
  expect(getSsgOutputPath({ path: '/guide.html' }, root)).toBe(
    join(root, 'guide.html')
  )
  expect(getSsgOutputPath({ path: '/guide', output: 'pages/guide.html' }, root)).toBe(
    join(root, 'pages', 'guide.html')
  )
})

test('requires rooted URLs and canonical relative output paths', async () => {
  const root = await makeOutputRoot()
  expect(() => getSsgOutputPath({ path: 'guide' }, root)).toThrow(/route/)
  expect(() =>
    getSsgOutputPath({ path: '/guide', output: join(root, 'guide.html') }, root)
  ).toThrow(/output/)
  expect(() =>
    getSsgOutputPath({ path: '/guide', output: 'pages/./guide.html' }, root)
  ).toThrow(/output/)
})

test('rejects symlink ancestors and destinations before writing', async () => {
  const root = await makeOutputRoot()
  const pages = join(root, 'pages')
  await mkdir(pages)
  await symlink(pages, join(root, 'alias'), 'dir')
  await symlink(join(pages, 'guide.html'), join(root, 'guide.html'), 'file')

  expect(() => getSsgOutputPath({ path: '/alias' }, root)).toThrow(/symlink/)
  expect(() => getSsgOutputPath({ path: '/guide.html' }, root)).toThrow(/symlink/)
  await expect(lstat(join(pages, 'guide.html'))).rejects.toMatchObject({ code: 'ENOENT' })
})
