/*
Copyright 2019 Google LLC
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    https://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { DOMChild } from 'tempo-dom/lib/template'
import { DOMContext } from 'tempo-dom/lib/context'
import { el } from './ui_element'
import {
  Attribute,
  mapAttributes,
  EventHandler,
  ValueOfAttribute,
  resolveAttribute,
  AttributeValue
} from 'tempo-dom/lib/value'
import { features, RuleDescription, ClassDescription } from './features'
import {
  Orientation,
  Background,
  Padding,
  Transition,
  OneTransition,
  BorderRadius,
  Size,
  Length,
  Border,
  BorderStyle,
  Cursor,
  Distribution,
  TextShadow,
  Shadow,
  FontWeight,
  TextAlign,
  TransitionTarget
} from './ui_attributes'
import { matchKind } from 'tempo-std/lib/match'
import { toCSS3, Color } from 'tempo-colors/lib/color'

export interface ElProperties {
  elementName?: string
}

export interface ElContainerProperties<State> {
  orientation?: Attribute<State, Orientation>
  distribution?: Attribute<State, Distribution>
  alignament?: Attribute<State, Distribution>
}

export interface ElBlockProperties<State> {
  background?: Attribute<State, Background>
  border?: Attribute<State, Border>
  borderRadius?: Attribute<State, BorderRadius>
  padding?: Attribute<State, Padding>
  transition?: Attribute<State, Transition>
  width?: Attribute<State, Size>
  height?: Attribute<State, Size>
  alignament?: Attribute<State, Distribution>
  shadow?: Attribute<State, Shadow>
  spacing?: Attribute<State, number>
}

export interface ElTextProperties<State> {
  fontSize?: Attribute<State, number>
  textColor?: Attribute<State, Color>
  textShadow?: Attribute<State, TextShadow>
  fontWeight?: Attribute<State, FontWeight>
  letterSpacing?: Attribute<State, number>
  wordSpacing?: Attribute<State, number>
}

export interface ElTextBlockProperties<State> {
  lineHeight?: Attribute<State, number>
  textAlign?: Attribute<State, TextAlign>
}

export interface ElMouseProperties<State> {
  whenHover?: ElBlockProperties<State> &
    ElTextProperties<State> &
    ElTextBlockProperties<State>
  whenActive?: ElBlockProperties<State> &
    ElTextProperties<State> &
    ElTextBlockProperties<State>
  whenFocusWithin?: ElBlockProperties<State> &
    ElTextProperties<State> &
    ElTextBlockProperties<State>
  cursor?: Attribute<State, Cursor>
}

export interface ElControlProperties<State> {
  whenDisabled?: ElBlockProperties<State> &
    ElTextProperties<State> &
    ElTextBlockProperties<State> &
    ElMouseProperties<State>
  whenFocused?: ElBlockProperties<State> &
    ElTextProperties<State> &
    ElTextBlockProperties<State> &
    ElMouseProperties<State>
  disabled?: Attribute<State, boolean>
}

export interface ElLifecycleProperties<State, Action, Query, TScope> {
  events?: Record<string, EventHandler<State, Action, any, Element>>
  afterrender?: (
    state: State,
    el: Element,
    ctx: DOMContext<Action>
  ) => TScope | undefined
  beforechange?: (
    state: State,
    el: Element,
    ctx: DOMContext<Action>,
    value: TScope | undefined
  ) => TScope | undefined
  afterchange?: (
    state: State,
    el: Element,
    ctx: DOMContext<Action>,
    value: TScope | undefined
  ) => TScope | undefined
  beforedestroy?: (
    el: Element,
    ctx: DOMContext<Action>,
    value: TScope | undefined
  ) => void
  respond?: (
    query: Query,
    el: Element,
    ctx: DOMContext<Action>,
    value: TScope | undefined
  ) => TScope | undefined
}

let styleEl: HTMLElement | undefined
let appliedToStyle = new Set()

function includeStyle(doc: Document, cls: string, descs: RuleDescription[]) {
  if (typeof styleEl === 'undefined') {
    styleEl = doc.createElement('style')
    styleEl.textContent += '\n'
    doc.head.appendChild(styleEl)
  }
  if (!appliedToStyle.has(cls)) {
    appliedToStyle.add(cls)
    const rules = descs
      .map(
        desc => `${desc.selector} {
  ${desc.rules.join(';\n  ')};
}`
      )
      .join('\n')
    styleEl.textContent += rules + '\n'
  }
}

function lengthToString(length: Length) {
  return matchKind(length, {
    Percent: l => `${l.value}%`,
    Px: l => `${l.value}px`
  })
}

function borderOneToString(width: number, style: BorderStyle, color: Color) {
  return `${width}px ${style} ${toCSS3(color)}`
}

function borderToString(b: Border): string {
  return matchKind(b, {
    BorderAll: b => borderOneToString(b.all.width, b.all.style, b.all.color),
    BorderEach: b =>
      [
        borderOneToString(b.top.width, b.top.style, b.top.color),
        borderOneToString(b.right.width, b.right.style, b.right.color),
        borderOneToString(b.bottom.width, b.bottom.style, b.bottom.color),
        borderOneToString(b.left.width, b.left.style, b.left.color)
      ].join(', ')
  })
}

function cursorToString(cursor: Cursor): string {
  if (typeof cursor === 'string') return cursor

  const { url, x, y } = cursor

  if (typeof x !== 'undefined' || typeof y !== 'undefined') {
    return `url(${url}) ${x ?? 0} ${y ?? 0}`
  } else {
    return `url(${url})`
  }
}

function borderRadiusToString(b: BorderRadius): string {
  return matchKind(b, {
    BorderRadiusAll: b => {
      const v = [lengthToString(b.all.first)]
      if (typeof b.all.second !== 'undefined')
        v.push(lengthToString(b.all.second))
      return v.join(' / ')
    },
    BorderRadiusEach: b => {
      const { tl, tr, br, bl } = b
      const v = [
        lengthToString(tl.first) +
          ' ' +
          lengthToString(tr.first) +
          ' ' +
          lengthToString(br.first) +
          ' ' +
          lengthToString(bl.first)
      ]
      if (
        typeof (tl.second ?? tr.second ?? br.second ?? bl.second) !==
        'undefined'
      ) {
        const tls = tl.second ?? tl.first
        const trs = tr.second ?? tr.first
        const bls = bl.second ?? bl.first
        const brs = br.second ?? br.first
        v.push(
          lengthToString(tls) +
            ' ' +
            lengthToString(trs) +
            ' ' +
            lengthToString(brs) +
            ' ' +
            lengthToString(bls)
        )
      }
      return v.join(' / ')
    }
  })
}

function transitionTargetToString(target: TransitionTarget) {
  if (target === 'text-color') return 'color'
  else return target
}

function oneTransitionToString(t: OneTransition) {
  const buff = [transitionTargetToString(t.target)]
  if (typeof t.duration !== 'undefined') buff.push(t.duration)
  if (typeof t.timingFunction !== 'undefined') buff.push(t.timingFunction)
  if (typeof t.delay !== 'undefined') buff.push(t.delay)
  return buff.join(' ')
}

function shadowToString(s: Shadow): string {
  return matchKind(s, {
    DropShadow: ({ offsetX, offsetY, blurRadius, spreadRadius, color }) =>
      [
        `${offsetX}px`,
        `${offsetY}px`,
        (blurRadius && `${blurRadius}px`) ?? (spreadRadius && '0'),
        spreadRadius && `${spreadRadius}px`,
        color && toCSS3(color)
      ]
        .filter(f => typeof f !== 'undefined')
        .join(' '),
    InsetShadow: ({ offsetX, offsetY, blurRadius, spreadRadius, color }) =>
      [
        'inset',
        `${offsetX}px`,
        `${offsetY}px`,
        (blurRadius && `${blurRadius}px`) ?? (spreadRadius && '0'),
        spreadRadius && `${spreadRadius}px`,
        color && toCSS3(color)
      ]
        .filter(f => typeof f !== 'undefined')
        .join(' '),
    MultiShadow: ({ shadows }) => shadows.map(shadowToString).join(', ')
  })
}

function textShadowToString(s: TextShadow): string {
  return matchKind(s, {
    OneTextShadow: ({ offsetX, offsetY, blurRadius, color }) =>
      [
        `${offsetX}px`,
        `${offsetY}px`,
        blurRadius ?? `${blurRadius}px`,
        color && toCSS3(color)
      ]
        .filter(f => typeof f !== 'undefined')
        .join(' '),
    MultiTextShadow: ({ shadows }) => shadows.map(textShadowToString).join(', ')
  })
}

function applyBlockProps<State>(
  prefix: string,
  pseudo: string,
  v: {
    [K in keyof ElBlockProperties<State>]: ValueOfAttribute<
      ElBlockProperties<State>[K]
    >
  },
  properties: ClassDescription[],
  styles: Record<string, string>
) {
  if (typeof v.spacing !== 'undefined') {
    properties.push(features.spacing)
    styles[`${prefix}sp`] = `${v.spacing}px`
  }

  if (typeof v.background !== 'undefined') {
    properties.push(features.background(prefix, pseudo))
    styles[`${prefix}bg`] = matchKind(v.background, {
      BackgroundColor: bg => toCSS3(bg.color)
    })
  }

  if (typeof v.padding !== 'undefined') {
    properties.push(features.padding(prefix, pseudo))
    matchKind(v.padding, {
      PaddingAll: pad => (styles.p = `${pad.value}px`),
      PaddingEach: pad => {
        styles[`${prefix}p-t`] = `${pad.top}px`
        styles[`${prefix}p-r`] = `${pad.right}px`
        styles[`${prefix}p-b`] = `${pad.bottom}px`
        styles[`${prefix}p-l`] = `${pad.left}px`
      }
    })
  }

  if (typeof v.transition !== 'undefined') {
    properties.push(features.transition(prefix, pseudo))
    matchKind(v.transition, {
      Transition: t => (styles[`${prefix}t`] = oneTransitionToString(t)),
      MultiTransition: t =>
        (styles[`${prefix}t`] = t.transitions
          .map(oneTransitionToString)
          .join(', '))
    })
  }

  if (typeof v.width !== 'undefined') {
    properties.push(features.width(prefix, pseudo))
    matchKind(v.width, {
      SizeFill: s => (styles[`${prefix}w-f`] = String(s.ratio)),
      SizeFixed: s => (styles[`${prefix}w`] = `${s.value}px`),
      SizeMin: s => (styles[`${prefix}w-mi`] = `${s.value}px`),
      SizeMax: s => (styles[`${prefix}w-ma`] = `${s.value}px`)
    })
  }

  if (typeof v.height !== 'undefined') {
    properties.push(features.height(prefix, pseudo))
    matchKind(v.height, {
      SizeFill: s => (styles[`${prefix}h-f`] = String(s.ratio)),
      SizeFixed: s => (styles[`${prefix}h`] = `${s.value}px`),
      SizeMin: s => (styles[`${prefix}h-mi`] = `${s.value}px`),
      SizeMax: s => (styles[`${prefix}h-ma`] = `${s.value}px`)
    })
  }

  if (typeof v.border !== 'undefined') {
    properties.push(features.border(prefix, pseudo))
    styles[`${prefix}b`] = borderToString(v.border)
  }

  if (typeof v.borderRadius !== 'undefined') {
    properties.push(features.borderRadius(prefix, pseudo))
    styles[`${prefix}br`] = borderRadiusToString(v.borderRadius)
  }

  if (typeof v.alignament !== 'undefined') {
    properties.push(features.alignSelf)
    styles[`${prefix}sa`] = v.alignament
  }

  if (typeof v.shadow !== 'undefined') {
    properties.push(features.boxShadow(prefix, pseudo))
    styles[`${prefix}bs`] = shadowToString(v.shadow)
  }
}

function applyControlProps<State>(
  prefix: string,
  pseudo: string,
  state: State,
  v: {
    [K in keyof ElControlProperties<State>]: ValueOfAttribute<
      ElControlProperties<State>[K]
    >
  },
  properties: ClassDescription[],
  styles: Record<string, string>
) {
  if (typeof v.whenFocused !== 'undefined') {
    resolveAttribute(
      mapAttributes(v.whenFocused, x => {
        applyBlockProps(`${prefix}F`, ':focus', x, properties, styles)
        applyTextBlockProps(`${prefix}F`, ':focus', x, properties, styles)
        applyTextProps(`${prefix}F`, ':focus', x, properties, styles)
        applyMouseProps(`${prefix}F`, ':focus', state, x, properties, styles)
      })
    )(state)
  }

  if (typeof v.whenDisabled !== 'undefined') {
    resolveAttribute(
      mapAttributes(v.whenDisabled, x => {
        applyBlockProps(`${prefix}D`, '[disabled]', x, properties, styles)
        applyTextBlockProps(`${prefix}D`, '[disabled]', x, properties, styles)
        applyTextProps(`${prefix}D`, '[disabled]', x, properties, styles)
        applyMouseProps(
          `${prefix}D`,
          '[disabled]',
          state,
          x,
          properties,
          styles
        )
      })
    )(state)
  }
}

function applyTextBlockProps<State>(
  prefix: string,
  pseudo: string,
  v: {
    [K in keyof ElTextBlockProperties<State>]: ValueOfAttribute<
      ElTextBlockProperties<State>[K]
    >
  },
  properties: ClassDescription[],
  styles: Record<string, string>
) {
  if (typeof v.lineHeight !== 'undefined') {
    properties.push(features.lineHeight(prefix, pseudo))
    styles[`${prefix}lh`] = `${v.lineHeight}px`
  }
  if (typeof v.textAlign !== 'undefined') {
    properties.push(features.textAlign(prefix, pseudo))
    styles[`${prefix}ta`] = v.textAlign
  }
}

function applyTextProps<State>(
  prefix: string,
  pseudo: string,
  v: {
    [K in keyof ElTextProperties<State>]: ValueOfAttribute<
      ElTextProperties<State>[K]
    >
  },
  properties: ClassDescription[],
  styles: Record<string, string>
) {
  if (typeof v.fontSize !== 'undefined') {
    properties.push(features.fontSize(prefix, pseudo))
    styles[`${prefix}fs`] = `${v.fontSize}px`
  }

  if (typeof v.textColor !== 'undefined') {
    properties.push(features.textColor(prefix, pseudo))
    styles[`${prefix}tc`] = toCSS3(v.textColor)
  }

  if (typeof v.textShadow !== 'undefined') {
    properties.push(features.textShadow(prefix, pseudo))
    styles[`${prefix}ts`] = textShadowToString(v.textShadow)
  }

  if (typeof v.fontWeight !== 'undefined') {
    properties.push(features.fontWeight(prefix, pseudo))
    styles[`${prefix}fw`] = String(v.fontWeight)
  }

  if (typeof v.letterSpacing !== 'undefined') {
    properties.push(features.letterSpacing(prefix, pseudo))
    styles[`${prefix}ls`] = String(v.letterSpacing)
  }

  if (typeof v.wordSpacing !== 'undefined') {
    properties.push(features.wordSpacing(prefix, pseudo))
    styles[`${prefix}wsp`] = String(v.wordSpacing)
  }
}

function applyMouseProps<State>(
  prefix: string,
  pseudo: string,
  state: State,
  v: {
    [K in keyof ElMouseProperties<State>]: ValueOfAttribute<
      ElMouseProperties<State>[K]
    >
  },
  properties: ClassDescription[],
  styles: Record<string, string>
) {
  if (typeof v.whenHover !== 'undefined') {
    resolveAttribute(
      mapAttributes(v.whenHover, x => {
        applyBlockProps('H', ':hover', x, properties, styles)
        applyTextProps('H', ':hover', x, properties, styles)
        applyTextBlockProps('H', ':hover', x, properties, styles)
      })
    )(state)
  }

  if (typeof v.whenActive !== 'undefined') {
    resolveAttribute(
      mapAttributes(v.whenActive, x => {
        applyBlockProps('A', ':active', x, properties, styles)
        applyTextProps('A', ':active', x, properties, styles)
        applyTextBlockProps('A', ':active', x, properties, styles)
      })
    )(state)
  }

  if (typeof v.whenFocusWithin !== 'undefined') {
    resolveAttribute(
      mapAttributes(v.whenFocusWithin, x => {
        applyBlockProps('FW', ':focus-within', x, properties, styles)
        applyTextBlockProps('FW', ':focus-within', x, properties, styles)
        applyTextProps('FW', ':focus-within', x, properties, styles)
      })
    )(state)
  }

  if (typeof v.cursor !== 'undefined') {
    properties.push(features.cursor(prefix, pseudo))
    styles[`${prefix}cu`] = cursorToString(v.cursor)
  }
}

export function container<State, Action, Query = unknown, TScope = unknown>(
  props: ElProperties &
    ElBlockProperties<State> &
    ElTextProperties<State> &
    ElTextBlockProperties<State> &
    ElLifecycleProperties<State, Action, Query, TScope> &
    ElContainerProperties<State> &
    ElMouseProperties<State>,
  ...children: DOMChild<State, Action, Query>[]
) {
  const elementName = props?.elementName ?? 'div'
  const lifecycle = {
    afterrender: props.afterrender,
    beforechange: props.beforechange,
    afterchange: props.afterchange,
    beforedestroy: props.beforedestroy,
    respond: props.respond
  }
  const attrsf = (doc: Document) => (state: State) => {
    return resolveAttribute(
      mapAttributes(props, v => {
        const properties = [features.orientation[v.orientation ?? 'row']]
        const styles: Record<string, string> = {}

        if (typeof v.distribution !== 'undefined') {
          properties.push(features.justifyContent)
          styles[`d`] = v.distribution
        }

        if (typeof v.alignament !== 'undefined') {
          properties.push(features.alignItems)
          styles[`d`] = v.alignament
        }

        applyBlockProps('', '', v, properties, styles)
        applyTextBlockProps('', '', v, properties, styles)
        applyTextProps('', '', v, properties, styles)
        applyMouseProps('', '', state, v, properties, styles)

        properties.forEach(prop => includeStyle(doc, prop.cls, prop.desc))
        const classes = properties.map(p => p.cls)

        return { classes, styles }
      })
    )(state)
  }
  return el(
    elementName,
    {
      ...lifecycle,
      attrsf,
      events: props.events,
      afterrender: props.afterrender,
      beforechange: props.beforechange,
      afterchange: props.afterchange,
      beforedestroy: props.beforedestroy,
      respond: props.respond
    },
    ...children
  )
}

export function block<State, Action, Query = unknown, TScope = unknown>(
  props: ElProperties &
    ElBlockProperties<State> &
    ElTextProperties<State> &
    ElTextBlockProperties<State> &
    ElLifecycleProperties<State, Action, Query, TScope> &
    ElContainerProperties<State> &
    ElMouseProperties<State>,
  ...children: DOMChild<State, Action, Query>[]
) {
  const elementName = props?.elementName ?? 'div'
  const lifecycle = {
    afterrender: props.afterrender,
    beforechange: props.beforechange,
    afterchange: props.afterchange,
    beforedestroy: props.beforedestroy,
    respond: props.respond
  }
  const attrsf = (doc: Document) => (state: State) => {
    return resolveAttribute(
      mapAttributes(props, v => {
        const properties = [] as ClassDescription[]
        const styles: Record<string, string> = {}

        applyBlockProps('', '', v, properties, styles)
        applyTextProps('', '', v, properties, styles)
        applyTextBlockProps('', '', v, properties, styles)
        applyMouseProps('', '', state, v, properties, styles)

        properties.forEach(prop => includeStyle(doc, prop.cls, prop.desc))
        const classes = properties.map(p => p.cls)

        return { classes, styles }
      })
    )(state)
  }
  return el(
    elementName,
    {
      ...lifecycle,
      attrsf,
      events: props.events,
      afterrender: props.afterrender,
      beforechange: props.beforechange,
      afterchange: props.afterchange,
      beforedestroy: props.beforedestroy,
      respond: props.respond
    },
    ...children
  )
}

export function inline<State, Action, Query = unknown, TScope = unknown>(
  props: ElProperties &
    ElBlockProperties<State> &
    ElTextProperties<State> &
    ElTextBlockProperties<State> &
    ElLifecycleProperties<State, Action, Query, TScope> &
    ElMouseProperties<State>,
  ...children: DOMChild<State, Action, Query>[]
) {
  const elementName = props?.elementName ?? 'div'
  const lifecycle = {
    afterrender: props.afterrender,
    beforechange: props.beforechange,
    afterchange: props.afterchange,
    beforedestroy: props.beforedestroy,
    respond: props.respond
  }
  const attrsf = (doc: Document) => (state: State) => {
    return resolveAttribute(
      mapAttributes(props, v => {
        const properties = [features.inline]
        const styles: Record<string, string> = {}

        applyBlockProps('', '', v, properties, styles)
        applyTextProps('', '', v, properties, styles)
        applyTextBlockProps('', '', v, properties, styles)
        applyMouseProps('', '', state, v, properties, styles)

        properties.forEach(prop => includeStyle(doc, prop.cls, prop.desc))
        const classes = properties.map(p => p.cls)

        return { classes, styles }
      })
    )(state)
  }
  return el(
    elementName,
    {
      ...lifecycle,
      attrsf,
      events: props.events,
      afterrender: props.afterrender,
      beforechange: props.beforechange,
      afterchange: props.afterchange,
      beforedestroy: props.beforedestroy,
      respond: props.respond
    },
    ...children
  )
}

export function control<State, Action, Query = unknown, TScope = unknown>(
  props: ElProperties &
    ElBlockProperties<State> &
    ElTextProperties<State> &
    ElTextBlockProperties<State> &
    ElLifecycleProperties<State, Action, Query, TScope> &
    ElControlProperties<State> &
    ElMouseProperties<State>,
  ...children: DOMChild<State, Action, Query>[]
) {
  const elementName = props?.elementName ?? 'div'
  const lifecycle = {
    afterrender: props.afterrender,
    beforechange: props.beforechange,
    afterchange: props.afterchange,
    beforedestroy: props.beforedestroy,
    respond: props.respond
  }
  const attrs: Record<string, Attribute<State, AttributeValue>> = {
    disabled: props.disabled
  }
  const attrsf = (doc: Document) => (state: State) => {
    return resolveAttribute(
      mapAttributes(props, v => {
        const properties = [
          features.control
          /* features.inline */
        ] as ClassDescription[]
        const styles: Record<string, string> = {}

        applyBlockProps('', '', v, properties, styles)
        applyTextProps('', '', v, properties, styles)
        applyTextBlockProps('', '', v, properties, styles)
        applyMouseProps('', '', state, v, properties, styles)
        applyControlProps('', '', state, v, properties, styles)

        properties.forEach(prop => includeStyle(doc, prop.cls, prop.desc))
        const classes = properties.map(p => p.cls)

        return { classes, styles }
      })
    )(state)
  }
  return el(
    elementName,
    {
      ...lifecycle,
      attrs,
      attrsf,
      events: props.events,
      afterrender: props.afterrender,
      beforechange: props.beforechange,
      afterchange: props.afterchange,
      beforedestroy: props.beforedestroy,
      respond: props.respond
    },
    ...children
  )
}
