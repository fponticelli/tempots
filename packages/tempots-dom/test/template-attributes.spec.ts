import { describe, expect, test, beforeEach } from 'vitest'
import {
  prop,
  render,
  html,
  Repeat,
  attr,
  dataAttr,
  aria,
  style,
  selectedClass,
} from '../src'
import { sleep } from './helper'

describe('Template-context attributes (Repeat cloning path)', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  describe('Static attributes in template rows', () => {
    test('static attr.id is baked into all cloned rows', async () => {
      const count = prop(0)
      const clear = render(
        html.div(Repeat(count, () => html.span(attr.id('test'), 'text'))),
        document.body
      )
      count.set(3)
      await sleep()
      const spans = document.querySelectorAll('span')
      expect(spans.length).toBe(3)
      for (const span of spans) {
        expect(span.getAttribute('id')).toBe('test')
      }
      clear()
    })

    test('static attr.type is baked into all cloned rows', async () => {
      const count = prop(0)
      const clear = render(
        html.div(Repeat(count, () => html.input(attr.type('checkbox')))),
        document.body
      )
      count.set(3)
      await sleep()
      const inputs = document.querySelectorAll('input')
      expect(inputs.length).toBe(3)
      for (const input of inputs) {
        expect(input.type).toBe('checkbox')
      }
      clear()
    })

    test('static attr.class (single) is baked into all cloned rows', async () => {
      const count = prop(0)
      const clear = render(
        html.div(Repeat(count, () => html.span(attr.class('active'), 'x'))),
        document.body
      )
      count.set(3)
      await sleep()
      const spans = document.querySelectorAll('span')
      expect(spans.length).toBe(3)
      for (const span of spans) {
        expect(span.classList.contains('active')).toBe(true)
      }
      clear()
    })

    test('static attr.class (multiple) is baked into all cloned rows', async () => {
      const count = prop(0)
      const clear = render(
        html.div(
          Repeat(count, () =>
            html.span(attr.class('btn'), attr.class('primary'), 'x')
          )
        ),
        document.body
      )
      count.set(3)
      await sleep()
      const spans = document.querySelectorAll('span')
      expect(spans.length).toBe(3)
      for (const span of spans) {
        expect(span.classList.contains('btn')).toBe(true)
        expect(span.classList.contains('primary')).toBe(true)
      }
      clear()
    })

    test('static dataAttr is baked into all cloned rows', async () => {
      const count = prop(0)
      const clear = render(
        html.div(
          Repeat(count, () => html.span(dataAttr('testid', 'row'), 'x'))
        ),
        document.body
      )
      count.set(3)
      await sleep()
      const spans = document.querySelectorAll('span')
      expect(spans.length).toBe(3)
      for (const span of spans) {
        expect(span.getAttribute('data-testid')).toBe('row')
      }
      clear()
    })

    test('static aria.label is baked into all cloned rows', async () => {
      const count = prop(0)
      const clear = render(
        html.div(
          Repeat(count, () => html.button(aria.label('action'), 'click'))
        ),
        document.body
      )
      count.set(3)
      await sleep()
      const buttons = document.querySelectorAll('button')
      expect(buttons.length).toBe(3)
      for (const button of buttons) {
        expect(button.getAttribute('aria-label')).toBe('action')
      }
      clear()
    })

    test('static aria.pressed is baked into all cloned rows', async () => {
      const count = prop(0)
      const clear = render(
        html.div(
          Repeat(count, () => html.button(aria.pressed(true), 'toggle'))
        ),
        document.body
      )
      count.set(3)
      await sleep()
      const buttons = document.querySelectorAll('button')
      expect(buttons.length).toBe(3)
      for (const button of buttons) {
        expect(button.getAttribute('aria-pressed')).toBe('true')
      }
      clear()
    })

    test('multiple static attrs on one element are all baked', async () => {
      const count = prop(0)
      const clear = render(
        html.div(
          Repeat(count, () =>
            html.input(
              attr.type('text'),
              attr.id('field'),
              attr.class('input-field'),
              dataAttr('testid', 'input'),
              aria.label('Name')
            )
          )
        ),
        document.body
      )
      count.set(3)
      await sleep()
      const inputs = document.querySelectorAll('input')
      expect(inputs.length).toBe(3)
      for (const input of inputs) {
        expect(input.type).toBe('text')
        expect(input.getAttribute('id')).toBe('field')
        expect(input.classList.contains('input-field')).toBe(true)
        expect(input.getAttribute('data-testid')).toBe('input')
        expect(input.getAttribute('aria-label')).toBe('Name')
      }
      clear()
    })
  })

  describe('Dynamic attributes in template rows (signal-based)', () => {
    test('signal attr is hydrated via slot and reactive', async () => {
      const title = prop('initial')
      const count = prop(0)
      const clear = render(
        html.div(Repeat(count, () => html.span(attr.title(title), 'x'))),
        document.body
      )
      count.set(3)
      await sleep()

      const spans = document.querySelectorAll('span')
      expect(spans.length).toBe(3)
      for (const span of spans) {
        expect(span.title).toBe('initial')
      }

      title.set('updated')
      await sleep()
      for (const span of spans) {
        expect(span.title).toBe('updated')
      }
      clear()
    })

    test('signal dataAttr is hydrated via slot and reactive', async () => {
      const val = prop('v1')
      const count = prop(0)
      const clear = render(
        html.div(Repeat(count, () => html.span(dataAttr('info', val), 'x'))),
        document.body
      )
      count.set(3)
      await sleep()

      const spans = document.querySelectorAll('span')
      expect(spans.length).toBe(3)
      for (const span of spans) {
        expect(span.getAttribute('data-info')).toBe('v1')
      }

      val.set('v2')
      await sleep()
      for (const span of spans) {
        expect(span.getAttribute('data-info')).toBe('v2')
      }
      clear()
    })

    test('signal aria attr is hydrated via slot and reactive', async () => {
      const label = prop('label-1')
      const count = prop(0)
      const clear = render(
        html.div(
          Repeat(count, () => html.button(aria.label(label), 'btn'))
        ),
        document.body
      )
      count.set(3)
      await sleep()

      const buttons = document.querySelectorAll('button')
      expect(buttons.length).toBe(3)
      for (const button of buttons) {
        expect(button.getAttribute('aria-label')).toBe('label-1')
      }

      label.set('label-2')
      await sleep()
      for (const button of buttons) {
        expect(button.getAttribute('aria-label')).toBe('label-2')
      }
      clear()
    })

    test('selectedClass toggles across cloned rows', async () => {
      const selected = prop(0)
      const count = prop(0)
      const clear = render(
        html.div(
          Repeat(count, pos =>
            html.span(
              selectedClass(selected, pos.index, 'active'),
              String(pos.counter)
            )
          )
        ),
        document.body
      )
      count.set(3)
      await sleep()

      const spans = document.querySelectorAll('span')
      expect(spans.length).toBe(3)
      expect(spans[0].classList.contains('active')).toBe(true)
      expect(spans[1].classList.contains('active')).toBe(false)
      expect(spans[2].classList.contains('active')).toBe(false)

      selected.set(2)
      await sleep()
      expect(spans[0].classList.contains('active')).toBe(false)
      expect(spans[1].classList.contains('active')).toBe(false)
      expect(spans[2].classList.contains('active')).toBe(true)
      clear()
    })
  })

  describe('Style attributes in template rows', () => {
    test('static style.color is rendered in all cloned rows', async () => {
      const count = prop(0)
      const clear = render(
        html.div(
          Repeat(count, () => html.span(style.color('red'), 'x'))
        ),
        document.body
      )
      count.set(3)
      await sleep()

      const spans = document.querySelectorAll('span')
      expect(spans.length).toBe(3)
      for (const span of spans) {
        expect(span.style.color).toBe('red')
      }
      clear()
    })

    test('signal style is reactive across cloned rows', async () => {
      const color = prop('blue')
      const count = prop(0)
      const clear = render(
        html.div(
          Repeat(count, () => html.span(style.color(color), 'x'))
        ),
        document.body
      )
      count.set(3)
      await sleep()

      const spans = document.querySelectorAll('span')
      expect(spans.length).toBe(3)
      for (const span of spans) {
        expect(span.style.color).toBe('blue')
      }

      color.set('green')
      await sleep()
      for (const span of spans) {
        expect(span.style.color).toBe('green')
      }
      clear()
    })

    test('multiple styles on cloned rows', async () => {
      const count = prop(0)
      const clear = render(
        html.div(
          Repeat(count, () =>
            html.span(style.color('red'), style.fontSize('14px'), 'x')
          )
        ),
        document.body
      )
      count.set(3)
      await sleep()

      const spans = document.querySelectorAll('span')
      expect(spans.length).toBe(3)
      for (const span of spans) {
        expect(span.style.color).toBe('red')
        expect(span.style.fontSize).toBe('14px')
      }
      clear()
    })
  })

  describe('Mixed static + dynamic attributes in template rows', () => {
    test('static attrs baked and dynamic attrs hydrated on same element', async () => {
      const title = prop('dynamic-title')
      const count = prop(0)
      const clear = render(
        html.div(
          Repeat(count, () =>
            html.span(
              attr.id('static-id'),
              attr.class('static-class'),
              attr.title(title),
              dataAttr('testid', 'static-data'),
              'content'
            )
          )
        ),
        document.body
      )
      count.set(3)
      await sleep()

      const spans = document.querySelectorAll('span')
      expect(spans.length).toBe(3)
      for (const span of spans) {
        expect(span.getAttribute('id')).toBe('static-id')
        expect(span.classList.contains('static-class')).toBe(true)
        expect(span.title).toBe('dynamic-title')
        expect(span.getAttribute('data-testid')).toBe('static-data')
      }

      title.set('updated-title')
      await sleep()
      for (const span of spans) {
        // Static attrs unchanged
        expect(span.getAttribute('id')).toBe('static-id')
        expect(span.classList.contains('static-class')).toBe(true)
        expect(span.getAttribute('data-testid')).toBe('static-data')
        // Dynamic attr updated
        expect(span.title).toBe('updated-title')
      }
      clear()
    })

    test('static attrs + static style + signal attr on same element', async () => {
      const label = prop('btn-label')
      const count = prop(0)
      const clear = render(
        html.div(
          Repeat(count, () =>
            html.button(
              attr.type('button'),
              attr.class('btn'),
              style.color('blue'),
              aria.label(label),
              'click'
            )
          )
        ),
        document.body
      )
      count.set(3)
      await sleep()

      const buttons = document.querySelectorAll('button')
      expect(buttons.length).toBe(3)
      for (const button of buttons) {
        expect(button.type).toBe('button')
        expect(button.classList.contains('btn')).toBe(true)
        expect(button.style.color).toBe('blue')
        expect(button.getAttribute('aria-label')).toBe('btn-label')
      }

      label.set('new-label')
      await sleep()
      for (const button of buttons) {
        expect(button.getAttribute('aria-label')).toBe('new-label')
      }
      clear()
    })

    test('rows added incrementally get correct attrs', async () => {
      const count = prop(1)
      const clear = render(
        html.div(
          Repeat(count, () =>
            html.span(attr.id('item'), style.color('red'), 'x')
          )
        ),
        document.body
      )
      await sleep()

      let spans = document.querySelectorAll('span')
      expect(spans.length).toBe(1)
      expect(spans[0].getAttribute('id')).toBe('item')
      expect(spans[0].style.color).toBe('red')

      count.set(3)
      await sleep()
      spans = document.querySelectorAll('span')
      expect(spans.length).toBe(3)
      for (const span of spans) {
        expect(span.getAttribute('id')).toBe('item')
        expect(span.style.color).toBe('red')
      }

      count.set(5)
      await sleep()
      spans = document.querySelectorAll('span')
      expect(spans.length).toBe(5)
      for (const span of spans) {
        expect(span.getAttribute('id')).toBe('item')
        expect(span.style.color).toBe('red')
      }
      clear()
    })

    test('rows removed then re-added get correct attrs', async () => {
      const count = prop(3)
      const clear = render(
        html.div(
          Repeat(count, () =>
            html.span(
              attr.class('item'),
              dataAttr('testid', 'row'),
              style.color('green'),
              'x'
            )
          )
        ),
        document.body
      )
      await sleep()

      let spans = document.querySelectorAll('span')
      expect(spans.length).toBe(3)

      count.set(0)
      await sleep()
      spans = document.querySelectorAll('span')
      expect(spans.length).toBe(0)

      count.set(4)
      await sleep()
      spans = document.querySelectorAll('span')
      expect(spans.length).toBe(4)
      for (const span of spans) {
        expect(span.classList.contains('item')).toBe(true)
        expect(span.getAttribute('data-testid')).toBe('row')
        expect(span.style.color).toBe('green')
      }
      clear()
    })
  })
})
