import { Eviction } from '~/constants/eviction.enum'
import { InternalStorageOptions } from '~/storage/internal-stoarge/types/storage-options'

export interface MemoryStorageOptions extends InternalStorageOptions {
  /**
   * @default Eviction.LRU
   */
  eviction?: Eviction
}
