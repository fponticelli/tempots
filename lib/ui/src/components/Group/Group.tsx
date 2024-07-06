import { Consumer, JSX, Signal } from '@tempots/dom'
import { Size } from '../../styles/size'
import { StyleMarker, UITheme } from '../StyleProvider/StyleProvider'
import { Sx } from '../styling/Sx'
import { AlignItems } from '../Stack/Stack'

export type Position = "left" | "right" | "center" | "apart"

export interface GroupProps {
  align?: Signal<AlignItems>
  grow?: Signal<boolean>
  noWrap?: Signal<boolean>
  position?: Signal<Position>
  spacing?: Signal<number> | Signal<Size>
  children?: JSX.DOMNode
}

export const Group = (props: GroupProps) => {
  const { children, align, grow, noWrap, position, spacing } = props
  return (
    <Consumer mark={StyleMarker}>
      {({ styles }: UITheme) => {
        return (<div>
          <Sx sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: align as any,
            flexWrap: (noWrap ?? Signal.of(false)).map(v => v ? 'nowrap' : 'wrap' as any),
            justifyContent: position?.map(v => {
              switch (v) {
                case 'left': return 'flex-start'
                case 'right': return 'flex-end'
                case 'center': return 'center'
                case 'apart': return 'space-between'
              }
            }) as any,
            flexGrow: grow?.map(v => v ? 1 : 0 as any),
            gap: (spacing ?? Signal.of('md' as const)).combine(styles, (sp, st) => {
              return (typeof sp === 'number' ? sp : st.styles.spacing[sp]) as any
            })
          }} />
          <>
            {children}
          </>
        </div>)
      }}
    </Consumer>
  )
}