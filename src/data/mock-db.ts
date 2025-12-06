import type { BankTransaction } from '@/types/Bank'
import type { Position } from '@/types/Position'
import type { Stock } from '@/types/Stock'
import { createBankTransactionFromOrder, getInitialDepositTransaction } from './mock-bank-data'
import { MOCK_STOCKS, createOrderFromTrade, generateMockOrders } from './mock-stock-data'

const DB_KEY = 'kairos_mock_db_v7'

interface MockDatabase {
  balance: number
  positions: Position[]
  transactions: BankTransaction[]
}

function generateInitialData(): MockDatabase {
  const positions: Position[] = MOCK_STOCKS.map((stock: Stock) => {
    const quantity = Math.floor(Math.random() * 490) + 10
    const variationFactor = 1 + (Math.random() * 0.25 - 0.15)
    const avgPrice = stock.price * variationFactor

    const currentTotal = quantity * stock.price
    const investedTotal = quantity * avgPrice
    const profit = currentTotal - investedTotal
    const profitPercent = parseFloat(((profit / investedTotal) * 100).toFixed(2))

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

  const initialTx = getInitialDepositTransaction()

  return {
    balance: 10000.0, // Saldo inicial
    positions,
    transactions: [initialTx],
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

  executeOrder(order: {
    ticker: string
    name?: string
    logo?: string
    type: 'Compra' | 'Venda'
    qty: number
    price: number
    total: number
    fees: number
    date: string
  }): boolean {
    // Verifica saldo antes de comprar
    if (order.type === 'Compra' && this.data.balance < order.total)
      throw new Error('Saldo insuficiente')

    // Atualização de Saldo
    if (order.type === 'Compra') {
      this.data.balance -= order.total
    } else {
      this.data.balance += order.total - order.fees
    }

    const transaction = createBankTransactionFromOrder(order)
    this.data.transactions.unshift(transaction)

    let position = this.data.positions.find((p) => p.ticker === order.ticker)

    if (!position) {
      if (order.type === 'Venda') throw new Error('Você não possui este ativo para vender.')

      const stockInfo = MOCK_STOCKS.find((s) => s.ticker === order.ticker)

      position = {
        ticker: order.ticker,
        name: order.name || stockInfo?.name || order.ticker,
        logo: order.logo || stockInfo?.logo || '',
        price: order.price,
        dailyYield: 0,
        quantity: 0,
        avgPrice: 0,
        currentTotal: 0,
        profit: 0,
        profitPercent: 0,
        marketCap: 0,
        tradeVolume: 0,
        sector: '',
        updatedAt: '',
        orders: [],
      }
      this.data.positions.push(position)
    }

    // Cálculos de Posição
    if (order.type === 'Compra') {
      const currentCost = position.quantity * position.avgPrice
      const newCost = order.qty * order.price
      position.avgPrice = (currentCost + newCost) / (position.quantity + order.qty)
      position.quantity += order.qty
    } else {
      position.quantity -= order.qty
    }

    if (position.quantity <= 0) {
      this.data.positions = this.data.positions.filter((p) => p.ticker !== order.ticker)
    } else {
      position.currentTotal = position.quantity * order.price
      const invested = position.quantity * position.avgPrice
      position.profit = position.currentTotal - invested
      position.profitPercent = (position.profit / invested) * 100

      const newOrder = createOrderFromTrade(order)
      if (!position.orders) position.orders = []
      position.orders.unshift(newOrder)
    }

    this.save()
    return true
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
