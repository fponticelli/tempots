// import { Validation } from "@tempots/std/validation";
// import { EONProject } from "./project";
// import { EONType } from "./type";
// import { EONOneOfOption, EONRecord, EONValue } from "./value";

// export interface PathIndex {
//   index: number
// }

// export interface PathBigIntIndex {
//   bigindex: bigint
// }

// export interface PathField {
//   field: string
// }

// export type PathItem = PathIndex | PathBigIntIndex | PathField

// export type EONValidationError = {
//   message: string
//   path: PathItem[]
// }

// export function validate(type: EONType, value: EONValue, project: EONProject, path: PathItem[] = []): Validation<EONValidationError> {
//   switch (type) {
//     case 'string':
//       return typeof value === 'string' ? Validation.valid : Validation.invalid({ message: 'Expected string', path })
//     case 'boolean':
//       return typeof value === 'boolean' ? Validation.valid : Validation.invalid({ message: 'Expected boolean', path })
//     case 'number':
//       return typeof value === 'number' ? Validation.valid : Validation.invalid({ message: 'Expected number', path })
//     case 'int':
//       return typeof value === 'bigint' ? Validation.valid : Validation.invalid({ message: 'Expected bigint', path })
//     default:
//       switch (type.type) {
//         case 'array':
//           if (!Array.isArray(value)) {
//             return Validation.invalid({ message: 'Expected array', path })
//           }
//           for (let i = 0; i < value.length; i++) {
//             const result = validate(type.value, value[i], project, [...path, { index: i }])
//             if (Validation.isInvalid(result)) {
//               return result
//             }
//           }
//           return Validation.valid
//         case 'record':
//           if (typeof value !== 'object' || value === null) {
//             return Validation.invalid({ message: 'Expected object', path })
//           }
//           for (const field of type.fields) {
//             const result = validate(field.type, (value as EONRecord)[field.field], project, [...path, { field: field.field }])
//             if (Validation.isValid(result)) {
//               return result
//             }
//           }
//           return Validation.valid
//         case 'map':
//           if (!(value instanceof Map)) {
//             return Validation.invalid({ message: 'Expected Map', path })
//           }
//           for (const [key, v] of value.entries()) {
//             if (typeof key !== 'string') {
//               return Validation.invalid({ message: 'Expected string key', path })
//             }
//             const result = validate(type.value, v, project, [...path, { field: key }])
//             if (Validation.isValid(result)) {
//               return result
//             }
//           }
//           return Validation.valid
//         case 'intmap':
//           if (!(value instanceof Map)) {
//             return Validation.invalid({ message: 'Expected Map', path })
//           }
//           for (const [key, v] of value.entries()) {
//             if (typeof key !== 'bigint') {
//               return Validation.invalid({ message: 'Expected bigint key', path })
//             }
//             const result = validate(type.value, v, project, [...path, { bigindex: key }])
//             if (Validation.isValid(result)) {
//               return result
//             }
//           }
//           return Validation.valid
//         case 'oneof': {
//           if (typeof value !== 'object' || value === null) {
//             return Validation.invalid({ message: 'Expected object', path })
//           }
//           if (typeof value.$constructor !== 'string') {
//             return Validation.invalid({ message: 'Expected $constructor', path })
//           }
//           const valueOption = value as EONOneOfOption
//           for (const option of type.options) {
//             if (option.$constructor === value.$constructor) {
//               if (option.value === undefined && valueOption.value === undefined) {
//                 return Validation.valid
//               }
//               if (option.value === undefined && valueOption.value !== undefined) {
//                 return Validation.invalid({ message: 'Expected no constructor value', path: [...path, { field: option.$constructor }] })
//               }
//               if (option.value !== undefined && valueOption.value === undefined) {
//                 return Validation.invalid({ message: 'Expected constructor value', path: [...path, { field: option.$constructor }] })
//               }
//               // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
//               const result = validate(option.value!, valueOption.value!, project, [...path, { field: 'value' }])
//               if (Validation.isValid(result)) {
//                 return result
//               }
//             }
//           }
//           return Validation.invalid({ message: 'Unknown constructor', path })
//         }
//         case 'model': {
//           const model = project.getModel(type.name)
//           if (model === undefined) {
//             return Validation.invalid({ message: 'Unknown model', path })
//           }
//           // TODO is this correct?
//           if (model.params.length > 0) {
//             return Validation.invalid({ message: 'Cannot validate value with type arguments', path })
//           }
//           return validate(model.definition, value, project, path)
//         }
//         case 'typeargument':
//           return Validation.invalid({ message: 'Cannot validate value with type arguments', path })
//         case 'ref':
//           throw new Error('TODO: Implement validation for refs')
//       }
//   }
// }
