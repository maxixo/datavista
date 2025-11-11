'use client'
import { useMemo } from 'react'
import { List, type RowComponentProps } from 'react-window'
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react'

interface DataTableProps {
  data: any[]
  columns: string[]
  onSort?: (column: string) => void
  sortConfig?: { column: string; direction: 'asc' | 'desc' }
  maxHeight?: number
}

export default function DataTable({ 
  data, 
  columns, 
  onSort, 
  sortConfig,
  maxHeight = 600 
}: DataTableProps) {
  const columnWidths = useMemo(() => {
    const width = 100 / columns.length
    return columns.reduce((acc, col) => {
      acc[col] = `${width}%`
      return acc
    }, {} as Record<string, string>)
  }, [columns])

  const Row = ({ index, style, ariaAttributes }: RowComponentProps) => {
    const row = data[index]
    
    return (
      <div 
        {...ariaAttributes}
        style={style} 
        className="flex border-b border-gray-200 hover:bg-gray-50"
      >
        {columns.map((col) => (
          <div
            key={col}
            style={{ width: columnWidths[col] }}
            className="px-4 py-3 text-sm text-gray-900 truncate"
            title={String(row[col] ?? '')}
          >
            {String(row[col] ?? '')}
          </div>
        ))}
      </div>
    )
  }

  const getSortIcon = (column: string) => {
    if (!sortConfig || sortConfig.column !== column) {
      return <ArrowUpDown className="w-4 h-4 text-gray-400" />
    }
    return sortConfig.direction === 'asc' 
      ? <ArrowUp className="w-4 h-4 text-blue-600" />
      : <ArrowDown className="w-4 h-4 text-blue-600" />
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      {/* Header */}
      <div className="flex bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
        {columns.map((col) => (
          <div
            key={col}
            style={{ width: columnWidths[col] }}
            className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 flex items-center gap-2"
            onClick={() => onSort?.(col)}
          >
            <span className="truncate">{col}</span>
            {getSortIcon(col)}
          </div>
        ))}
      </div>

      {/* Virtual scrolling body */}
      {data.length > 0 ? (
        <List
          rowComponent={Row}
          rowCount={data.length}
          rowHeight={50}
          rowProps={{}}
          defaultHeight={Math.min(maxHeight, data.length * 50)}
          style={{ height: Math.min(maxHeight, data.length * 50), width: '100%' }}
        />
      ) : (
        <div className="p-12 text-center text-gray-500">
          <p className="text-lg">No data available</p>
          <p className="text-sm mt-2">Upload a dataset to get started</p>
        </div>
      )}

      {/* Footer */}
      <div className="bg-gray-50 border-t border-gray-200 px-4 py-3 text-sm text-gray-700">
        Showing {data.length.toLocaleString()} rows
      </div>
    </div>
  )
}
