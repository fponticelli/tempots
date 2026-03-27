import { describe, it, expect } from 'vitest'
import { transformTempoHmr, transformComponentHmr } from '../src/hmr/plugin'

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
      "__createHmrBoundary(render, () => App(), document.getElementById('app')!, { hydrate: true }, __hmr_props, 'src/main.ts')"
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
      "__createHmrBoundary(render, () => html.div('hello'), document.body, undefined, __hmr_props, 'src/main.ts')"
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

  describe('prop labeling', () => {
    it('should label prop() assigned to const', () => {
      const code = `import { render, prop } from '@tempots/dom'
const count = prop(0)
render(App(), '#app')`
      const result = transformTempoHmr(code, 'src/main.ts')

      expect(result).not.toBeNull()
      expect(result).toContain("count.__hmr_label = 'count'")
    })

    it('should label localStorageProp() assigned to const', () => {
      const code = `import { render, localStorageProp } from '@tempots/dom'
const state = localStorageProp({ key: 'app', defaultValue: {} })
render(App(), '#app')`
      const result = transformTempoHmr(code, 'src/main.ts')

      expect(result).not.toBeNull()
      expect(result).toContain("state.__hmr_label = 'state'")
    })

    it('should label sessionStorageProp and storedProp', () => {
      const code = `import { render, sessionStorageProp, storedProp, MemoryStore } from '@tempots/dom'
const data = sessionStorageProp({ key: 'data', defaultValue: '' })
const cache = storedProp(new MemoryStore(), { key: 'cache', defaultValue: 0 })
render(App(), '#app')`
      const result = transformTempoHmr(code, 'src/main.ts')

      expect(result).not.toBeNull()
      expect(result).toContain("data.__hmr_label = 'data'")
      expect(result).toContain("cache.__hmr_label = 'cache'")
    })

    it('should not label signal() or computed()', () => {
      const code = `import { render, prop, signal, computed } from '@tempots/dom'
const count = prop(0)
const s = signal(0)
const c = computed(() => count.value * 2, [count])
render(App(), '#app')`
      const result = transformTempoHmr(code, 'src/main.ts')

      expect(result).not.toBeNull()
      expect(result).toContain("count.__hmr_label = 'count'")
      expect(result).not.toContain("s.__hmr_label")
      expect(result).not.toContain("c.__hmr_label")
    })

    it('should not label prop() not assigned to a variable', () => {
      const code = `import { render, prop } from '@tempots/dom'
doSomething(prop(0))
render(App(), '#app')`
      const result = transformTempoHmr(code, 'src/main.ts')

      expect(result).not.toBeNull()
      expect(result).not.toContain('__hmr_label')
    })

    it('should generate __hmr_props array with labeled props', () => {
      const code = `import { render, prop } from '@tempots/dom'
const count = prop(0)
const name = prop('hello')
render(App(), '#app')`
      const result = transformTempoHmr(code, 'src/main.ts')

      expect(result).not.toBeNull()
      expect(result).toContain('const __hmr_props = [count, name]')
    })

    it('should generate empty __hmr_props when no props labeled', () => {
      const code = `import { render } from '@tempots/dom'
render(App(), '#app')`
      const result = transformTempoHmr(code, 'src/main.ts')

      expect(result).not.toBeNull()
      expect(result).toContain('const __hmr_props = []')
    })

    it('should pass __hmr_props and module ID to createHmrBoundary', () => {
      const code = `import { render, prop } from '@tempots/dom'
const count = prop(0)
render(App(), '#app')`
      const result = transformTempoHmr(code, 'src/main.ts')

      expect(result).not.toBeNull()
      expect(result).toContain('__hmr_props')
      expect(result).toContain("'src/main.ts'")
    })

    it('should handle let and var declarations', () => {
      const code = `import { render, prop } from '@tempots/dom'
let count = prop(0)
var name = prop('hello')
render(App(), '#app')`
      const result = transformTempoHmr(code, 'src/main.ts')

      expect(result).not.toBeNull()
      expect(result).toContain("count.__hmr_label = 'count'")
      expect(result).toContain("name.__hmr_label = 'name'")
    })
  })
})

