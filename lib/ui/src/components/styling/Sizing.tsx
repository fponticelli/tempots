import { JSX } from "@tempots/dom"
import { Sx } from "./Sx"

export interface SizingProps {
  width?: JSX.VValue<string> | JSX.VValue<number>
  height?: JSX.VValue<string> | JSX.VValue<number>
  minWidth?: JSX.VValue<string> | JSX.VValue<number>
  minHeight?: JSX.VValue<string> | JSX.VValue<number>
  maxWidth?: JSX.VValue<string> | JSX.VValue<number>
  maxHeight?: JSX.VValue<string> | JSX.VValue<number>
}

export const Sizing = ({ width, height, maxHeight, maxWidth, minHeight, minWidth }: SizingProps) => {
  return <Sx sx={{ width, height, maxHeight, maxWidth, minHeight, minWidth } as any} /> // TODO any
}
