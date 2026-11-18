import './index.css'
import 'highlight.js/styles/atom-one-dark-reasonable.css'

import { render } from '@tempots/dom'
import { App } from './components/app'
import { fetchToc } from './services/toc-service'
import { readPageSnapshot } from './services/page-service'

async function main() {
  const toc = await fetchToc()
  const container = document.getElementById('app')

  if (!container) {
    console.error('[Docs] Could not find #app container')
    return
  }

  const initialPage = readPageSnapshot(container)
  render(App(toc, initialPage), container)
}

main()
