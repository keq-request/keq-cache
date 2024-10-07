import { expect, test } from '@jest/globals'
import { Storage } from './storage'
import { MemoryStorage } from '~/storage'
import { IndexedDBStorage } from '~/storage/indexed-db-storage/indexed-db-storage'


test('STORAGE.MEMORY', () => {
  expect(Storage.MEMORY).toEqual(MemoryStorage)
})

test('STORAGE.INDEXED_DB', () => {
  expect(Storage.INDEXED_DB).toEqual(IndexedDBStorage)
})
