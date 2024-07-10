import { input, attr, html, type Mountable, Child } from '@tempots/dom'

const LAYOUT = 'inline-flex items-center justify-center px-3 py-1'
const TEXT = 'text-base font-medium leading-6 whitespace-no-wrap'
const BUTTON_STYLE =
  'border border-gray-300 dark:border-gray-900 rounded-md shadow-sm bg-blue-800 hover:bg-blue-700 text-gray-100'
const INPUT_STYLE =
  'border border-gray-300 rounded-md shadow-sm bg-white text-gray-800'
const FOCUS = 'focus:outline-none focus:shadow-outline'
const DISABLED = 'disabled:opacity-50 disabled:cursor-not-allowed'

export function Button(...children: Child[]): Mountable {
  return html.button(
    attr.class([LAYOUT, TEXT, FOCUS, DISABLED, BUTTON_STYLE].join(' ')),
    ...children
  )
}

export function InputText(...children: Mountable[]): Mountable {
  return input.text(
    attr.class([LAYOUT, TEXT, FOCUS, DISABLED, INPUT_STYLE].join(' ')),
    ...children
  )
}

export function InputNumber(...children: Mountable[]): Mountable {
  return input.number(
    attr.class([LAYOUT, TEXT, FOCUS, DISABLED, INPUT_STYLE].join(' ')),
    ...children
  )
}

export function InputDate(...children: Mountable[]): Mountable {
  return input.date(
    attr.class([LAYOUT, TEXT, FOCUS, DISABLED, INPUT_STYLE].join(' ')),
    ...children
  )
}

export function Range(...children: Mountable[]): Mountable {
  return input.range(...children)
}

export function Select(...children: Mountable[]): Mountable {
  return html.select(
    attr.class([LAYOUT, TEXT, FOCUS, DISABLED, INPUT_STYLE].join(' ')),
    ...children
  )
}

export function Progress(...children: Mountable[]): Mountable {
  return html.progress(...children)
}
