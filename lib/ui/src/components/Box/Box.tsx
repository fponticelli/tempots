import { JSX } from '@tempots/dom'
import { Sizing, SizingProps } from '../styling/Sizing'
import { Spacing, SpacingProps } from '../styling/Spacing'
import { Sx, SxProps } from '../styling/Sx'

export interface BoxProps extends SxProps, SpacingProps, SizingProps {
  children?: JSX.DOMNode
}

export const Box = (props: BoxProps) => {
  const { children, sx, ...rest } = props
  return (
    <div>
      <Sx sx={sx} />
      <Spacing {...rest} />
      <Sizing {...rest} />
      {children}
    </div>
  )
}
