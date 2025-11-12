export class SyncManager {
  private syncQueue: any[] = []
  private isSyncing: boolean = false

  constructor() {
    this.loadQueue()
    this.setupListeners()
  }

  private setupListeners() {
    window.addEventListener('online', () => this.sync())
    
    // Attempt sync every 30 seconds when online
    setInterval(() => {
      if (navigator.onLine) {
        this.sync()
      }
    }, 30000)
  }

  private loadQueue() {
    const stored = localStorage.getItem('syncQueue')
    if (stored) {
      this.syncQueue = JSON.parse(stored)
    }
  }

  private saveQueue() {
    localStorage.setItem('syncQueue', JSON.stringify(this.syncQueue))
  }

  addOperation(operation: {
    type: 'create' | 'update' | 'delete'
    entity: 'dataset' | 'transform'
    data: any
    timestamp: number
  }) {
    this.syncQueue.push(operation)
    this.saveQueue()
    
    if (navigator.onLine) {
      this.sync()
    }
  }

  async sync(): Promise<void> {
    if (this.isSyncing || this.syncQueue.length === 0) return
    
    this.isSyncing = true
    const operations = [...this.syncQueue]
    
    try {
      for (const operation of operations) {
        await this.syncOperation(operation)
        // Remove from queue on success
        this.syncQueue.shift()
        this.saveQueue()
      }
    } catch (error) {
      console.error('Sync failed:', error)
    } finally {
      this.isSyncing = false
    }
  }

  private async syncOperation(operation: any): Promise<void> {
    const endpoint = `/api/${operation.entity}s`
    
    let method = 'POST'
    if (operation.type === 'update') method = 'PUT'
    if (operation.type === 'delete') method = 'DELETE'

    const response = await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(operation.data)
    })

    if (!response.ok) {
      throw new Error(`Sync failed: ${response.statusText}`)
    }
  }

  getPendingCount(): number {
    return this.syncQueue.length
  }
}

export const syncManager = new SyncManager()
