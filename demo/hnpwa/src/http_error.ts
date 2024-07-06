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

export interface HttpNetworkError {
  type: 'HttpNetworkError'
}

export interface HttpBadStatus {
  type: 'HttpBadStatus'
  status: number
}

export interface HttpBadBody {
  type: 'HttpBadBody'
  message: string
}

export type HttpError = HttpNetworkError | HttpBadStatus | HttpBadBody

export const HttpError = {
  networkError: { type: 'HttpNetworkError' } as HttpError,
  badStatus: (status: number): HttpError => ({ type: 'HttpBadStatus', status }),
  badBody: (message: string): HttpError => ({ type: 'HttpBadBody', message })
}

export const errorToMessage = (error: HttpError) => {
  switch (error.type) {
    case 'HttpNetworkError':
      return () => 'NetworkError | You seem to be offline'
    case 'HttpBadStatus':
      return (e: HttpBadStatus) =>
        `BadStatus | The server gave me a ${e.status} error`
    case 'HttpBadBody':
      return () =>
        'BadPayload | The server gave me back something I did not expect'
  }
}
