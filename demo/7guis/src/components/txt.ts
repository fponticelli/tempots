import { Signal, Value, attr, El, Text } from '@tempots/dom'

export type TextSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'

export interface TextOptions {
  size?: TextSize
  cls?: string
  inline?: boolean
  as?: string
  bold?: boolean
  italic?: boolean
  strike?: boolean
}

export function getTextSize(size: TextSize) {
  if (size === 'xs') return 'text-xs'
  if (size === 'sm') return 'text-sm'
  if (size === 'md') return 'text-base'
  if (size === 'lg') return 'text-lg'
  if (size === 'xl') return 'text-xl'
  if (size === '2xl') return 'text-2xl'
  if (size === '3xl') return 'text-3xl'
  if (size === '4xl') return 'text-4xl'
  return 'text-base'
}

export function Txt(value: Value<string>, options: TextOptions = {}) {
  const {
    size = 'md',
    cls: classNames,
    inline = false,
    as = 'span',
    bold = false,
    italic = false,
    strike = false,
  } = options
  const classes: string[] = ['text-gray-900 dark:text-gray-200']
  if (classNames != null) classes.push(classNames)
  if (inline) classes.push('leading-none')
  if (bold) classes.push('font-bold')
  if (italic) classes.push('italic')
  if (strike) classes.push('line-through')

  classes.push(getTextSize(size))

  return El(as, attr.class(classes.join(' ')), Text(value))
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function AnyTxt(value: Value<any>, options: TextOptions = {}) {
  return Txt(Signal.wrap(value).map(String), options)
}
