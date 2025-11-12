import type { FilterConfig, GroupByConfig, SortConfig } from '@/types'

type GroupAccumulator = Record<string, { [key: string]: any; _items: any[] }>

export class DataTransformer {
  static filter(data: any[], config: FilterConfig): any[] {
    return data.filter(row => {
      const value = row[config.column]
      
      switch (config.operator) {
        case 'equals':
          return value === config.value
        case 'contains':
          return String(value).toLowerCase().includes(String(config.value).toLowerCase())
        case 'greater':
          return Number(value) > Number(config.value)
        case 'less':
          return Number(value) < Number(config.value)
        case 'between':
          return Number(value) >= Number(config.value) && Number(value) <= Number(config.value2)
        default:
          return true
      }
    })
  }

  static sort(data: any[], config: SortConfig): any[] {
    return [...data].sort((a, b) => {
      const aVal = a[config.column]
      const bVal = b[config.column]
      
      if (aVal === bVal) return 0
      
      const result = aVal > bVal ? 1 : -1
      return config.direction === 'asc' ? result : -result
    })
  }

  static groupBy(data: any[], config: GroupByConfig): any[] {
    const groups = data.reduce<GroupAccumulator>((acc, row) => {
      const groupValue = row[config.column]
      const key = String(groupValue)
      if (!acc[key]) {
        acc[key] = {
          [config.column]: groupValue,
          _items: []
        }
      }
      acc[key]._items.push(row)
      return acc
    }, {} as GroupAccumulator)

    return Object.values(groups).map(group => {
      const result = { [config.column]: group[config.column] }
      
      config.aggregations.forEach(agg => {
        const values = group._items.map((item: any) => Number(item[agg.column]) || 0)
        
        switch (agg.operation) {
          case 'sum':
            result[`${agg.column}_sum`] = values.reduce((a: number, b: number) => a + b, 0)
            break
          case 'avg':
            result[`${agg.column}_avg`] = values.reduce((a: number, b: number) => a + b, 0) / values.length
            break
          case 'count':
            result[`${agg.column}_count`] = values.length
            break
          case 'min':
            result[`${agg.column}_min`] = Math.min(...values)
            break
          case 'max':
            result[`${agg.column}_max`] = Math.max(...values)
            break
        }
      })
      
      return result
    })
  }

  static multiTransform(
    data: any[],
    filters?: FilterConfig[],
    sort?: SortConfig,
    groupBy?: GroupByConfig
  ): any[] {
    let result = data

    // Apply filters
    if (filters && filters.length > 0) {
      filters.forEach(filter => {
        result = this.filter(result, filter)
      })
    }

    // Apply grouping
    if (groupBy) {
      result = this.groupBy(result, groupBy)
    }

    // Apply sorting
    if (sort) {
      result = this.sort(result, sort)
    }

    return result
  }
}
