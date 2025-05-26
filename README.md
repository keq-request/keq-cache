# keq-cache

[npm]: https://www.npmjs.com/package/keq-cache

[![version](https://img.shields.io/npm/v/keq-cache.svg?logo=npm&style=for-the-badge)][npm]
[![downloads](https://img.shields.io/npm/dm/keq-cache.svg?logo=npm&style=for-the-badge)][npm]
[![dependencies](https://img.shields.io/librariesio/release/npm/keq-cache?logo=npm&style=for-the-badge)][npm]
[![license](https://img.shields.io/npm/l/keq-cache.svg?logo=github&style=for-the-badge)][npm]
[![Codecov](https://img.shields.io/codecov/c/gh/keq-request/keq-cache?logo=codecov&token=PLF0DT6869&style=for-the-badge)](https://codecov.io/gh/keq-request/keq-cache)

## Why Need This

[SW MDN]: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API

This is a simple alternative to [Service Worker][SW MDN] for projects that cannot enable [Service Worker][SW MDN]. No need to manually write cache code, just configure the cache strategy.

## Usage

<!-- prettier-ignore -->
```typescript
import { request } from "keq"
import { cache, Strategy, MemoryStorage } from "keq-cache"

const storage = new MemoryStorage()
request
  .use(cache({ storage }))
```

If you are invoke `.use(cache({ ... }))` multiple times and want to share cache, the same storage instance should be used.

<!-- prettier-ignore -->
```typescript
import { request } from "keq"
import { cache, Strategy, MemoryStorage } from "keq-cache"

request
  .use(
    cache({
      storage: new MemoryStorage(),
      rules: [
        {
          pattern: (ctx) => ctx.request.method === "get",
          strategy: Strategy.STALE_WHILE_REVALIDATE,
          ttl: 5 * 60 * 1000,
          key: (ctx) => ctx.request.__url__.href,
          exclude: async response => response.status !== 200,
          onNetworkResponse: (response, cachedResponse) => {
            console.log('The network response: ', response)
            console.log('The response that cache hit: ', cachedResponse)
          }
        },
      ],
    })
  )
```

The above configuration, all GET request will use [StateWileRevalidate Strategy](#stale-while-revalidate) and cache will expire after 5 minutes.

It is natural to override the global configuration when sending a request:

<!-- prettier-ignore -->
```typescript
import { request } from "keq"
import { cache, Strategy, Eviction } from "keq-cache"

request
  .get("/example")
  .options({
    cache: {
      strategy: Strategy.NETWORK_FIRST,
      key: 'custom-cache-key',
      exclude: async response => response.status !== 200
      ttl: 1000,
    },
  })
```

## `cache(options)` Options

| Name                    | Default                                           | Description                                                                             |
| :---------------------- | :------------------------------------------------ | :-------------------------------------------------------------------------------------- |
| storage                 | -                                                 | [See More](./docs/storage.md)                                                           |
| keyFactory              | `(context) => context.identifier`                 | The requested cache unique key factory. Requests with the same key will share the cache |
| rules.pattern           | -                                                 |
| rules.key               | -                                                 | The cache key factory for the request match the rule.                                   |
| rules.strategy          | [NetworkFirst](./docs/strategies.md#networkfirst) | how generates a response after receiving a fetch. [See More](./docs/strategies.md)      |
| rules.ttl               | `Infinity`                                        | cache time to live                                                                      |
| rules.exclude           | -                                                 | If return true, the request will not be cached.                                         |
| rules.onNetworkResponse | `undefined`                                       | Callback invoke after network request finish.                                           |

## See More

- [Storage Usage](./docs/storage.md)
- [Strategies Usage](./docs/strategies.md)
