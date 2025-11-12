'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Download, Trash2, Edit2 } from 'lucide-react'
import DataTable from '@/components/data/DataTable'
import ChartContainer from './../../../../components/data/ChartContainer'
import TransformPanel from '@/components/transforms/TransformPanel'
import { DataTransformer } from './../../../../lib/data/transform'
import type { Dataset, FilterConfig, SortConfig } from '@/types'

export default function DatasetDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [dataset, setDataset] = useState<Dataset | null>(null)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<FilterConfig[]>([])
  const [sort, setSort] = useState<SortConfig | null>(null)
  const [activeView, setActiveView] = useState<'table' | 'chart'>('table')

  useEffect(() => {
    loadDataset()
  }, [params.id])

  const loadDataset = async () => {
    try {
      const response = await fetch(`/api/datasets/${params.id}`)
      if (response.ok) {
        const { dataset } = await response.json()
        setDataset(dataset)
      }
    } catch (error) {
      console.error('Failed to load dataset:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this dataset?')) return

    try {
      const response = await fetch(`/api/datasets?id=${params.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Failed to delete dataset:', error)
    }
  }

  const handleExport = () => {
    if (!dataset) return

    const dataStr = JSON.stringify(transformedData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${dataset.name}-export.json`
    link.click()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!dataset) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-gray-600">Dataset not found</p>
        <button
          onClick={() => router.push('/dashboard')}
          className="mt-4 text-blue-600 hover:text-blue-700"
        >
          Return to Dashboard
        </button>
      </div>
    )
  }

  const transformedData = DataTransformer.multiTransform(
    dataset.data,
    filters,
    sort ?? undefined
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{dataset.name}</h1>
              <p className="text-sm text-gray-600">
                Created {new Date(dataset.timestamp).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600">Total Rows</p>
            <p className="text-2xl font-bold">{dataset.rowCount.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Columns</p>
            <p className="text-2xl font-bold">{dataset.columns.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">After Transforms</p>
            <p className="text-2xl font-bold text-blue-600">
              {transformedData.length.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveView('table')}
          className={`px-4 py-2 rounded-lg font-medium ${
            activeView === 'table'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          Table View
        </button>
        <button
          onClick={() => setActiveView('chart')}
          className={`px-4 py-2 rounded-lg font-medium ${
            activeView === 'chart'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          Chart View
        </button>
      </div>

      {/* Transform Panel */}
      <TransformPanel
        columns={dataset.columns}
        onApplyFilters={setFilters}
        onApplySort={setSort}
        onApplyGroupBy={() => {}}
      />

      {/* Content */}
      {activeView === 'table' ? (
        <DataTable
          data={transformedData}
          columns={dataset.columns}
          onSort={(column) => {
            setSort(prev => ({
              column,
              direction:
                prev?.column === column && prev?.direction === 'asc'
                  ? 'desc'
                  : 'asc'
            }))
          }}
          sortConfig={sort || undefined}
        />
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          <ChartContainer
            data={transformedData}
            type="bar"
            xKey={dataset.columns[0]}
            yKey={dataset.columns[1]}
          />
        </div>
      )}
    </div>
  )
}
