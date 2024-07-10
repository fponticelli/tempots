import './index.css'

import { render } from '@tempots/dom'
import { App } from './components/app'

const parent = document.getElementById('app')!
render(App(), parent)
