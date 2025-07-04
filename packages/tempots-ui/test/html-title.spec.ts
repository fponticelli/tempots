import { describe, it, expect, beforeEach, vi } from 'vitest'
import { HTMLTitle } from '../src/renderables/html-title'
import { html, render, prop } from '@tempots/dom'
import { sleep } from '@tempots/std'

describe('html-title.ts', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    // Clear any existing title elements
    const existingTitles = document.head.querySelectorAll('title')
    existingTitles.forEach(title => title.remove())

    // Create a title element for the Portal to target
    const titleElement = document.createElement('title')
    document.head.appendChild(titleElement)
  })

  describe('HTMLTitle', () => {
    it('should be a function', () => {
      expect(typeof HTMLTitle).toBe('function')
    })

    it('should create a title element with static string', async () => {
      const app = html.div(HTMLTitle('Test Title'))
      const clear = render(app, document.body)

      // Wait a moment for the portal to render
      await sleep(10)

      const titleElement = document.head.querySelector('title')
      expect(titleElement).toBeTruthy()
      expect(titleElement?.textContent).toBe('Test Title')

      clear()
    })

    it('should create a title element with signal value', async () => {
      const title = prop('Dynamic Title')
      const app = html.div(HTMLTitle(title))
      const clear = render(app, document.body)

      await sleep(10)

      const titleElement = document.head.querySelector('title')
      expect(titleElement).toBeTruthy()
      expect(titleElement?.textContent).toBe('Dynamic Title')

      clear()
    })

    it('should update title when signal changes', async () => {
      const title = prop('Initial Title')
      const app = html.div(HTMLTitle(title))
      const clear = render(app, document.body)

      await sleep(10)

      let titleElement = document.head.querySelector('title')
      expect(titleElement?.textContent).toBe('Initial Title')

      // Update the signal
      title.value = 'Updated Title'
      await sleep(10)

      titleElement = document.head.querySelector('title')
      expect(titleElement?.textContent).toBe('Updated Title')

      clear()
    })

    it('should handle empty string title', async () => {
      const app = html.div(HTMLTitle(''))
      const clear = render(app, document.body)

      await sleep(10)

      const titleElement = document.head.querySelector('title')
      expect(titleElement).toBeTruthy()
      expect(titleElement?.textContent).toBe('')

      clear()
    })

    it('should handle special characters in title', async () => {
      const specialTitle = 'Title with <>&"\'` special chars'
      const app = html.div(HTMLTitle(specialTitle))
      const clear = render(app, document.body)

      await sleep(10)

      const titleElement = document.head.querySelector('title')
      expect(titleElement).toBeTruthy()
      expect(titleElement?.textContent).toBe(specialTitle)

      clear()
    })

    it('should work with multiple HTMLTitle components', async () => {
      const title1 = prop('Title 1')
      const title2 = prop('Title 2')

      const app = html.div(
        HTMLTitle(title1),
        HTMLTitle(title2)
      )
      const clear = render(app, document.body)

      await sleep(10)

      // Should have multiple title elements (though only one will be effective)
      const titleElements = document.head.querySelectorAll('title')
      expect(titleElements.length).toBeGreaterThanOrEqual(1)

      clear()
    })

    it('should clean up title content on dispose', async () => {
      const app = html.div(HTMLTitle('Temporary Title'))
      const clear = render(app, document.body)

      await sleep(10)

      let titleElement = document.head.querySelector('title')
      expect(titleElement).toBeTruthy()
      expect(titleElement?.textContent).toBe('Temporary Title')

      // Clear the component
      clear()
      await sleep(10)

      // Title element should still exist but content should be cleared
      titleElement = document.head.querySelector('title')
      expect(titleElement).toBeTruthy()
      expect(titleElement?.textContent).toBe('')
    })

    it('should handle rapid title changes', async () => {
      const title = prop('Initial')
      const app = html.div(HTMLTitle(title))
      const clear = render(app, document.body)

      await sleep(10)

      // Rapidly change the title
      title.value = 'Change 1'
      title.value = 'Change 2'
      title.value = 'Final Change'

      await sleep(20)

      const titleElement = document.head.querySelector('title')
      expect(titleElement?.textContent).toBe('Final Change')

      clear()
    })

    it('should work with long titles', async () => {
      const longTitle = 'A'.repeat(1000) // Very long title
      const app = html.div(HTMLTitle(longTitle))
      const clear = render(app, document.body)

      await sleep(10)

      const titleElement = document.head.querySelector('title')
      expect(titleElement).toBeTruthy()
      expect(titleElement?.textContent).toBe(longTitle)
      expect(titleElement?.textContent.length).toBe(1000)

      clear()
    })

    it('should handle unicode characters', async () => {
      const unicodeTitle = '🚀 Tempo App 🎉 测试 العربية'
      const app = html.div(HTMLTitle(unicodeTitle))
      const clear = render(app, document.body)

      await sleep(10)

      const titleElement = document.head.querySelector('title')
      expect(titleElement).toBeTruthy()
      expect(titleElement?.textContent).toBe(unicodeTitle)

      clear()
    })

    it('should work when rendered multiple times', async () => {
      const title = prop('First Render')

      // First render
      const app1 = html.div(HTMLTitle(title))
      const clear1 = render(app1, document.body)

      await sleep(10)

      let titleElement = document.head.querySelector('title')
      expect(titleElement?.textContent).toBe('First Render')

      clear1()
      await sleep(10)

      // Second render with different title
      title.value = 'Second Render'
      const app2 = html.div(HTMLTitle(title))
      const clear2 = render(app2, document.body)

      await sleep(10)

      titleElement = document.head.querySelector('title')
      expect(titleElement?.textContent).toBe('Second Render')

      clear2()
    })
  })
})
