import { BaseDoc } from './jsdoc'

export interface DocEntity extends BaseDoc {
  kind: 'class' | 'export' | 'function' | 'interface' | 'type_alias' | 'variable' | 'enum'
  name: string
  line: number
  signatures: string[]
}
