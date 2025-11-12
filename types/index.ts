export interface Dataset {
  id: string
  name: string
  data: any[]
  columns: string[]
  userId: string
  timestamp: number
  rowCount: number
  fileSize?: number
}

export type FilterOperator = 'equals' | 'contains' | 'greater' | 'less' | 'between'

export interface FilterConfig {
  column: string
  operator: FilterOperator
  value: string | number
  value2?: string | number
}

export type SortDirection = 'asc' | 'desc'

export interface SortConfig {
  column: string
  direction: SortDirection
}

export type AggregationOperation = 'sum' | 'avg' | 'count' | 'min' | 'max'

export interface GroupAggregation {
  column: string
  operation: AggregationOperation
}

export interface GroupByConfig {
  column: string
  aggregations: GroupAggregation[]
}

export type TransformHistory =
  | {
      id: string
      type: 'filter'
      config: FilterConfig[]
      timestamp: number
    }
  | {
      id: string
      type: 'sort'
      config: SortConfig
      timestamp: number
    }
  | {
      id: string
      type: 'groupBy'
      config: GroupByConfig
      timestamp: number
    }

export interface TransformState {
  filters: FilterConfig[]
  sort?: SortConfig
  groupBy?: GroupByConfig
  history: TransformHistory[]
  currentIndex: number
}

export interface ChartConfig {
  type: 'bar' | 'line' | 'pie' | 'scatter'
  xAxis: string
  yAxis: string | string[]
  title?: string
  colors?: string[]
}

export interface User {
  id: string
  email: string
  name?: string
  avatar?: string
}

export interface SyncOperation {
  id: string
  type: 'create' | 'update' | 'delete'
  entity: 'dataset' | 'transform'
  data: any
  timestamp: number
  status: 'pending' | 'synced' | 'failed'
}
