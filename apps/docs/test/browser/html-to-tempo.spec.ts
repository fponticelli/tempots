import { expect, test } from '@playwright/test'

test('converts HTML using the bundled Monaco editors and workers', async ({
  page,
}) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))

  await page.goto('/tool/html-to-tempo.html')
  const editorLines = page.locator('.monaco-editor .view-lines')
  await expect(editorLines).toHaveCount(2)
  await expect(editorLines.nth(1)).toContainText('Hello World!')
  await expect
    .poll(() => page.workers().map(worker => worker.url()))
    .toEqual(
      expect.arrayContaining([
        expect.stringMatching(/\/assets\/html\.worker-.*\.js$/),
        expect.stringMatching(/\/assets\/ts\.worker-.*\.js$/),
      ])
    )

  await editorLines.first().click()
  await page.keyboard.press('ControlOrMeta+a')
  await page.keyboard.insertText('<section>Upgrade smoke check</section>')
  await expect(editorLines.nth(1)).toContainText('Upgrade smoke check')
  expect(errors).toEqual([])
})
