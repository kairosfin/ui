// src/types/Bank.ts

export interface BankTransaction {
  id: number
  type: 'Aplicação' | 'Resgate' | 'Depósito' | 'Saque'
  title: string
  subtitle: string
  date: string // ISO date
  displayDate: string
  time: string
  color: string
  amount: number
}
