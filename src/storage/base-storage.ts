import { Promisable } from 'type-fest'
import { CacheEntry } from '~/types/cache-entry.js'
import { Eviction } from '~/constants/eviction.enum.js'
import { StorageOptions } from '~/types/storage-options'
import { debug } from '~/utils/debug'

export abstract class BaseStorage {
  protected readonly __id__: string = Math.random()
    .toString(36)
    .slice(2)

  protected readonly __size__: number
  protected readonly __eviction__: Eviction
  protected readonly __debug__: boolean

  get __options__(): StorageOptions {
    return {
      size: this.__size__,
      eviction: this.__eviction__,
      debug: this.__debug__,
    }
  }

  constructor(options?: StorageOptions) {
    if (options?.size && (typeof options?.size !== 'number' || options.size <= 0)) {
      throw TypeError(`Invalid size: ${String(options?.size)}`)
    }
    if (options?.eviction && !Object.values(Eviction).includes(options.eviction)) {
      throw TypeError(`Invalid eviction: ${String(options?.eviction)}`)
    }

    this.__size__ = options?.size ?? Infinity
    this.__eviction__ = options?.eviction ?? Eviction.LRU
    this.__debug__ = !!options?.debug

    this.debug('Storage Created: ', this)
  }

  protected debug(...args: unknown[]): void {
    if (this.__debug__) debug(`[Storage(${this.__id__})]`, ...args)
  }

  abstract length(): Promisable<number>

  abstract has(key: string): Promisable<boolean>
  abstract get(key: string): Promisable<CacheEntry | undefined>
  abstract add(entry: CacheEntry): Promisable<void>
  abstract remove(key: string): Promisable<void>
  abstract update<T extends Exclude<keyof CacheEntry, 'response' | 'key'>>(key: string, prop: T, value: CacheEntry[T]): Promisable<void>

  abstract evict(size: number): Promisable<void>
}
