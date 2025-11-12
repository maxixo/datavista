'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import type { Dataset } from '@/types'

interface DataContextType {
  datasets: Dataset[]
  setDatasets: (datasets: Dataset[]) => void
  activeDataset: Dataset | null
  setActiveDataset: (dataset: Dataset | null) => void
}

const DataContext = createContext<DataContextType>({
  datasets: [],
  setDatasets: () => {},
  activeDataset: null,
  setActiveDataset: () => {},
})

export function DataProvider({ children }: { children: ReactNode }) {
  const [datasets, setDatasets] = useState<Dataset[]>([])
  const [activeDataset, setActiveDataset] = useState<Dataset | null>(null)

  return (
    <DataContext.Provider
      value={{
        datasets,
        setDatasets,
        activeDataset,
        setActiveDataset,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => useContext(DataContext)