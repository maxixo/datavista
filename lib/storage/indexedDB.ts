const DB_NAME = 'DataVistaDB'
const DB_VERSION = 1
const DATASETS_STORE = 'datasets'
const TRANSFORMS_STORE = 'transforms'

export class IndexedDBManager {
  private db: IDBDatabase | null = null

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Create datasets store
        if (!db.objectStoreNames.contains(DATASETS_STORE)) {
          const datasetStore = db.createObjectStore(DATASETS_STORE, { keyPath: 'id' })
          datasetStore.createIndex('userId', 'userId', { unique: false })
          datasetStore.createIndex('timestamp', 'timestamp', { unique: false })
        }

        // Create transforms store
        if (!db.objectStoreNames.contains(TRANSFORMS_STORE)) {
          db.createObjectStore(TRANSFORMS_STORE, { keyPath: 'id' })
        }
      }
    })
  }

  async saveDataset(dataset: any): Promise<string> {
    if (!this.db) await this.init()
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([DATASETS_STORE], 'readwrite')
      const store = transaction.objectStore(DATASETS_STORE)
      const request = store.put(dataset)

      request.onsuccess = () => resolve(request.result as string)
      request.onerror = () => reject(request.error)
    })
  }

  async getDataset(id: string): Promise<any> {
    if (!this.db) await this.init()
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([DATASETS_STORE], 'readonly')
      const store = transaction.objectStore(DATASETS_STORE)
      const request = store.get(id)

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async getAllDatasets(): Promise<any[]> {
    if (!this.db) await this.init()
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([DATASETS_STORE], 'readonly')
      const store = transaction.objectStore(DATASETS_STORE)
      const request = store.getAll()

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async deleteDataset(id: string): Promise<void> {
    if (!this.db) await this.init()
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([DATASETS_STORE], 'readwrite')
      const store = transaction.objectStore(DATASETS_STORE)
      const request = store.delete(id)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }
}

export const dbManager = new IndexedDBManager()