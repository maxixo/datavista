export interface Dataset {
  id: string
  name: string
  data: any[]
  columns: string[]
  userId: string
  timestamp: number
  rowCount: number
}

export interface FilterConfig {
  column: string
  operator: 'equals' | 'contains' | 'greater' | 'less' | 'between'
  value: any
  value2?: any
}

export interface SortConfig {
  column: string
  direction: 'asc' | 'desc'
}

export interface GroupByConfig {
  column: string
  aggregations: {
    column: string
    operation: 'sum' | 'avg' | 'count' | 'min' | 'max'
  }[]
}

export interface ChartConfig {
  type: 'bar' | 'line' | 'pie' | 'scatter'
  xAxis: string
  yAxis: string | string[]
  title?: string
}
