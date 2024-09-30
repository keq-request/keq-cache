import { random } from '~/utils/random'
import { BaseIndexedDBStorage } from './base-indexed-db-storage'


export class AllKeysRandomIndexedDBStorage extends BaseIndexedDBStorage {
  async evict(size: number): Promise<void> {
    const db = await this.getDB()

    if (size < await this.getSizeUnoccupied()) return

    await this.removeOutdated()
    let sizeUnoccupied = await this.getSizeUnoccupied()
    if (size < sizeUnoccupied) return

    const tx = db.transaction(['entries', 'responses'], 'readwrite')
    const entriesStore = tx.objectStore('entries')

    const keys = await entriesStore.getAllKeys()

    while (sizeUnoccupied < size && keys.length) {
      const index = random(0, keys.length - 1)
      const key = keys[index]
      const item = await entriesStore.get(key)

      if (item) {
        await this.__remove__(tx, key)
        keys.splice(index, 1)
        sizeUnoccupied += item.size
      }
    }

    await tx.done
  }
}
