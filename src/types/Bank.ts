export interface BankTransaction {
  id: number
  type: 'Aplicação' | 'Resgate' | 'Depósito' | 'Saque'
  title: string
  subtitle: string
  date: string
  displayDate: string
  time: string
  color: string
  amount: number
}
