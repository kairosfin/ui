import type { Position } from '@/types/Position'
import { MOCK_STOCKS, generateMockOrders } from './mock-stock-data'

// Gera carteira inicial simulada
const INITIAL_POSITIONS: Position[] = MOCK_STOCKS.map((stock) => {
  return {
    ...stock,
    name: stock.shortName,
    logo: stock.logoUrl,
    quantity: Math.floor(Math.random() * 500) + 10,
    avgPrice: stock.regularMarketPrice * 0.95, // Simula lucro
    currentTotal: stock.regularMarketPrice * 100, // Valor aproximado
    profit: 250.5,
    profitPercent: 5.2,
    orders: generateMockOrders(stock.symbol, stock.regularMarketPrice),
  }
})

// O Estado Global (Singleton)
export const db = {
  positions: [...INITIAL_POSITIONS],
  balance: 1520.93,
}
