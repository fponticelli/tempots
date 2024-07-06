import { render } from '@tempots/dom'
import { App } from './App'

render(
  <App />,
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  document.getElementById('app')!
)
