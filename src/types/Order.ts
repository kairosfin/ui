export interface OrderTimeline {
  date: string
  label: string
}

export interface Order {
  id: number
  type: 'Compra' | 'Venda' | 'Resgate' | 'Aplicação' | 'Depósito'
  date: string // Ex: "23 out. 2025" (Visual)
  dateISO: string // Ex: "2025-10-23" (Lógica/Filtro)
  price: number
  qty: number
  status: string
  color: string
  fees: number
  timeline: OrderTimeline[]
  symbol?: string // Opcional, usado quando a ordem é passada isolada
}
