'use client'
import { useMemo } from 'react'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
  // ⛔ REMOVED: ContentRenderer / PieLabelRenderProps import
} from 'recharts'

interface ChartContainerProps {
  data: any[]
  type: 'bar' | 'line' | 'pie' | 'scatter'
  xKey: string
  yKey: string | string[]
  title?: string
  colors?: string[]
}

const DEFAULT_COLORS = [
  '#3B82F6', // blue-500
  '#10B981', // green-500
  '#F59E0B', // amber-500
  '#EF4444', // red-500
  '#8B5CF6', // purple-500
  '#EC4899', // pink-500
  '#14B8A6', // teal-500
  '#F97316', // orange-500
]

// ✅ ADDED: simple label renderer that returns a string (valid React node)
const renderPieLabel = (p: any) => String(p?.name ?? '')

export default function ChartContainer({
  data,
  type,
  xKey,
  yKey,
  title,
  colors = DEFAULT_COLORS
}: ChartContainerProps) {
  // Limit data points for performance
  const chartData = useMemo(() => {
    return data.slice(0, 100)
  }, [data])

  const yKeys = useMemo(() => {
    return Array.isArray(yKey) ? yKey : [yKey]
  }, [yKey])

  if (!chartData.length || !xKey || yKeys.length === 0) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center text-gray-500">
          <p className="text-lg font-semibold">No chart data available</p>
          <p className="text-sm mt-2">Select X and Y axis columns to visualize data</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      )}
      
      <ResponsiveContainer width="100%" height={400}>
        {type === 'bar' && (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey={xKey} 
              tick={{ fill: '#6B7280', fontSize: 12 }}
              stroke="#9CA3AF"
            />
            <YAxis 
              tick={{ fill: '#6B7280', fontSize: 12 }}
              stroke="#9CA3AF"
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #E5E7EB',
                borderRadius: '8px'
              }}
            />
            <Legend />
            {yKeys.map((key, index) => (
              <Bar 
                key={key} 
                dataKey={key} 
                fill={colors[index % colors.length]}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        )}

        {type === 'line' && (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey={xKey}
              tick={{ fill: '#6B7280', fontSize: 12 }}
              stroke="#9CA3AF"
            />
            <YAxis 
              tick={{ fill: '#6B7280', fontSize: 12 }}
              stroke="#9CA3AF"
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #E5E7EB',
                borderRadius: '8px'
              }}
            />
            <Legend />
            {yKeys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        )}

        {type === 'pie' && (
          <PieChart>
            <Pie
              data={chartData}
              dataKey={yKeys[0]}
              nameKey={xKey}
              cx="50%"
              cy="50%"
              outerRadius={140}
              // ✅ CHANGED: use a function that returns string; no extra types needed
              label={renderPieLabel}
              labelLine={{ stroke: '#9CA3AF' }}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #E5E7EB',
                borderRadius: '8px'
              }}
            />
            <Legend />
          </PieChart>
        )}

        {type === 'scatter' && (
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              type="number" 
              dataKey={xKey}
              tick={{ fill: '#6B7280', fontSize: 12 }}
              stroke="#9CA3AF"
              name={xKey}
            />
            <YAxis 
              type="number" 
              dataKey={yKeys[0]}
              tick={{ fill: '#6B7280', fontSize: 12 }}
              stroke="#9CA3AF"
              name={yKeys[0]}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #E5E7EB',
                borderRadius: '8px'
              }}
              cursor={{ strokeDasharray: '3 3' }}
            />
            <Legend />
            <Scatter 
              name={yKeys[0]} 
              data={chartData} 
              fill={colors[0]}
            />
          </ScatterChart>
        )}
      </ResponsiveContainer>

      <div className="mt-4 text-sm text-gray-500 text-center">
        Displaying {chartData.length} of {data.length} data points
      </div>
    </div>
  )
}
