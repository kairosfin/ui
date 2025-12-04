import { db } from '@/data/mock-db'
import type { Position } from '@/types/Position'

const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms))

export const portfolioService = {
  // GET /api/portfolio
  async getPortfolio(): Promise<{ positions: Position[]; balance: number }> {
    await delay()
    return {
      positions: db.positions,
      balance: db.balance,
    }
  },

  // POST /api/orders/{id}/cancel
  async cancelOrder(orderId: number): Promise<boolean> {
    await delay(800)

    for (const position of db.positions) {
      const order = position.orders.find((o) => o.id === orderId)

      if (order) {
        order.status = 'Cancelada'
        order.color = 'text-error' // Atualiza cor

        // Adiciona histórico
        const now = new Date()
        order.timeline.push({
          date: now.toLocaleString('pt-BR'),
          label: 'Cancelamento solicitado pelo usuário',
        })

        return true
      }
    }
    return false // Não achou
  },
}
