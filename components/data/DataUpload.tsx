'use client'
import { useState, useCallback } from 'react'
import { Upload, FileText, AlertCircle } from 'lucide-react'
import Papa from 'papaparse'

interface DataUploadProps {
  onUpload: (data: any[], filename: string) => void
}

export default function DataUpload({ onUpload }: DataUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
  }, [])

  const processFile = async (file: File) => {
    setLoading(true)
    setError(null)

    try {
      if (file.name.endsWith('.csv')) {
        Papa.parse(file, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          worker: true,
          complete: (results) => {
            if (results.errors.length > 0) {
              setError('CSV parsing errors detected')
            }
            onUpload(results.data as any[], file.name)
            setLoading(false)
          },
          error: (err) => {
            setError(err.message)
            setLoading(false)
          }
        })
      } else if (file.name.endsWith('.json')) {
        const text = await file.text()
        const json = JSON.parse(text)
        const data = Array.isArray(json) ? json : [json]
        onUpload(data, file.name)
        setLoading(false)
      } else {
        setError('Unsupported file format. Please upload CSV or JSON.')
        setLoading(false)
      }
    } catch (err) {
      setError('Failed to process file')
      setLoading(false)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-12 text-center transition-all
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'}
          ${loading ? 'opacity-50 pointer-events-none' : 'cursor-pointer hover:border-blue-400'}
        `}
      >
        <input
          type="file"
          accept=".csv,.json"
          onChange={handleFileInput}
          className="hidden"
          id="file-upload"
          disabled={loading}
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          {loading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4" />
              <p className="text-gray-600">Processing file...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="w-16 h-16 text-gray-400 mb-4" />
              <p className="text-lg font-semibold text-gray-700 mb-2">
                Drop your file here or click to browse
              </p>
              <p className="text-sm text-gray-500">
                Supports CSV and JSON files up to 50,000 rows
              </p>
            </div>
          )}
        </label>
      </div>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-900">Upload Error</p>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}
    </div>
  )
}
