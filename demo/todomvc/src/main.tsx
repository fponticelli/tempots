import 'todomvc-common/base.css'
import 'todomvc-app-css/index.css'
import { render } from '@tempots/dom'
import { App } from './app'

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
render(<App />, document.body)
