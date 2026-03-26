import { describe, it, expect } from 'vitest'
import { transformTempoHmr } from '../src/hmr/plugin'

describe('transformTempoHmr', () => {
  it('returns null for files without render import', () => {
    const code = `
import { html } from '@tempots/dom'
const app = html.div('hello')
`
    expect(transformTempoHmr(code, 'src/main.ts')).toBeNull()
  })

  it('returns null for files that import render but do not call it', () => {
    const code = `
import { render, html } from '@tempots/dom'
const app = html.div('hello')
console.log(app)
`
    expect(transformTempoHmr(code, 'src/main.ts')).toBeNull()
  })

  it('transforms a basic render call', () => {
    const code = `import { render } from '@tempots/dom'
render(App(), document.getElementById('app')!)
`
    const result = transformTempoHmr(code, 'src/main.ts')

    expect(result).not.toBeNull()
    // Should add virtual import
    expect(result).toContain(
      "import { createHmrBoundary as __createHmrBoundary } from 'virtual:tempo-hmr-runtime'"
    )
    // Should wrap in boundary
    expect(result).toContain('__createHmrBoundary(render, () => App()')
    // Should have HMR accept/dispose
    expect(result).toContain('import.meta.hot')
    expect(result).toContain('import.meta.hot.accept')
    expect(result).toContain('import.meta.hot.dispose')
    // Should use __hmr (no suffix for single call)
    expect(result).toContain('const __hmr =')
    expect(result).toContain('__hmr.dispose')
    // Should use bare accept() (no callback) so module re-evaluates
    expect(result).toContain('import.meta.hot.accept()')
  })

  it('transforms render with options argument', () => {
    const code = `import { render } from '@tempots/dom'
render(App(), document.getElementById('app')!, { hydrate: true })
`
    const result = transformTempoHmr(code, 'src/main.ts')

    expect(result).not.toBeNull()
    expect(result).toContain(
      "__createHmrBoundary(render, () => App(), document.getElementById('app')!, { hydrate: true })"
    )
  })

  it('handles aliased render import', () => {
    const code = `import { render as mountApp } from '@tempots/dom'
mountApp(App(), document.getElementById('app')!)
`
    const result = transformTempoHmr(code, 'src/main.ts')

    expect(result).not.toBeNull()
    expect(result).toContain(
      '__createHmrBoundary(mountApp, () => App()'
    )
  })

  it('handles inline renderable expressions', () => {
    const code = `import { render, html } from '@tempots/dom'
render(html.div('hello'), document.body)
`
    const result = transformTempoHmr(code, 'src/main.ts')

    expect(result).not.toBeNull()
    expect(result).toContain(
      "__createHmrBoundary(render, () => html.div('hello'), document.body)"
    )
  })

  it('handles multiple render calls', () => {
    const code = `import { render } from '@tempots/dom'
render(App(), document.getElementById('app')!)
render(Sidebar(), document.getElementById('sidebar')!)
`
    const result = transformTempoHmr(code, 'src/main.ts')

    expect(result).not.toBeNull()
    expect(result).toContain('const __hmr_0 =')
    expect(result).toContain('const __hmr_1 =')
    expect(result).toContain('__hmr_0.dispose')
    expect(result).toContain('__hmr_1.dispose')
  })

  it('returns null for non-ts/js files', () => {
    const code = `
.app { color: red; }
`
    expect(transformTempoHmr(code, 'src/style.css')).toBeNull()
  })

  it('preserves the render import in output', () => {
    const code = `import { render } from '@tempots/dom'
render(App(), document.getElementById('app')!)
`
    const result = transformTempoHmr(code, 'src/main.ts')

    expect(result).not.toBeNull()
    expect(result).toContain("import { render } from '@tempots/dom'")
  })
})
