import type { Order } from './Order'
import type { StockQuote } from './Stock'

export interface Position extends StockQuote {
  name: string
  logo: string
  quantity: number
  avgPrice: number
  currentTotal: number
  profit: number
  profitPercent: number
  orders: Order[]
}
