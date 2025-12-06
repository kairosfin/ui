import { db } from '@/data/mock-db'
import type { BankTransaction } from '@/types/Bank'

const delay = (ms = 600) => new Promise((resolve) => setTimeout(resolve, ms))

export const bankService = {
  // GET /api/bank/statement (Mantido)
  async getStatement(): Promise<{ balance: number; transactions: BankTransaction[] }> {
    await delay()
    return {
      balance: db.balance,
      transactions: db.transactions,
    }
  },
  // POST /api/bank/deposit (Corrigido para evitar dupla inserção)
  async deposit(amount: number): Promise<BankTransaction> {
    await delay(800)

    const now = new Date()

    const newTransaction: BankTransaction = {
      id: Math.floor(Math.random() * 1000000),
      type: 'Depósito',
      title: 'Depósito via App',
      subtitle: 'Entrada manual de saldo',
      date: now.toISOString(),
      displayDate: now.toLocaleDateString('pt-BR'),
      time: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      color: 'text-success',
      amount: amount,
    }

    db.updateBalance(amount)

    return newTransaction
  },
}
