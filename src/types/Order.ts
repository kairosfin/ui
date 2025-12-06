export interface OrderTimeline {
  date: string
  label: string
}

export interface Order {
  id: number
  type: 'Compra' | 'Venda' | 'Resgate' | 'Aplicação' | 'Depósito'
  date: string // Visual: "23 out"
  dateISO: string // Lógica: "2025-10-23T..." (DateTime do C#)
  price: number
  qty: number
  total: number // Sugestão: Adicione isso (qty * price). O Grid sempre pede.
  fees: number
  status: string
  color: string
  timeline: OrderTimeline[]
  ticker?: string
}
