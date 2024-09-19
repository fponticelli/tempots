import * as path from "path";
import * as fs from "fs";
import { format } from "prettier";
import YAML from "yaml";

const config = {
  ...YAML.parse(
    fs.readFileSync(path.join(process.cwd(), "./.prettierrc.yaml"), {
      encoding: "utf8"
    })
  ),
  parser: "typescript"
};

export async function makePretty(code: string) {
  try {
    return format(code, config);
  } catch (_) {
    console.error(code);
    return code;
  }
}
