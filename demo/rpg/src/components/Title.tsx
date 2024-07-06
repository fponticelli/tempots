import { Signal, JSX } from "@tempots/dom"
import { Sx } from "@tempots/ui"

export type TitleOrder = 1 | 2 | 3 | 4 | 5 | 6

export interface TitleProps {
  order?: Signal<TitleOrder>
  children?: JSX.DOMNode
}

export function Title({ children, order }: TitleProps) {
    const fontSize = (order ?? Signal.of(1)).map<any>(v => {
      switch (v) {
        case 1: return 24
        case 2: return 20
        case 3: return 18
        case 4: return 16
        case 5: return 14
        case 6: return 12
      }
    })
    return (
      <h1>
        <Sx sx={{ fontWeight: "bold", fontSize }} />
        {children}
      </h1>
    )
  }