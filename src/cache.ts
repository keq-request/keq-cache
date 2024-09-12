import type { Keq, KeqMiddleware } from 'keq'
import { KeqCacheOption } from './types/keq-cache-option'
import { KeqCacheParameters } from './types/keq-cache-parameters'
import { MemoryStorage } from './storage/memory-storage'
import { Eviction } from './constants/eviction'
import { BaseStorage } from './storage/base-storage'
import { getResponseBytes } from './utils/get-response-bytes'
import dayjs from 'dayjs'

declare module 'keq' {
  export interface KeqOptions<T> {
    /**
     * 是否静默弹窗提示错误
     */
    cache(option: KeqCacheOption): Keq<T>
  }
}


export function cache(opts?: KeqCacheParameters): KeqMiddleware {
  const StorageClass = opts?.storage || MemoryStorage
  const storage: BaseStorage = new StorageClass(opts?.maxStorageSize || Infinity, opts?.eviction || Eviction.VOLATILE_TTL)

  return async (ctx, next) => {
    const identifier = ctx.identifier

    const cache = await storage.get(identifier)

    if (cache) {
      // hit cache
      ctx.res = cache.response
      return
    }

    await next()

    if (ctx.response) {
      storage.add(identifier, {
        key: identifier,
        response: ctx.response,
        size: await getResponseBytes(ctx.response),
        createAt: dayjs().toISOString(),
        expiredAt: undefined,
        visitAt: dayjs().toISOString(),
        visitCount: 1,
      })
    }
  }
}
