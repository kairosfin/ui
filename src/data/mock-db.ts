import type { BankTransaction } from '@/types/Bank'
import type { Position } from '@/types/Position'
import type { Stock } from '@/types/Stock' // <--- Importe o tipo Stock
import { generateMockTransactions } from './mock-bank-data'
import { MOCK_STOCKS, generateMockOrders } from './mock-stock-data'

const DB_KEY = 'kairos_mock_db_v3'

interface MockDatabase {
  balance: number
  positions: Position[]
  transactions: BankTransaction[]
}

function generateInitialData(): MockDatabase {
  // CORREÇÃO: Adicionei tipagem explicita (stock: Stock) para calar o erro TS
  const positions: Position[] = MOCK_STOCKS.map((stock: Stock) => {
    const quantity = Math.floor(Math.random() * 490) + 10
    const variationFactor = 1 + (Math.random() * 0.25 - 0.15)
    const avgPrice = stock.price * variationFactor

    const currentTotal = quantity * stock.price
    const investedTotal = quantity * avgPrice
    const profit = currentTotal - investedTotal
    const profitPercent = (profit / investedTotal) * 100

    return {
      ...stock,
      quantity,
      avgPrice,
      currentTotal,
      profit,
      profitPercent,
      orders: generateMockOrders(stock.ticker, stock.price),
    }
  })

  const transactions = generateMockTransactions()

  const initialBalance = 1000 + transactions.reduce((acc, t) => acc + t.amount, 0)

  return {
    balance: parseFloat(initialBalance.toFixed(2)),
    positions,
    transactions,
  }
}

class LocalDatabase {
  private data: MockDatabase

  constructor() {
    const stored = localStorage.getItem(DB_KEY)
    if (stored) {
      this.data = JSON.parse(stored)
    } else {
      this.data = generateInitialData()
      this.save()
    }
  }

  private save() {
    localStorage.setItem(DB_KEY, JSON.stringify(this.data))
  }

  get balance() {
    return this.data.balance
  }
  get positions() {
    return this.data.positions
  }
  get transactions() {
    return this.data.transactions
  }

  updateBalance(amount: number) {
    this.data.balance += amount
    this.save()
  }

  addTransaction(tx: BankTransaction) {
    this.data.transactions.unshift(tx)
    this.save()
  }

  cancelOrder(orderId: number): boolean {
    for (const pos of this.data.positions) {
      const order = pos.orders.find((o) => o.id === orderId)
      if (order) {
        order.status = 'Cancelada'
        order.color = 'text-error'

        if (!order.timeline) order.timeline = []
        order.timeline.push({
          date: new Date().toLocaleString('pt-BR'),
          label: 'Cancelamento confirmado',
        })

        this.save()
        return true
      }
    }
    return false
  }
}

export const db = new LocalDatabase()
