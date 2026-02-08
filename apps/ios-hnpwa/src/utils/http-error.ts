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
  badBody: (message: string): HttpError => ({ type: 'HttpBadBody', message }),
}

export const errorToMessage = (error: HttpError) => {
  switch (error.type) {
    case 'HttpNetworkError':
      return 'NetworkError | You seem to be offline'
    case 'HttpBadStatus':
      return `BadStatus | The server gave me a ${error.status} error`
    case 'HttpBadBody':
      return 'BadPayload | The server gave me back something I did not expect'
  }
}
