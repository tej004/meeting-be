export enum EWebSocketEventResponseStatus {
  SUCCESS = 'success',
  ERROR = 'error',
}

export class WebSocketEventResponse<T = any> {
  constructor(
    public event: string,
    public message: string,
    public data: T,
    public timestamp: number = Date.now(),
    public status: 'success' | 'error' = 'success',
    public error?: string
  ) {}
}
