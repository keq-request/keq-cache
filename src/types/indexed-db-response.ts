export interface IndexedDBResponse {
  key: string
  responseBody: ArrayBuffer
  responseHeaders: [string, string][]
  responseStatus: number
  responseStatusText: string
}
