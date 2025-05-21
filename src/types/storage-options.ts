import { Eviction } from '~/constants/eviction.enum'


export interface StorageOptions {
  /**
   * @default false
   */
  debug?: boolean

  /**
   * @default Infinity
   */
  size?: number

  /**
   * @default Eviction.LRU
   */
  eviction?: Eviction
}

export interface IndexedDbStorageOptions extends StorageOptions {
  /**
   * Unique name
   * Used to create multiple database for cache isolation
   */
  name?: string
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface MemoryStorageOptions extends StorageOptions {
}
