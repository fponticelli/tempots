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

import { describe, expect, test } from 'vitest'
import { create, UUID } from '../src/uuid'

describe('UUID', () => {
  test('validate random created UUIDS', () => {
    for (let i = 0; i < 1000; i++) {
      expect(UUID.isValid(UUID.get(create()))).toBe(true)
    }
  })

  test('validate random created UUIDS', () => {
    expect(UUID.isValid('43f0a658-70ee-4ab8-8c6d-7f959141115e')).toBe(true)

    expect(UUID.isValid('some-value')).toBe(false)
    expect(UUID.isValid('-6b909adc-d628-411a-8894-16cfdd296073')).toBe(false)
    expect(UUID.isValid('6b909adc-d628-411a-8894-16cfdd296073-')).toBe(false)
    expect(UUID.isValid('a6b909adc-d628-411a-8894-16cfdd296073')).toBe(false)
    expect(UUID.isValid('6b909adc-d628-411a-8894-16cfdd2960732')).toBe(false)
    expect(UUID.isValid('aaaaaaaa-0000-3333-8888-1111111111111')).toBe(false)
    expect(UUID.isValid('aaaaaaaa-0000-4333-1888-1111111111111')).toBe(false)
  })
})
