import { prop, render, html, attr } from '@tempots/dom'
import { PopOver } from '../src/renderables/pop-over'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { sleep } from '@tempots/std'

// Mock floating-ui functions
vi.mock('@floating-ui/dom', () => ({
  computePosition: vi.fn().mockResolvedValue({
    x: 100,
    y: 50,
    middlewareData: {
      arrow: { x: 10, y: null }
    }
  }),
  autoUpdate: vi.fn().mockReturnValue(() => {}),
  flip: vi.fn().mockReturnValue({}),
  offset: vi.fn().mockReturnValue({}),
  shift: vi.fn().mockReturnValue({}),
  arrow: vi.fn().mockReturnValue({})
}))

describe('PopOver', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    vi.clearAllMocks()
  })

  test('renders basic popover without arrow', async () => {
    const isOpen = prop(true)
    const content = () => html.div('Popover content')

    const popover = html.div(
      PopOver({
        open: isOpen,
        content,
        placement: 'top'
      })
    )

    const clear = render(popover, document.body)
    await sleep(0) // Allow for async rendering

    // Check that popover content is rendered
    expect(document.body.innerHTML).toContain('Popover content')

    clear()
  })

  test('does not render when closed', async () => {
    const isOpen = prop(false)
    const content = () => html.div('Popover content')

    const popover = html.div(
      PopOver({
        open: isOpen,
        content,
        placement: 'top'
      })
    )

    const clear = render(popover, document.body)
    await sleep(0)

    // Should not contain popover content when closed
    expect(document.body.innerHTML).not.toContain('Popover content')

    clear()
  })

  test('renders popover with arrow', async () => {
    const isOpen = prop(true)
    const content = () => html.div('Popover with arrow')

    const popover = html.div(
      PopOver({
        open: isOpen,
        content,
        placement: 'top',
        arrow: {
          padding: 5,
          content: html.div(attr.class('custom-arrow'), 'Arrow content')
        }
      })
    )

    const clear = render(popover, document.body)
    await sleep(0)

    // Check that popover content is rendered
    expect(document.body.innerHTML).toContain('Popover with arrow')

    // Check that arrow element is created with the custom content
    const arrowElements = document.querySelectorAll('.custom-arrow')
    expect(arrowElements.length).toBeGreaterThan(0)

    // Check arrow content
    const arrowEl = arrowElements[0] as HTMLElement
    expect(arrowEl.textContent).toBe('Arrow content')

    clear()
  })

  test('arrow uses default values when not specified', async () => {
    const isOpen = prop(true)
    const content = () => html.div('Popover with default arrow')

    const popover = html.div(
      PopOver({
        open: isOpen,
        content,
        placement: 'bottom',
        arrow: {
          content: html.div(attr.class('default-arrow'), 'Default arrow')
        } // Arrow with only content, padding should default to 0
      })
    )

    const clear = render(popover, document.body)
    await sleep(0)

    // Check that popover content is rendered
    expect(document.body.innerHTML).toContain('Popover with default arrow')

    // Check that arrow element is created with default content
    const arrowElements = document.querySelectorAll('.default-arrow')
    expect(arrowElements.length).toBeGreaterThan(0)

    // Check arrow content
    const arrowEl = arrowElements[0] as HTMLElement
    expect(arrowEl.textContent).toBe('Default arrow')

    clear()
  })

  test('toggles popover visibility', async () => {
    const isOpen = prop(false)
    const content = () => html.div('Toggle test')

    const popover = html.div(
      PopOver({
        open: isOpen,
        content,
        placement: 'right'
      })
    )

    const clear = render(popover, document.body)
    await sleep(0)

    // Initially closed
    expect(document.body.innerHTML).not.toContain('Toggle test')

    // Open the popover
    isOpen.value = true
    await sleep(0)
    expect(document.body.innerHTML).toContain('Toggle test')

    // Close the popover
    isOpen.value = false
    await sleep(0)
    expect(document.body.innerHTML).not.toContain('Toggle test')

    clear()
  })

  test('renders arrow with custom padding', async () => {
    const isOpen = prop(true)
    const content = () => html.div('Padded arrow popover')

    const popover = html.div(
      PopOver({
        open: isOpen,
        content,
        placement: 'left',
        arrow: {
          padding: 10,
          content: html.div(attr.class('padded-arrow'), 'Padded arrow')
        }
      })
    )

    const clear = render(popover, document.body)
    await sleep(0)

    // Check that popover content is rendered
    expect(document.body.innerHTML).toContain('Padded arrow popover')

    // Check that arrow element is created
    const arrowElements = document.querySelectorAll('.padded-arrow')
    expect(arrowElements.length).toBeGreaterThan(0)

    // Check arrow content
    const arrowEl = arrowElements[0] as HTMLElement
    expect(arrowEl.textContent).toBe('Padded arrow')

    clear()
  })
})
