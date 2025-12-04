export interface BankTransaction {
  id: number
  type: 'Aplicação' | 'Resgate' | 'Depósito' | 'Saque'
  title: string
  subtitle: string
  date: string
  displayDate: string
  price: number // Valor matemático (pode ser negativo)
  time: string
  color: string
}
