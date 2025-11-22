import { unovisRenderable } from '../types'

export const UVisEmpty = <Datum = unknown, Data = Datum[]>() =>
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  unovisRenderable<Datum, Data>(_ctx => _removeTree => {})
