import type { Order, OrderTimeline } from '@/types/Order'
import type { StockQuote } from '@/types/Stock'

// --- HELPER FUNCTIONS ---
function getPastDate(daysAgo: number): string {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  return date.toISOString()
}

function formatDisplayDate(isoDate: string): string {
  const date = new Date(isoDate)
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

function generateTimeline(dateStr: string, status: string): OrderTimeline[] {
  // Extrai data legível para o histórico
  const displayDate = new Date(dateStr).toLocaleDateString('pt-BR')
  const events = [{ date: `${displayDate} 10:00:01`, label: 'Registrada na Bolsa' }]

  if (status.includes('Executada')) {
    events.push({ date: `${displayDate} 10:00:05`, label: 'Executada Totalmente' })
  } else if (status.includes('Cancelada')) {
    events.push({ date: `${displayDate} 10:05:00`, label: 'Cancelada pelo Operador' })
  }
  return events
}

// --- GERADOR DE ORDENS ---
export const generateMockOrders = (symbol: string, currentPrice: number): Order[] => {
  const orders: Order[] = []
  const date0 = getPastDate(0) // Hoje
  const date5 = getPastDate(5) // 5 dias atrás
  const date45 = getPastDate(45) // 45 dias atrás

  // 1. Ordem Recente (Compra)
  orders.push({
    id: Math.floor(Math.random() * 100000),
    type: 'Compra',
    date: formatDisplayDate(date5),
    dateISO: date5,
    price: currentPrice * 0.98,
    qty: 10,
    status: 'Executada Parc.',
    color: 'text-success',
    fees: 0.45,
    timeline: generateTimeline(date5, 'Executada'),
  })

  // 2. Ordem Antiga (Venda)
  orders.push({
    id: Math.floor(Math.random() * 100000),
    type: 'Venda',
    date: formatDisplayDate(date45),
    dateISO: date45,
    price: currentPrice * 1.1,
    qty: 50,
    status: 'Executada',
    color: 'text-success',
    fees: 0.45,
    timeline: generateTimeline(date45, 'Executada'),
  })

  // 3. Caso Específico: Ordem ABERTA (Para testar cancelar)
  if (symbol === 'VALE3' || symbol === 'PETR4') {
    orders.push({
      id: 99999, // ID fixo para facilitar
      type: 'Compra',
      date: 'Hoje',
      dateISO: date0,
      price: currentPrice * 0.99,
      qty: 100,
      status: 'Registrada', // Status que permite cancelamento
      color: 'text-medium-emphasis',
      fees: 0,
      timeline: generateTimeline(date0, 'Registrada'),
    })
  }

  // 4. Caso Específico: Transação Financeira (Resgate)
  if (symbol === 'FIQE3') {
    orders.push({
      id: 88888,
      type: 'Resgate',
      date: formatDisplayDate(date0),
      dateISO: date0,
      price: 1500.0,
      qty: 0,
      status: 'Ordem #15201',
      color: 'text-success',
      fees: 0,
      timeline: [{ date: `${formatDisplayDate(date0)} 11:45`, label: 'Solicitação concluída' }],
    })
  }

  return orders
}

// --- DADOS DE MERCADO ---
export const MOCK_STOCKS: StockQuote[] = [
  {
    symbol: 'PETR4',
    shortName: 'Petrobras PN',
    regularMarketPrice: 36.5,
    regularMarketChangePercent: 1.25,
    logoUrl: 'https://brapi.dev/favicon.svg',
  },
  {
    symbol: 'VALE3',
    shortName: 'Vale S.A.',
    regularMarketPrice: 62.1,
    regularMarketChangePercent: -0.85,
    logoUrl: 'https://brapi.dev/favicon.svg',
  },
  {
    symbol: 'FIQE3',
    shortName: 'Unifique',
    regularMarketPrice: 5.2,
    regularMarketChangePercent: 1.02,
    logoUrl: 'https://brapi.dev/favicon.svg',
  },
  {
    symbol: 'WEGE3',
    shortName: 'WEG S.A.',
    regularMarketPrice: 40.5,
    regularMarketChangePercent: 1.1,
    logoUrl: 'https://brapi.dev/favicon.svg',
  },
  {
    symbol: 'ITUB4',
    shortName: 'Itaú Unibanco',
    regularMarketPrice: 33.4,
    regularMarketChangePercent: 0.55,
    logoUrl: 'https://brapi.dev/favicon.svg',
  },
]
