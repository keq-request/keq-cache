import { BaseIndexedDBStorage } from './base-indexed-db-storage.js'


export class TTLIndexedDBStorage extends BaseIndexedDBStorage {
  async evict(size: number): Promise<void> {
    const db = await this.openDB()

    if (size < await this.getSizeUnoccupied()) return

    await this.removeOutdated()
    let sizeUnoccupied = await this.getSizeUnoccupied()
    if (size < sizeUnoccupied) return


    const tx = db.transaction(['entries', 'responses'], 'readwrite')
    const entriesStore = tx.objectStore('entries')
    const responsesStore = tx.objectStore('responses')

    let cursor = await entriesStore.index('expiredAt').openCursor()

    while (sizeUnoccupied < size && cursor) {
      await cursor.delete()
      await responsesStore.delete(cursor.value.key)
      sizeUnoccupied += cursor.value.size
      cursor = await cursor.continue()
    }

    await tx.done
  }
}
