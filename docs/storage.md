# Storage

`Storage` is the container for storing cached data.

## MemoryStorage

`MemoryStorage` store the data in memory and cleared on page refresh.

| **Options** | **Default**                              | **Description**                                                                                             |
| :---------- | :--------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| size        | Infinity                                 | Maximum storage size. cache will be removed. The cache data will be deleted when when size is insufficient. |
| eviction    | [VolatileTTL](./eviction.md#volatilettl) | Eviction policies when memory is insufficient. [See More](./eviction.md)                                    |

```typescript
import { request } from "keq";
import { cache, Strategy, MemoryStorage } from "keq-cache";

const storage = new MemoryStorage({
  size: 10 * 1000 * 1000,
  eviction: Eviction.TTL,
});

request.use(cache({ storage }));
```

## IndexedDBStorage

Storing the cache data in IndexedBD.

| **Options** | **Default**                              | **Description**                                                                                                        |
| :---------- | :--------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| size        | Infinity                                 | Maximum storage size. cache will be removed. The cache data will be deleted when when size is insufficient.            |
| eviction    | [VolatileTTL](./eviction.md#volatilettl) | Eviction policies when memory is insufficient. [See More](./eviction.md)                                               |
| tableName   | `'keq_cache_indexed_db_storage'`         | The table name for the IndexedDB storage, **multiple instances using the same table name will share the cached data**. |

```typescript
import { request } from "keq";
import { cache, Strategy, IndexedDBStorage } from "keq-cache";

const storage = new IndexedDBStorage({
  size: 10 * 1000 * 1000,
  eviction: Eviction.TTL,
  tableName: "custom-cache-table-name",
});

request.use(cache({ storage }));
```

## Custom Storage

You can define your own `Storage`, if you want to use other ways to store cache (such as `SessionStorage`), Let's see an simple example:

```typescript
import { KeqCacheStorage, CacheEntry } from "keq-cache";

class MyStorage extends KeqCacheStorage {
  private storage = new Map<string, CacheEntry>();

  get(key: string): CacheEntry {
    return this.storage.get(key);
  }

  set(entry: string): void {
    this.storage.set(entry);
  }

  remove(key: string): void {
    this.storage.delete(entry.key);
  }
}
```

For more details , please refer to the codes of [`MemoryStorage`](../src/storage/memory-storage/memory-storage.ts) and [`IndexedDBStorage`](../src/storage/indexed-db-storage/indexed-db-storage.ts).
