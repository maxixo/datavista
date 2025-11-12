'use client'
import { useState } from 'react'
import { Filter, SortAsc, Group, Plus, X } from 'lucide-react'
import type { FilterConfig, SortConfig, GroupByConfig } from './../../types'

interface TransformPanelProps {
  columns: string[]
  onApplyFilters: (filters: FilterConfig[]) => void
  onApplySort: (sort: SortConfig | null) => void
  onApplyGroupBy: (groupBy: GroupByConfig | null) => void
}

export default function TransformPanel({
  columns,
  onApplyFilters,
  onApplySort,
  onApplyGroupBy
}: TransformPanelProps) {
  const [filters, setFilters] = useState<FilterConfig[]>([])
  const [sort, setSort] = useState<SortConfig | null>(null)
  const [activeTab, setActiveTab] = useState<'filter' | 'sort' | 'group'>('filter')

  const addFilter = () => {
    setFilters([...filters, {
      column: columns[0] || '',
      operator: 'equals',
      value: ''
    }])
  }

  const removeFilter = (index: number) => {
    const newFilters = filters.filter((_, i) => i !== index)
    setFilters(newFilters)
    onApplyFilters(newFilters)
  }

  const updateFilter = (index: number, updates: Partial<FilterConfig>) => {
    const newFilters = [...filters]
    newFilters[index] = { ...newFilters[index], ...updates }
    setFilters(newFilters)
    onApplyFilters(newFilters)
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Data Transformations</h3>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('filter')}
          className={`px-4 py-2 font-medium text-sm transition-colors ${
            activeTab === 'filter'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Filter className="w-4 h-4 inline mr-2" />
          Filter
        </button>
        <button
          onClick={() => setActiveTab('sort')}
          className={`px-4 py-2 font-medium text-sm transition-colors ${
            activeTab === 'sort'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <SortAsc className="w-4 h-4 inline mr-2" />
          Sort
        </button>
        <button
          onClick={() => setActiveTab('group')}
          className={`px-4 py-2 font-medium text-sm transition-colors ${
            activeTab === 'group'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Group className="w-4 h-4 inline mr-2" />
          Group By
        </button>
      </div>

      {/* Filter Tab */}
      {activeTab === 'filter' && (
        <div className="space-y-4">
          {filters.map((filter, index) => (
            <div key={index} className="flex gap-2 items-start p-3 bg-gray-50 rounded-lg">
              <div className="flex-1 grid grid-cols-3 gap-2">
                <select
                  value={filter.column}
                  onChange={(e) => updateFilter(index, { column: e.target.value })}
                  className="border border-gray-300 rounded px-3 py-2 text-sm"
                >
                  {columns.map(col => (
                    <option key={col} value={col}>{col}</option>
                  ))}
                </select>
                
                <select
                  value={filter.operator}
                  onChange={(e) => updateFilter(index, { operator: e.target.value as any })}
                  className="border border-gray-300 rounded px-3 py-2 text-sm"
                >
                  <option value="equals">Equals</option>
                  <option value="contains">Contains</option>
                  <option value="greater">Greater than</option>
                  <option value="less">Less than</option>
                  <option value="between">Between</option>
                </select>
                
                <input
                  type="text"
                  value={filter.value}
                  onChange={(e) => updateFilter(index, { value: e.target.value })}
                  placeholder="Value"
                  className="border border-gray-300 rounded px-3 py-2 text-sm"
                />
              </div>
              
              <button
                onClick={() => removeFilter(index)}
                className="p-2 text-red-600 hover:bg-red-50 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          
          <button
            onClick={addFilter}
            className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Filter
          </button>
        </div>
      )}

      {/* Sort Tab */}
      {activeTab === 'sort' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort Column
              </label>
              <select
                value={sort?.column || ''}
                onChange={(e) => {
                  const newSort = e.target.value 
                    ? { column: e.target.value, direction: 'asc' as const }
                    : null
                  setSort(newSort)
                  onApplySort(newSort)
                }}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="">None</option>
                {columns.map(col => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>
            
            {sort && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Direction
                </label>
                <select
                  value={sort.direction}
                  onChange={(e) => {
                    const newSort = { ...sort, direction: e.target.value as 'asc' | 'desc' }
                    setSort(newSort)
                    onApplySort(newSort)
                  }}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Group By Tab */}
      {activeTab === 'group' && (
        <div className="text-center text-gray-500 py-8">
          <Group className="w-12 h-12 mx-auto text-gray-400 mb-3" />
          <p>Group By functionality</p>
          <p className="text-sm mt-2">Select a column to group data and apply aggregations</p>
        </div>
      )}
    </div>
  )
}
