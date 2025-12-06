import type { Order, OrderTimeline } from '@/types/Order'
import type { Stock } from '@/types/Stock'

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
  const displayDate = new Date(dateStr).toLocaleDateString('pt-BR')
  const events = [{ date: `${displayDate} 10:00:01`, label: 'Solicitação recebida' }]

  if (status.includes('Executada') || status === 'Concluída') {
    events.push({ date: `${displayDate} 10:00:05`, label: 'Processamento concluído' })
  } else if (status.includes('Cancelada')) {
    events.push({ date: `${displayDate} 10:05:00`, label: 'Cancelada pelo Operador' })
  } else if (status === 'Em andamento' || status === 'Registrada') {
    events.push({ date: `${displayDate} 10:01:00`, label: 'Aguardando liquidação' })
  }
  return events
}

export const generateMockOrders = (ticker: string, currentPrice: number): Order[] => {
  const orders: Order[] = []

  const date0 = getPastDate(0)
  const date5 = getPastDate(5)
  const date45 = getPastDate(45)

  orders.push({
    id: Math.floor(Math.random() * 100000),
    type: 'Compra',
    ticker: ticker,
    date: formatDisplayDate(date5),
    dateISO: date5,
    price: currentPrice * 0.98,
    qty: 10,
    status: 'Executada Parc.',
    color: 'text-success',
    fees: 0.45,
    timeline: generateTimeline(date5, 'Executada'),
    total: currentPrice * 0.98 * 10,
  })

  orders.push({
    id: Math.floor(Math.random() * 100000),
    type: 'Venda',
    ticker: ticker,
    date: formatDisplayDate(date45),
    dateISO: date45,
    price: currentPrice * 1.1,
    qty: 50,
    status: 'Executada',
    color: 'text-success',
    fees: 0.45,
    timeline: generateTimeline(date45, 'Executada'),
    total: currentPrice * 1.1 * 50,
  })

  if (ticker === 'PETR4') {
    orders.unshift({
      id: 99901,
      type: 'Compra',
      ticker: ticker,
      date: 'Hoje',
      dateISO: date0,
      price: currentPrice * 0.99,
      qty: 100,
      status: 'Em andamento',
      color: 'text-primary',
      fees: 0,
      timeline: generateTimeline(date0, 'Em andamento'),
      total: currentPrice * 99,
    })
  }

  if (ticker === 'WEGE3') {
    orders.unshift({
      id: 99902,
      type: 'Venda',
      ticker: ticker,
      date: 'Hoje',
      dateISO: date0,
      price: currentPrice * 1.05,
      qty: 25,
      status: 'Registrada',
      color: 'text-success',
      fees: 0.15,
      timeline: generateTimeline(date0, 'Registrada'),
      total: currentPrice * 1.05 * 25,
    })
  }

  return orders
}

export const MOCK_STOCKS: Stock[] = [
  {
    ticker: 'PETR4',
    name: 'Petrobras PN',
    price: 36.5,
    dailyYield: 1.25,
    logo: 'https://logo.clearbit.com/petrobras.com.br',
    marketCap: 450000000,
    tradeVolume: 1500000,
    sector: 'Petróleo e Gás',
    updatedAt: new Date().toISOString(),
  },
  {
    ticker: 'VALE3',
    name: 'Vale S.A.',
    price: 62.1,
    dailyYield: -0.85,
    logo: 'https://logo.clearbit.com/vale.com',
    marketCap: 320000000,
    tradeVolume: 1200000,
    sector: 'Mineração',
    updatedAt: new Date().toISOString(),
  },
  {
    ticker: 'FIQE3',
    name: 'Unifique',
    price: 5.2,
    dailyYield: 1.02,
    logo: 'https://logo.clearbit.com/unifique.com.br',
    marketCap: 2000000,
    tradeVolume: 50000,
    sector: 'Telecom',
    updatedAt: new Date().toISOString(),
  },
  {
    ticker: 'ITUB4',
    name: 'Itaú Unibanco',
    price: 33.4,
    dailyYield: 0.55,
    logo: 'https://logo.clearbit.com/itau.com.br',
    marketCap: 280000000,
    tradeVolume: 900000,
    sector: 'Financeiro',
    updatedAt: new Date().toISOString(),
  },
  {
    ticker: 'WEGE3',
    name: 'WEG S.A.',
    price: 40.5,
    dailyYield: 1.1,
    logo: 'https://logo.clearbit.com/weg.net',
    marketCap: 180000000,
    tradeVolume: 800000,
    sector: 'Bens Industriais',
    updatedAt: new Date().toISOString(),
  },
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createOrderFromTrade(order: any): Order {
  const now = new Date()
  return {
    id: Math.floor(Math.random() * 1000000),
    type: order.type,
    ticker: order.ticker,
    date: formatDisplayDate(order.date),
    dateISO: order.date,
    price: order.price,
    qty: order.qty,
    total: order.total,
    fees: order.fees,
    status: 'Executada',
    color: order.type === 'Compra' ? 'text-primary' : 'text-success',
    timeline: [{ date: now.toLocaleString('pt-BR'), label: 'Executada a mercado' }],
  }
}
