import { type Clear, type Clean } from './types/clean'
import { DOMContext } from './dom-context'
import { makeProviderMark, type IDOMContext, type ProviderMark } from './types/idom-context'
import { Prop, Signal } from './prop'
import { render } from './render'
import { Renderable } from './types/renderable'
import { isEmptyElement } from './helpers/is-empty-element'
import { handleTextInput } from './helpers/handle-text-input'
import { handleAnchorClick } from './helpers/handle-anchor-click'

import { AttributeImpl, Attribute, type AttributeProps } from './components/Attribute'
import { BooleanAttributeImpl, BooleanAttribute, type BooleanAttributeProps } from './components/BooleanAttribute'
import { ClassNameImpl, ClassName, type ClassNameProps } from './components/ClassName'
import { ConsumerImpl, Consumer, type ConsumerProps } from './components/Provider'
import { ElImpl, El, type ElProps } from './components/El'
import { For, type ForProps } from './components/For'
import { FragmentImpl, Fragment } from './components/Fragment'
import { HiddenWhenEmptyImpl, HiddenWhenEmpty } from './components/HiddenWhenEmpty'
import { If, type IfProps, When, type WhenProps } from './components/If'
import { InnerHTMLImpl, InnerHTML, type InnerHTMLProps } from './components/InnerHTML'
import { Lifecycle, LifecycleImpl, type LifecycleProps } from './components/Lifecycle'
import { MatchImpl, Match, type MatchProps } from './components/Match'
import { NotEmpty, type NotEmptyProps } from './components/NotEmpty'
import { OnImpl, On, type OnProps } from './components/On'
import { OnRemoveImpl, OnRemove, type OnRemoveProps } from './components/OnRemove'
import { OneOfImpl, OneOf, type OneOfProps } from './components/OneOf'
import { PortalImpl, Portal, type PortalProps } from './components/Portal'
import { PropertyImpl, Property, type PropertyProps } from './components/Property'
import { ProviderImpl, Provider, type ProviderProps } from './components/Provider'
import { RepeatImpl, Repeat, type RepeatProps } from './components/Repeat'
import { ShowImpl, Show, type ShowProps } from './components/Show'
import { TextImpl, Text, type TextProps } from './components/Text'
import { TextContentImpl, TextContent, type TextContentProps } from './components/TextContent'
import { Tween, TweenImpl, type Animatable, type TweenAnimation, type TweenProps } from './components/Tween'

import type { JSX } from './jsx-runtime'

export {
  AttributeImpl, Attribute,
  BooleanAttributeImpl, BooleanAttribute,
  ClassNameImpl, ClassName,
  ConsumerImpl, Consumer,
  DOMContext,
  ElImpl, El,
  For,
  FragmentImpl, Fragment,
  handleTextInput,
  handleAnchorClick,
  HiddenWhenEmptyImpl, HiddenWhenEmpty,
  If,
  InnerHTMLImpl, InnerHTML,
  isEmptyElement,
  Lifecycle, LifecycleImpl,
  makeProviderMark,
  MatchImpl, Match,
  NotEmpty,
  OnImpl, On,
  OnRemoveImpl, OnRemove,
  OneOfImpl, OneOf,
  PortalImpl, Portal,
  Prop,
  PropertyImpl, Property,
  ProviderImpl, Provider,
  render,
  RepeatImpl, Repeat,
  ShowImpl, Show,
  Signal,
  TextImpl, Text,
  TextContentImpl, TextContent,
  TweenImpl, Tween,
  When,
}

export type {
  AttributeProps,
  BooleanAttributeProps,
  ClassNameProps,
  Clean,
  Clear,
  ConsumerProps,
  ElProps,
  ForProps,
  IDOMContext,
  InnerHTMLProps,
  IfProps,
  JSX,
  LifecycleProps,
  MatchProps,
  NotEmptyProps,
  OnProps,
  OnRemoveProps,
  OneOfProps,
  PortalProps,
  PropertyProps,
  ProviderMark,
  ProviderProps,
  Renderable,
  RepeatProps,
  ShowProps,
  TextProps,
  TextContentProps,
  TweenAnimation,
  TweenProps,
  Animatable,
  WhenProps,
}
