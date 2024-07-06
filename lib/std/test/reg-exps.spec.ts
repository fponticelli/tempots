/*
Copyright 2019 Google LLC
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    https://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { map } from '../src/reg-exps'
import { describe, expect, test } from 'vitest'

describe('reg_exps.ts', () => {
  test('Map with non-global pattern', () => {
    const pattern = /xx|yyy/
    expect(map('axxbbyyyc', pattern, v => v.toUpperCase())).toBe('aXXbbYYYc')
    expect(map('xxbbyyy', pattern, v => v.toUpperCase())).toBe('XXbbYYY')
    expect(map('xx', pattern, v => v.toUpperCase())).toBe('XX')
    expect(map('x', pattern, v => v.toUpperCase())).toBe('x')
  })

  test('Map with global pattern', () => {
    const pattern = /xx|yyy/g
    expect(map('axxbbyyyc', pattern, v => v.toUpperCase())).toBe('aXXbbYYYc')
    expect(map('xxbbyyy', pattern, v => v.toUpperCase())).toBe('XXbbYYY')
    expect(map('xx', pattern, v => v.toUpperCase())).toBe('XX')
    expect(map('x', pattern, v => v.toUpperCase())).toBe('x')
  })
})