describe('transformComponentHmr', () => {
  it('should return null for non-ts/js files', () => {
    const code = `import { ItemLink } from './item-link'`
    expect(transformComponentHmr(code, 'src/style.css')).toBeNull()
  })

  it('should return null when no relative PascalCase imports', () => {
    const code = `import { loadRoute } from './route'
import { When } from '@tempots/dom'
loadRoute()
When(true, () => 'yes')`
    expect(transformComponentHmr(code, 'src/app.ts')).toBeNull()
  })

  it('should return null when PascalCase imports are from packages', () => {
    const code = `import { When, ForEach } from '@tempots/dom'
When(true, () => 'yes')`
    expect(transformComponentHmr(code, 'src/app.ts')).toBeNull()
  })

  it('should wrap PascalCase function calls from relative imports', () => {
    const code = `import { ItemLink } from './item-link'
html.li(ItemLink(item))`
    const result = transformComponentHmr(code, 'src/page-feed.ts')

    expect(result).not.toBeNull()
    expect(result).toContain('__componentBoundary')
    expect(result).toContain("'./item-link'")
    expect(result).toContain("'ItemLink'")
    expect(result).toContain('(ItemLink) => ItemLink(item)')
  })

  it('should not wrap camelCase function calls from relative imports', () => {
    const code = `import { ItemLink, formatItem } from './item-link'
html.li(ItemLink(item), formatItem(item))`
    const result = transformComponentHmr(code, 'src/page-feed.ts')

    expect(result).not.toBeNull()
    expect(result).toContain('__componentBoundary')
    expect(result).toContain('formatItem(item)')
    expect(result).not.toContain("'formatItem'")
  })

  it('should add dependency accept for each wrapped module', () => {
    const code = `import { ItemLink } from './item-link'
import { Pagination } from './pagination'
html.div(ItemLink(item), Pagination(data))`
    const result = transformComponentHmr(code, 'src/page-feed.ts')

    expect(result).not.toBeNull()
    expect(result).toContain("import.meta.hot.accept('./item-link'")
    expect(result).toContain("import.meta.hot.accept('./pagination'")
    expect(result).toContain('__hmrNotify')
  })

  it('should add virtual module import', () => {
    const code = `import { ItemLink } from './item-link'
html.li(ItemLink(item))`
    const result = transformComponentHmr(code, 'src/page-feed.ts')

    expect(result).not.toBeNull()
    expect(result).toContain("from 'virtual:tempo-hmr-runtime'")
    expect(result).toContain('__componentBoundary')
    expect(result).toContain('__hmrNotify')
  })

  it('should handle multiple components from same module', () => {
    const code = `import { ItemLink, ItemMainLink } from './item-link'
html.div(ItemLink(item), ItemMainLink(item))`
    const result = transformComponentHmr(code, 'src/page-feed.ts')

    expect(result).not.toBeNull()
    expect(result).toContain("'ItemLink'")
    expect(result).toContain("'ItemMainLink'")
    const acceptCount = (result!.match(/hot\.accept\('\.\/item-link'/g) || []).length
    expect(acceptCount).toBe(1)
  })

  it('should handle aliased imports', () => {
    const code = `import { ItemLink as IL } from './item-link'
html.li(IL(item))`
    const result = transformComponentHmr(code, 'src/page-feed.ts')

    expect(result).not.toBeNull()
    expect(result).toContain("'ItemLink'")
    expect(result).toContain('(IL) => IL(item)')
  })

  it('should return null when PascalCase import is not called', () => {
    const code = `import { ItemLink } from './item-link'
const ref = ItemLink
console.log(ref)`
    expect(transformComponentHmr(code, 'src/app.ts')).toBeNull()
  })

  it('should handle components with complex arguments', () => {
    const code = `import { ProfileView } from './profile'
ProfileView({ user: e.at('user'), theme: 'dark' })`
    const result = transformComponentHmr(code, 'src/app.ts')

    expect(result).not.toBeNull()
    expect(result).toContain("(ProfileView) => ProfileView({ user: e.at('user'), theme: 'dark' })")
  })

  it('should import domRenderable from @tempots/dom', () => {
    const code = `import { ItemLink } from './item-link'
html.li(ItemLink(item))`
    const result = transformComponentHmr(code, 'src/page-feed.ts')

    expect(result).not.toBeNull()
    expect(result).toContain("import { domRenderable as __domRenderable } from '@tempots/dom'")
  })
})
