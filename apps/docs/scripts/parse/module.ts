import { SourceFile } from 'ts-morph'
import { functionOfDeclaration } from './function'
import { docOfContent, BaseDoc } from './jsdoc'
import { flatMap, flatten } from '@tempots/std/array'
import { compareCaseInsensitive } from '@tempots/std/string'
import { interfaceOfDeclaration } from './interface'
import { enumOfDeclaration } from './enum'
import { typeAliasOfDeclaration } from './type-alias'
import { classOfDeclaration } from './class'
import { exportOfDeclaration } from './export'
import { variableOfDeclaration } from './variable'
import {
  Directory
} from 'ts-morph'
import { DocEntity } from './doc-entity'

export interface Module extends BaseDoc {
  kind: 'module'
  title: string
  path: string
  docEntities: DocEntity[]
}

const moduleDocOfSource = (source: SourceFile) => {
  const comments =
    flatMap(
      source.getStatements(),
      s => s.getLeadingCommentRanges().map(c => c.getText())
    )
    .filter(c => c.indexOf('Copyright 2019 Google') < 0)
  return docOfContent(comments[0] ?? '')
}

const interfacesOfSource = (source: SourceFile) => {
  return Promise.all(source.getInterfaces()
    .filter(i => i.isExported())
    .map(interfaceOfDeclaration))
}

const enumsOfSource = (source: SourceFile) => {
  return Promise.all(source.getEnums()
    .filter(i => i.isExported())
    .map(enumOfDeclaration))
}

const functionsOfSource = (source: SourceFile) => {
  return Promise.all(source.getFunctions()
    .filter(i => i.isExported())
    .map(functionOfDeclaration))
}

const typeAliasesOfSource = (source: SourceFile) => {
  return Promise.all(source.getTypeAliases()
    .filter(i => i.isExported())
    .map(typeAliasOfDeclaration))
}

const classesOfSource = (source: SourceFile) => {
  return Promise.all(source.getClasses()
    .filter(i => i.isExported())
    .map(classOfDeclaration))
}

const exportOfSource = async (source: SourceFile) => {
  return flatten(
            await Promise.all(source.getExportDeclarations()
              .map(exportOfDeclaration))
          )
}

const variablesOfSource = (source: SourceFile) => {
  return Promise.all(source
    .getVariableDeclarations()
    .filter(f => f.isExported())
    .map(variableOfDeclaration))
}

export const moduleFromSourceFile = async (dir: Directory, source: SourceFile): Promise<Module> => {
  const path = dir.getRelativePathTo(source)
  const title = path.substring(0, path.length - 3)
  const doc = moduleDocOfSource(source)
  const enums = await enumsOfSource(source)
  const interfaces = await interfacesOfSource(source)
  const functions = await functionsOfSource(source)
  const typeAliases = await typeAliasesOfSource(source)
  const classes = await classesOfSource(source)
  const exports = await exportOfSource(source)
  const variables = await variablesOfSource(source)
  const docEntities = flatten([
    enums,
    interfaces,
    functions,
    typeAliases,
    classes,
    exports,
    variables
  ]).sort((a, b) => compareCaseInsensitive(a.name, b.name))

  return {
    kind: 'module',
    ...doc,
    path,
    title,
    docEntities
  }
}
