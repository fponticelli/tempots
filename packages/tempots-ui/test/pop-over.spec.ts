import { prop, render, html, attr, When, on } from '@tempots/dom'
import { PopOver, type Placement } from '../src/renderables/pop-over'
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
    // Ensure document.body exists
    if (!document.body) {
      document.documentElement.appendChild(document.createElement('body'))
    }
    document.body.innerHTML = ''

    // Create a dedicated portal container to avoid issues with body removal
    const portalContainer = document.createElement('div')
    portalContainer.id = 'portal-container'
    document.body.appendChild(portalContainer)

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
          content: () => html.div(attr.class('custom-arrow'), 'Arrow content')
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
          content: () => html.div(attr.class('default-arrow'), 'Default arrow')
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
    const content = () => html.div(attr.class('toggle-test'), 'Toggle test')

    // Create a container element to render the popover trigger
    const container = document.createElement('div')
    document.body.appendChild(container)

    const popover = html.div(
      PopOver({
        open: isOpen,
        content,
        placement: 'right'
      })
    )

    const clear = render(popover, container)
    await sleep(10) // Increase sleep time to allow for async operations

    // Initially closed - check that content is not in the document
    expect(document.querySelector('.toggle-test')).toBeNull()

    // Open the popover
    isOpen.value = true
    await sleep(10)
    expect(document.querySelector('.toggle-test')).toBeTruthy()
    expect(document.querySelector('.toggle-test')?.textContent).toBe('Toggle test')

    // Close the popover
    isOpen.value = false
    await sleep(10)
    expect(document.querySelector('.toggle-test')).toBeNull()

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
          content: () => html.div(attr.class('padded-arrow'), 'Padded arrow')
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

  test('arrow content can use positioning payload', async () => {
    const isOpen = prop(true)
    const content = () => html.div('Arrow with positioning data')

    const popover = html.div(
      PopOver({
        open: isOpen,
        content,
        placement: 'top',
        arrow: {
          padding: 5,
          content: (arrowSignal) =>
            html.div(
              attr.class('dynamic-arrow'),
              attr.style('width: 12px; height: 12px; background: purple; position: absolute;'),
              arrowSignal.map(data =>
                `Placement: ${data.placement}, Center: ${data.centerOffset}, Size: ${data.containerWidth}x${data.containerHeight}`
              )
            )
        }
      })
    )

    const clear = render(popover, document.body)
    await sleep(0)

    // Check that arrow element is created with positioning data
    const arrowEl = document.querySelector('.dynamic-arrow') as HTMLElement
    expect(arrowEl).toBeTruthy()
    expect(arrowEl.textContent).toContain('Placement: top')
    expect(arrowEl.textContent).toContain('Center:')
    expect(arrowEl.textContent).toContain('Size:')

    clear()
  })

  test('arrow content receives positioning payload data', async () => {
    const isOpen = prop(true)
    const content = () => html.div('Arrow with payload data')

    const popover = html.div(
      PopOver({
        open: isOpen,
        content,
        placement: 'bottom',
        arrow: {
          padding: 8,
          content: (arrowSignal) =>
            html.div(
              attr.class('payload-arrow'),
              attr.style('position: absolute; width: 12px; height: 12px; background: blue;'),
              // Display some payload information as text content
              html.span(
                attr.class('payload-info'),
                arrowSignal.map(data => `${data.placement}-${data.centerOffset}`)
              )
            )
        }
      })
    )

    const clear = render(popover, document.body)
    await sleep(0)

    // Check that arrow element is created with payload data
    const arrowEl = document.querySelector('.payload-arrow') as HTMLElement
    expect(arrowEl).toBeTruthy()

    // Check that payload info is displayed
    const payloadInfo = document.querySelector('.payload-info') as HTMLElement
    expect(payloadInfo).toBeTruthy()
    expect(payloadInfo.textContent).toContain('bottom-') // Should contain placement and centerOffset

    clear()
  })

  test('popover cleans up properly when parent is disposed', async () => {
    const isOpen = prop(true)
    const showParent = prop(true)
    const content = () => html.div(attr.class('cleanup-test'), 'Cleanup test content')

    // Create a container element
    const container = document.createElement('div')
    document.body.appendChild(container)

    const parentComponent = html.div(
      PopOver({
        open: isOpen,
        content,
        placement: 'bottom'
      })
    )

    // Render the parent conditionally
    const clear = render(
      When(showParent, () => parentComponent),
      container
    )
    await sleep(10)

    // Initially, popover should be visible
    expect(document.querySelector('.cleanup-test')).toBeTruthy()

    // Hide the parent component
    showParent.value = false
    await sleep(10)

    // Popover content should be cleaned up
    expect(document.querySelector('.cleanup-test')).toBeNull()

    clear()
  })



  test('popover with complex content and event handlers', async () => {
    const isOpen = prop(true)
    const clickSpy = vi.fn()
    const inputSpy = vi.fn()

    const content = () => html.div(
      attr.class('complex-content'),
      html.h3('Complex Popover'),
      html.button(
        attr.class('popover-button'),
        on.click(clickSpy),
        'Click me'
      ),
      html.input(
        attr.class('popover-input'),
        attr.type('text'),
        on.input(inputSpy)
      )
    )

    const container = document.createElement('div')
    document.body.appendChild(container)

    const popover = html.div(
      PopOver({
        open: isOpen,
        content,
        placement: 'right'
      })
    )

    const clear = render(popover, container)
    await sleep(10)

    // Verify content is rendered
    const complexContent = document.querySelector('.complex-content')
    expect(complexContent).toBeTruthy()

    // Test button click
    const button = document.querySelector('.popover-button') as HTMLButtonElement
    expect(button).toBeTruthy()
    button.click()
    expect(clickSpy).toHaveBeenCalledTimes(1)

    // Test input event
    const input = document.querySelector('.popover-input') as HTMLInputElement
    expect(input).toBeTruthy()
    input.value = 'test'
    input.dispatchEvent(new Event('input'))
    expect(inputSpy).toHaveBeenCalledTimes(1)

    // Close popover and verify cleanup
    isOpen.value = false
    await sleep(10)
    expect(document.querySelector('.complex-content')).toBeNull()
    expect(document.querySelector('.popover-button')).toBeNull()
    expect(document.querySelector('.popover-input')).toBeNull()

    clear()
  })

  test('popover with reactive placement changes', async () => {
    const isOpen = prop(true)
    const placement = prop<Placement>('top')
    const content = () => html.div(attr.class('placement-test'), 'Placement test')

    const container = document.createElement('div')
    document.body.appendChild(container)

    const popover = html.div(
      PopOver({
        open: isOpen,
        content,
        placement
      })
    )

    const clear = render(popover, container)
    await sleep(10)

    // Verify initial content
    expect(document.querySelector('.placement-test')).toBeTruthy()

    // Change placement
    placement.value = 'bottom'
    await sleep(10)
    expect(document.querySelector('.placement-test')).toBeTruthy()

    // Change placement again
    placement.value = 'left'
    await sleep(10)
    expect(document.querySelector('.placement-test')).toBeTruthy()

    // Close and verify cleanup
    isOpen.value = false
    await sleep(10)
    expect(document.querySelector('.placement-test')).toBeNull()

    clear()
  })
})
