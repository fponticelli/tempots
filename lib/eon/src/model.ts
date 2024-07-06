import { Name } from './name'
import { EONType as T } from './type'

export const Option = T.model(
  Name.of('Option'),
  T.oneOf(
    T.option('Some', T.typeArgument('T')),
    T.option('None')
  ),
  ['T']
)

export const StringOption = T.model(
  Name.of('StringOption'),
  T.ref(Name.of('Option'), [
    T.param('T', T.string)
  ])
)

export const Either = T.model(
  Name.of('Either'),
  T.oneOf(
    T.option('Left', T.typeArgument('L')),
    T.option('Right', T.typeArgument('R'))
  ),
  ['L', 'R']
)

export const StringOrElse = T.model(
  Name.of('StringOrElse'),
  T.ref(Name.of('Either'), [
    T.param('L', T.string),
    T.param('R', T.typeArgument('Else'))
  ]),
  ['Else']
)
