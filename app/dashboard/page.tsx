'use client'

import { useState } from 'react'
import { useDataset } from '@/lib/hooks/useDataset'
import DataUpload from '@/components/data/DataUpload'
import DataTable from '@/components/data/DataTable'
import ChartContainer from './../../components/data/ChartContainer'
import TransformPanel from '@/components/transforms/TransformPanel'
import { DataTransformer } from './../../lib/data/transform'
import type { FilterConfig, SortConfig } from '@/types'
import { Upload, Table, BarChart3 } from 'lucide-react'

export default function DashboardPage() {
  const { datasets, activeDataset, setActiveDataset, saveDataset } = useDataset()
  const [filters, setFilters] = useState<FilterConfig[]>([])
  const [sort, setSort] = useState<SortConfig | null>(null)
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie' | 'scatter'>('bar')
  const [chartConfig, setChartConfig] = useState({ xAxis: '', yAxis: '' })
  const [activeTab, setActiveTab] = useState<'upload' | 'table' | 'chart'>('upload')

  const handleDataUpload = async (data: any[], filename: string) => {
    const columns = data.length > 0 ? Object.keys(data[0]) : []
    const dataset = {
      id: `dataset-${Date.now()}`,
      name: filename,
      data,
      columns,
      userId: 'current-user', // This will be replaced with actual user ID
      timestamp: Date.now(),
      rowCount: data.length,
    }

    await saveDataset(dataset)
    setActiveDataset(dataset)
    setActiveTab('table')
  }

  const transformedData = activeDataset
    ? DataTransformer.multiTransform(
        activeDataset.data,
        filters,
        sort ?? undefined
      )
    : []

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      {activeDataset && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            Dataset: {activeDataset.name}
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Total Rows</p>
              <p className="text-2xl font-bold text-gray-900">
                {activeDataset.data.length.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Columns</p>
              <p className="text-2xl font-bold text-gray-900">
                {activeDataset.columns.length}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">After Transforms</p>
              <p className="text-2xl font-bold text-blue-600">
                {transformedData.length.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex gap-4 px-6">
            <button
              onClick={() => setActiveTab('upload')}
              className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === 'upload'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Upload className="w-4 h-4" />
              Upload
            </button>
            <button
              onClick={() => setActiveTab('table')}
              disabled={!activeDataset}
              className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                activeTab === 'table'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Table className="w-4 h-4" />
              Data Table
            </button>
            <button
              onClick={() => setActiveTab('chart')}
              disabled={!activeDataset}
              className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                activeTab === 'chart'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Charts
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'upload' && (
            <DataUpload onUpload={handleDataUpload} />
          )}

          {activeTab === 'table' && activeDataset && (
            <div className="space-y-6">
              <TransformPanel
                columns={activeDataset.columns}
                onApplyFilters={setFilters}
                onApplySort={setSort}
                onApplyGroupBy={() => {}}
              />
              <DataTable
                data={transformedData}
                columns={activeDataset.columns}
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
            </div>
          )}

          {activeTab === 'chart' && activeDataset && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chart Type
                  </label>
                  <select
                    value={chartType}
                    onChange={(e) => setChartType(e.target.value as any)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="bar">Bar Chart</option>
                    <option value="line">Line Chart</option>
                    <option value="pie">Pie Chart</option>
                    <option value="scatter">Scatter Plot</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    X Axis
                  </label>
                  <select
                    value={chartConfig.xAxis}
                    onChange={(e) => setChartConfig(prev => ({ ...prev, xAxis: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="">Select column</option>
                    {activeDataset.columns.map(col => (
                      <option key={col} value={col}>{col}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Y Axis
                  </label>
                  <select
                    value={chartConfig.yAxis}
                    onChange={(e) => setChartConfig(prev => ({ ...prev, yAxis: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="">Select column</option>
                    {activeDataset.columns.map(col => (
                      <option key={col} value={col}>{col}</option>
                    ))}
                  </select>
                </div>
              </div>

              <ChartContainer
                data={transformedData}
                type={chartType}
                xKey={chartConfig.xAxis}
                yKey={chartConfig.yAxis}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
