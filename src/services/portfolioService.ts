import { db } from '@/data/mock-db'
import type { Position } from '@/types/Position'

const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms))

export const portfolioService = {
  // GET /api/portfolio
  async getPortfolio(): Promise<{ positions: Position[]; balance: number }> {
    await delay(400)
    // Busca sempre a versão mais recente do DB (que vem do LocalStorage)
    return {
      positions: db.positions,
      balance: db.balance,
    }
  },

  // POST /api/orders
  // AQUI ESTÁ A MÁGICA: Conecta o botão "Confirmar" do Trade com o DB
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async executeOrder(orderPayload: any): Promise<boolean> {
    await delay(800) // Simula processamento da corretora
    return db.executeOrder(orderPayload)
  },

  // POST /api/orders/{id}/cancel
  async cancelOrder(orderId: number): Promise<boolean> {
    await delay(600)
    return db.cancelOrder(orderId)
  },

  // GET /api/portfolio/history (Ainda Mock Visual)
  async getPortfolioHistory(period: string) {
    await delay(600)

    // Mantemos essa lógica visual gerada na hora,
    // pois criar histórico financeiro retroativo complexo no mock-db seria exagero agora.
    const count = period === '1Y' ? 100 : 30
    const startValue = 10000
    const values: number[] = [startValue]

    for (let i = 1; i < count; i++) {
      const change = (Math.random() - 0.45) * 200
      values.push(Math.max(0, values[i - 1]! + change))
    }

    const dates = values.map((_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (count - i))
      return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
    })

    return { values, dates }
  },
}
