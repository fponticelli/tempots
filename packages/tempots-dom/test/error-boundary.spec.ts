import { expect, test } from 'vitest'
import { Catch, html, Portal, render, WithCtx } from '../src'

test('an error rolls back a partially mounted portal without removing its siblings', () => {
  const container = document.createElement('div')
  const portal = document.createElement('aside')
  portal.innerHTML = '<h2>Existing portal content</h2>'
  const clear = render(
    Catch(
      Portal(portal, html.div('partial', WithCtx(ctx => {
        ctx.makeChildText('unfinished')
        throw new Error('failed')
      }))),
      () => html.p('fallback')
    ),
    container
  )

  expect(container.textContent).toBe('fallback')
  expect(portal.innerHTML).toBe('<h2>Existing portal content</h2>')
  clear()
})
