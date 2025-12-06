import type { Order } from './Order'
import type { Stock } from './Stock'

export interface Position extends Stock {
  quantity: number
  avgPrice: number // Preço médio de compra
  currentTotal: number // quantity * price
  profit: number // currentTotal - (quantity * avgPrice)
  profitPercent: number // (profit / totalInvested) * 100
  orders: Order[]
}
