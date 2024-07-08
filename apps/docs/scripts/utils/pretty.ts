import * as fs from 'fs'
import { format } from 'prettier'
import YAML from 'yaml'

const config = YAML.parse(
  fs.readFileSync('./.prettierrc.yaml', { encoding: 'utf8' })
)

export async function makePretty(code: string) {
  try {
    return format(code, config)
  } catch (_) {
    console.log(code)
    return code
  }
}
