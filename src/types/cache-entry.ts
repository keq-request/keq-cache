export interface CacheEntry {
  key: string
  response: Response

  /**
   * Must be int
   */
  size: number
  expiredAt?: Date
  createAt: Date
  visitAt: Date
  visitCount: number
}
