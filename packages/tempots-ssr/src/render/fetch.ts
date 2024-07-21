export interface IRequestInit {}

export type IRequestInfo = Request | string | URL

export type FetchFunction = (
  request: IRequestInfo,
  init?: IRequestInit
) => Promise<Response>
