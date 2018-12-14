export abstract class TypeBase {
  abstract readonly kind
    : 'string'
    | 'integer'
    | 'number'
    | 'length'
    | 'boolean'
    | 'eboolean'
    | 'class'
    | 'color'
    | 'style'
    | 'enum'
    | 'comma-separated'
    | 'space-separated'
  toString() {
    return this.kind
  }

  abstract toTSString(): string
}

export class StringType extends TypeBase {
  readonly kind: 'string' = 'string'
  toTSString() {
    return 'string'
  }
}

export class ColorType extends TypeBase {
  readonly kind: 'color' = 'color'
  toTSString() {
    return 'string'
  }
}

export class IntegerType extends TypeBase {
  readonly kind: 'integer' = 'integer'
  toTSString() {
    return 'number'
  }
}
export class NumberType extends TypeBase {
  readonly kind: 'number' = 'number'
  toTSString() {
    return 'number'
  }
}
export class LengthType extends TypeBase {
  readonly kind: 'length' = 'length'
  toTSString() {
    return 'number'
  }
}
export class BooleanType extends TypeBase {
  readonly kind: 'boolean' = 'boolean'
  toTSString() {
    return 'boolean'
  }
}
export class EnumeratedBooleanType extends TypeBase {
  readonly kind: 'eboolean' = 'eboolean'
  toTSString() {
    return 'boolean'
  }
}
export class ClassType extends TypeBase {
  readonly kind: 'class' = 'class'
  toTSString() {
    return 'string'
  }
}
export class StyleType extends TypeBase {
  readonly kind: 'style' = 'style'
  toTSString() {
    return 'DOMStyles'
  }
}
export class CommaSeparatedType extends TypeBase {
  readonly kind: 'comma-separated' = 'comma-separated'
  toTSString() {
    return 'string[]'
  }
}
export class SpaceSeparatedType extends TypeBase {
  readonly kind: 'space-separated' = 'space-separated'
  toTSString() {
    return 'string[]'
  }
}
export class EnumType extends TypeBase {
  readonly kind: 'enum' = 'enum'
  constructor(
    readonly values: string[]
  ) {
    super()
  }
  toTSString() {
    return this.values.map(v => `'${v}'`).join(' | ')
  }
}

export type AttributeType = StringType
  | IntegerType
  | NumberType
  | LengthType
  | BooleanType
  | EnumeratedBooleanType
  | ClassType
  | ColorType
  | StyleType
  | EnumType
  | CommaSeparatedType
  | SpaceSeparatedType

export const stringType: AttributeType = new StringType()
export const colorType: AttributeType = new ColorType()
export const integerType: AttributeType = new IntegerType()
export const numberType: AttributeType = new NumberType()
export const lengthType: AttributeType = new LengthType()
export const booleanType: AttributeType = new BooleanType()
export const enumeratedBooleanType: AttributeType = new EnumeratedBooleanType()
export const classType: AttributeType = new ClassType()
export const styleType: AttributeType = new StyleType()
export const commaSeparatedType: AttributeType = new CommaSeparatedType()
export const spaceSeparatedType: AttributeType = new SpaceSeparatedType()
export const enumType = (values: string[]): AttributeType => new EnumType(values)

export enum Tag {
  deprecated = 'deprecated',
  experimental = 'experimental',
  experimentalSupported = 'experimental-supported',
  msExtension = 'ms-extension',
  obsolete = 'obsolete',
  nonStandard = 'non-standard',
  legacy = 'legacy'
}

export class Attribute {
  constructor(
    readonly name: string,
    readonly codeName: string,
    readonly domName: string,
    readonly type: AttributeType[],
    readonly tags: Tag[]
  ) {}

  append(other: Attribute) {
    return new Attribute(
      this.name,
      this.codeName,
      this.domName,
      this.type.concat(other.type),
      Array.from(new Set([...this.tags, ...other.tags]))
    )
  }
}
