export interface OrderTimeline {
  date: string
  label: string
}

export interface Order {
  id: number
  type: 'Compra' | 'Venda' | 'Resgate' | 'Aplicação' | 'Depósito'
  date: string
  dateISO: string
  price: number
  qty: number
  total: number
  fees: number
  status: string
  color: string
  timeline: OrderTimeline[]
  ticker?: string
}
