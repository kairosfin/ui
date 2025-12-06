import { db } from '@/data/mock-db' // Certifique-se que seu mock-db use 'ticker' agora, não 'symbol'

// Helper de delay para simular latência de rede
const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms))

export const portfolioService = {
  // GET /api/portfolio (Mock)
  async getPortfolio() {
    await delay()
    return {
      positions: db.positions,
      balance: db.balance, // <-- Agora Bank e Portfolio compartilham o mesmo saldo salvo!
    }
  },

  // POST /api/orders/{id}/cancel (Mock)
  async cancelOrder(orderId: number): Promise<boolean> {
    await delay(800)

    // Procura a ordem dentro de todas as posições
    for (const position of db.positions) {
      const order = position.orders.find((o) => o.id === orderId)

      if (order) {
        order.status = 'Cancelada'
        order.color = 'text-error'

        const now = new Date()
        order.timeline.push({
          date: now.toLocaleString('pt-BR'),
          label: 'Cancelamento solicitado pelo usuário',
        })

        return true
      }
    }
    return false
  },

  /**
   * 3. MOCK: Histórico do Portfólio (Rentabilidade total)
   * Movido de stockService para cá, onde faz mais sentido.
   */
  async getPortfolioHistory(period: string) {
    await delay(600)

    // Lógica Mock de geração de gráfico
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
