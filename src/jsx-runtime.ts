import { type JSX } from './jsx'
import { type Renderable } from './renderable'
import { ElImpl } from './components/El'
import { AttributeImpl } from './components/Attribute'
import { BooleanAttributeImpl } from './components/BooleanAttribute'
import { PropertyImpl } from './components/Property'
import { ClassNameImpl } from './components/ClassName'
import { Prop, Signal } from './prop'
import { TextImpl } from './components/Text'
import { OnImpl } from './components/On'
import { FragmentImpl } from './components/Fragment'

const domBooleanAttributes = new Set([
  'allowfullscreen',
  'allowpaymentrequest',
  'async',
  'autofocus',
  'autoplay',
  'capture',
  'controls',
  'default',
  'defer',
  'disabled',
  'disablepictureinpicture',
  'disableremoteplayback',
  'download',
  'draggable',
  'formnovalidate',
  'hidden',
  'ismap',
  'itemscope',
  'loop',
  'nomodule',
  'novalidate',
  'open',
  'playsinline',
  'readonly',
  'required',
  'reversed',
  'scoped',
  'seamless',
  'spellcheck',
  'truespeed'
])

const domProperties = new Set([
  'checked',
  'checked',
  'classList',
  'className',
  'contentEditable',
  'dataset',
  'innerHTML',
  'multiple',
  'muted',
  'scrollLeft',
  'scrollTop',
  'selected',
  'style',
  'tabIndex',
  'textContent',
  'value'
])

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isPrimitive (value: any): value is string | number | boolean | Date | bigint {
  return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint' || value instanceof Date
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function makeRenderables (value: any): Renderable[] {
  if (value == null) {
    return []
  }
  if (Array.isArray(value)) {
    return value.flatMap(makeRenderables)
  }
  if (typeof value === 'string') {
    return [new TextImpl(new Prop(value))]
  }
  if (Signal.isSignal(value)) {
    return [new TextImpl(value as Prop<string>)]
  }
  if (typeof value === 'object' && 'appendTo' in value) {
    return [value]
  }
  if (isPrimitive(value)) {
    return [new TextImpl(new Prop(value).map(String))]
  }
  throw new Error(`Unkwown renderable: ${String(value)}`)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function makeRenderable (value: any): Renderable {
  const renderables = makeRenderables(value)
  if (renderables.length === 0) {
    return new FragmentImpl([])
  }
  if (renderables.length === 1) {
    return renderables[0]
  }
  return new FragmentImpl(renderables)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isNamedConstructor (obj: any): boolean {
  return obj.prototype?.constructor?.name != null
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function makeFragment ({ children }: { children: any[] }): Renderable {
  if (Array.isArray(children)) {
    return new FragmentImpl(children.flatMap(makeRenderables))
  } else {
    return makeRenderable(children)
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function makeElement (Name: any, ...args: any[]): Renderable {
  if (typeof Name === 'function') {
    if (isNamedConstructor(Name)) {
      const el = new Name(...args)
      return el
    } else {
      const el = Name(...args)
      return el
    }
  }
  const { children: untypedChildren, ...rest } = args[0] ?? {}
  const children: Renderable[] = []
  if (Array.isArray(untypedChildren)) {
    children.push(...(untypedChildren.flatMap(makeRenderables)))
  } else if (untypedChildren !== undefined) {
    children.push(...makeRenderables(untypedChildren))
  }
  for (const [key, value] of Object.entries(rest)) {
    if (key.startsWith('on')) {
      const eventName = key.slice(2).toLowerCase()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      children.push(new OnImpl(eventName, value as any))
      continue
    }
    if (value == null) {
      continue
    }
    const prop: Prop<unknown> = isPrimitive(value) ? new Prop(value) as Prop<unknown> : value as Prop<unknown>
    if (key === 'class' || key === 'className') {
      children.push(new ClassNameImpl(prop as Prop<string>))
      continue
    }
    if (domProperties.has(key)) {
      children.push(new PropertyImpl(key, prop))
      continue
    }
    if (domBooleanAttributes.has(key)) {
      children.push(new BooleanAttributeImpl(key, prop as Prop<boolean>))
      continue
    }
    children.push(new AttributeImpl(key, prop as Prop<string>))
  }

  return new ElImpl(Name, children)
}

export {
  makeElement as jsx,
  makeElement as jsxs,
  makeElement as jsxDEV,
  makeFragment as Fragment,
  type JSX
}
