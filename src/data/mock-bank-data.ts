import type { BankTransaction } from '@/types/Bank'

export function getInitialDepositTransaction(): BankTransaction {
  const now = new Date()
  return {
    id: 1,
    type: 'Depósito',
    title: 'Depósito Inicial',
    subtitle: 'Bem-vindo ao Kairos',
    date: now.toISOString(),
    displayDate: now.toLocaleDateString('pt-BR'),
    time: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    color: 'text-success',
    amount: 10000.0,
  }
}

export function createBankTransactionFromOrder(order: {
  ticker: string
  type: 'Compra' | 'Venda'
  total: number
  fees: number
  date: string
}): BankTransaction {
  const isBuy = order.type === 'Compra'
  const now = new Date()

  return {
    id: Math.floor(Math.random() * 1000000),
    type: isBuy ? 'Aplicação' : 'Resgate',
    title: `${isBuy ? 'Aplicação' : 'Resgate'} ${order.ticker}`,
    subtitle: `Ordem executada`,
    date: order.date,
    displayDate: now.toLocaleDateString('pt-BR'),
    time: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    color: isBuy ? 'text-error' : 'text-success',
    amount: isBuy ? -order.total : order.total - order.fees,
  }
}
