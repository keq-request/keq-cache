## Strategies

### `Strategies.NETWORK_ONLY`

![network-only](./images/network-only.png)

Send request directly. Don't use cache.

### `Strategies.NETWORK_FIRST`

![network-first](./images/network-first.png)

Try to send the request, if it fails, return the cache.

### `Strategies.CACHE_FIRST`

![cache-first](./images/cache-first.png)

Return cache if it exists, otherwise send request.

### `Strategies.STALE_WHILE_REVALIDATE`

![stale-wile-revalidate](./images/stale-while-revalidate.png)
Return cache if it exists And then send request and update cache asynchronously.
