import './index.css'
import 'highlight.js/styles/atom-one-dark-reasonable.css'

import { render } from '@tempots/dom'
import { App } from './components/app'
import { fetchToc } from './services/toc-service'

async function main() {
  const toc = await fetchToc()
  render(App(toc), document.body)
}

main()
