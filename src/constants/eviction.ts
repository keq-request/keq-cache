export enum Eviction {
  ALL_KEYS_LRU = 'allkeys-lru',
  VOLATILE_LRU = 'volatile-lru',
  ALL_KEYS_RANDOM = 'allkeys-random',
  VOLATILE_RANDOM = 'volatile-random',
  ALL_KEYS_LFU = 'allkeys-lfu',
  VOLATILE_LFU = 'volatile-lfu',
  VOLATILE_TTL = 'volatile-ttl',
}
