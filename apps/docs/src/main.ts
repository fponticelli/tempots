import './index.css'

import { render } from '@tempots/dom'
import { App } from './components/app'
import { fetchToc } from './services/toc-service'

async function main() {
  const parent = document.getElementById('app')!
  const toc = await fetchToc()
  render(App(toc), parent)
}

main()
