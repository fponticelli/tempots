import { ClassName } from '@tempots/dom'
import { SX, sxToClassProp } from '../../styles/sx'

export interface SxProps {
  sx?: SX
}

export const Sx = ({ sx }: SxProps) => {
  return sx != null ? <ClassName value={sxToClassProp(sx)} /> : null
}
