import type { Keq, KeqMiddleware } from 'keq'
import { KeqCacheOption } from './types/keq-cache-option.js'
import { KeqCacheParameters } from './types/keq-cache-parameters.js'
import { MemoryStorage } from './storage/index.js'
import { Eviction } from './constants/eviction.js'
import { BaseStorage } from './storage/base-storage.js'
import { Strategy } from './constants/strategy.js'
import { KeqCacheRule } from './types/keq-cache-rule.js'
import { cacheFirst } from './strategies/cache-first.js'
import { networkFirst } from './strategies/network-first.js'
import { staleWhileRevalidate } from './strategies/stale-while-revalidate.js'
import { networkOnly } from './strategies/network-only.js'
import { StrategyOptions } from './types/strategies-options.js'


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
  const maxStorageSize = opts?.maxStorageSize || Infinity
  let threshold = Infinity
  if (opts?.threshold) threshold = opts.threshold
  if (opts?.maxStorageSize) threshold = opts.maxStorageSize * 0.2

  const storage: BaseStorage = new StorageClass(maxStorageSize, threshold, opts?.eviction || Eviction.TTL)
  const rules: KeqCacheRule[] = opts?.rules || []

  return async function cache(ctx, next) {
    const rule = rules.find((rule) => {
      if (typeof rule.pattern === 'function') return rule.pattern(ctx)
      return rule.pattern.test(ctx.request.__url__.href)
    })

    if (!rule) {
      await next()
      return
    }

    let key = ctx.identifier
    if (rule.key) {
      if (typeof rule.key === 'function') key = rule.key(ctx)
      else key = rule.key
    } else if (opts?.keyFactory) {
      key = opts.keyFactory(ctx)
    }

    const strategy = rule.strategy || Strategy.NETWORK_ONLY

    const opt: StrategyOptions = {
      key,
      storage,
    }

    if (strategy === Strategy.NETWORK_FIRST) {
      await networkFirst(ctx, next, opt)
    } else if (strategy === Strategy.CATCH_FIRST) {
      await cacheFirst(ctx, next, opt)
    } else if (strategy === Strategy.STALE_WHILE_REVALIDATE) {
      await staleWhileRevalidate(ctx, next, opt)
    } else if (strategy === Strategy.NETWORK_ONLY) {
      await networkOnly(ctx, next, opt)
    } else {
      throw new TypeError(`Unsupported strategy: ${String(strategy)}`)
    }
  }
}
