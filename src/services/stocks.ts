import { MOCK_STOCKS } from '@/data/mock-stock-data'
import type { StockQuote } from '@/types/Stock'
import api from './api'

const USE_MOCK = true
const delay = (ms = 800) => new Promise((resolve) => setTimeout(resolve, ms))

export interface PortfolioHistory {
  values: number[]
  dates: string[]
}

function generateRandomTrend(startValue: number, count: number, volatility: number): number[] {
  const data = [startValue]
  for (let i = 1; i < count; i++) {
    const change = (Math.random() - 0.5) * volatility
    const newValue = data[i - 1]! + change
    data.push(Math.max(0, newValue))
  }
  return data
}

class StockService {
  async getAll(): Promise<StockQuote[]> {
    if (USE_MOCK) {
      await delay()
      return [...MOCK_STOCKS]
    }
    const { data } = await api.get<StockQuote[]>('/stocks')
    return data
  }

  async getBySymbol(symbol: string): Promise<StockQuote | undefined> {
    if (USE_MOCK) {
      await delay()
      return MOCK_STOCKS.find((s) => s.symbol === symbol)
    }
    const { data } = await api.get<StockQuote>(`/stocks/${symbol}`)
    return data
  }

  async getPortfolioHistory(period: string): Promise<PortfolioHistory> {
    if (USE_MOCK) {
      await delay(400)

      let values: number[] = []
      let daysCount = 0
      let startValue = 10000
      let interval = 1
      let showYear = false

      switch (period) {
        case '1M':
          daysCount = 30
          startValue = 17500
          values = generateRandomTrend(startValue, daysCount, 200)
          break

        case '6M':
          daysCount = 180
          startValue = 15000
          values = generateRandomTrend(startValue, daysCount, 300).map((v, i) => v + i * 20)
          break

        case '1Y':
          daysCount = 365
          interval = 1
          startValue = 12000
          values = generateRandomTrend(startValue, daysCount, 400).map((v, i) => v + i * 15)
          showYear = true // <--- Ativa formato MM/AA
          break

        case 'YTD':
          daysCount = 200
          startValue = 13500
          values = generateRandomTrend(startValue, daysCount, 250).map((v, i) => v + i * 10)
          break

        case 'ALL':
          daysCount = 1000 // ~3 anos
          interval = 1
          startValue = 5000
          values = generateRandomTrend(startValue, daysCount, 500).map((v, i) => v + i * 12)
          showYear = true // <--- Ativa formato MM/AA
          break

        default:
          daysCount = 30
          values = generateRandomTrend(15000, 30, 200)
      }

      const dates = this.generateDates(values.length, interval, showYear)
      return { values, dates }
    }

    const { data } = await api.get<PortfolioHistory>(`/portfolio/history`, { params: { period } })
    return data
  }

  // --- HELPER ATUALIZADO PARA FORMATO NUMÉRICO ---
  private generateDates(count: number, daysInterval: number, includeYear: boolean): string[] {
    const dates: string[] = []
    const today = new Date()

    for (let i = count - 1; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(today.getDate() - i * daysInterval)

      let formatted = ''

      if (includeYear) {
        // Formato Longo: "10/25" (Mês/Ano)
        // Usamos toLocaleDateString que já coloca a barra automaticamente
        formatted = date.toLocaleDateString('pt-BR', {
          month: 'short',
          year: 'numeric',
        })
      } else {
        // Formato Curto: "23/nov" (Dia/Mês)
        formatted = date.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'short',
        })
      }

      dates.push(formatted)
    }
    return dates
  }
}

export const stockService = new StockService()
