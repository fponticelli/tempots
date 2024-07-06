import { Consumer, JSX, Signal } from '@tempots/dom'
import { Size } from '../../styles/size'
import { StyleMarker, UITheme } from '../StyleProvider/StyleProvider'
import { Sx } from '../styling/Sx'

export type AlignItems = 'flex-start' | 'flex-end' | 'center' | 'start' | 'end' | 'self-start' | 'self-end' | 'baseline' | 'stretch' | 'safe' | 'unsafe'

export type JustifyContent = 'center' | 'start' | 'end' | 'flex-start' | 'flex-end' | 'left' | 'right' | 'normal' | 'space-between' | 'space-around' | 'space-evenly' | 'stretch' | 'safe center' | 'unsafe center' | 'inherit' | 'initial' | 'revert' | 'revert-layer' | 'unset'

export interface StackProps {
  align?: Signal<AlignItems>
  justify?: Signal<JustifyContent>
  spacing?: Signal<number> | Signal<Size>
  children?: JSX.DOMNode
}

export const Stack = (props: StackProps) => {
  const { children, align, justify, spacing } = props
  return (
    <Consumer mark={StyleMarker}>
      {({ styles }: UITheme) => {
        return (
          <div>
            <Sx sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: align ?? Signal.of('normal') as any,
              justifyContent: justify as any,
              gap: (spacing ?? Signal.of('md' as const)).combine(styles, (sp, st) => {
                return (typeof sp === 'number' ? sp : st.styles.spacing[sp]) as any
              })
            }} />
            {children}
          </div>
        )
      }}
    </Consumer>
  )
}
