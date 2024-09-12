export interface CacheEntry {
  key: string
  response: Response

  /**
   * Must be int
   */
  size: number
  expiredAt: string
  createAt: string
  visitAt: string
  visitCount: number
}
