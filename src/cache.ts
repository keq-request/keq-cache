import type { Keq, KeqMiddleware } from 'keq'
import { KeqCacheOption } from './types/keq-cache-option'
import { KeqCacheParameters } from './types/keq-cache-parameters'
import { KeqCacheMemoryStorage } from './storage/keq-cache-memory-storage'

declare module 'keq' {
  export interface KeqOptions<T> {
    /**
     * 是否静默弹窗提示错误
     */
    cache(option: KeqCacheOption): Keq<T>
  }
}


export function cache(opts?: KeqCacheParameters): KeqMiddleware {
  const StorageClass = opts?.storage || KeqCacheMemoryStorage
  const storage = new StorageClass()

  return async (ctx, next) => {
    await next()
  }
}
