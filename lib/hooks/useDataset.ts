import { useState, useEffect } from 'react'
import { dbManager } from '../storage/indexedDB'
import { syncManager } from '../storage/syncManager'

export interface Dataset {
  id: string
  name: string
  data: any[]
  columns: string[]
  userId: string
  timestamp: number
}

export function useDataset() {
  const [datasets, setDatasets] = useState<Dataset[]>([])
  const [activeDataset, setActiveDataset] = useState<Dataset | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadDatasets()
  }, [])

  const loadDatasets = async () => {
    try {
      setLoading(true)
      const data = await dbManager.getAllDatasets()
      setDatasets(data)
      if (data.length > 0 && !activeDataset) {
        setActiveDataset(data[0])
      }
    } catch (err) {
      setError('Failed to load datasets')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const saveDataset = async (dataset: Dataset) => {
    try {
      setLoading(true)
      await dbManager.saveDataset(dataset)
      
      // Add to sync queue
      syncManager.addOperation({
        type: 'create',
        entity: 'dataset',
        data: dataset,
        timestamp: Date.now()
      })
      
      await loadDatasets()
    } catch (err) {
      setError('Failed to save dataset')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const deleteDataset = async (id: string) => {
    try {
      setLoading(true)
      await dbManager.deleteDataset(id)
      
      syncManager.addOperation({
        type: 'delete',
        entity: 'dataset',
        data: { id },
        timestamp: Date.now()
      })
      
      if (activeDataset?.id === id) {
        setActiveDataset(null)
      }
      
      await loadDatasets()
    } catch (err) {
      setError('Failed to delete dataset')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return {
    datasets,
    activeDataset,
    setActiveDataset,
    saveDataset,
    deleteDataset,
    loading,
    error,
    refresh: loadDatasets
  }
}