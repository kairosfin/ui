import type { BankTransaction } from '@/types/Bank'

// Helper para gerar datas passadas
function getPastDate(daysAgo: number): { iso: string; display: string; time: string } {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)

  return {
    iso: date.toISOString(),
    display: date.toLocaleDateString('pt-BR'),
    time: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
  }
}

export function generateMockTransactions(): BankTransaction[] {
  const d0 = getPastDate(0) // Hoje
  const d1 = getPastDate(1) // Ontem
  const d2 = getPastDate(2) // 2 dias atrás
  const d5 = getPastDate(5) // 5 dias atrás

  return [
    {
      id: 101,
      type: 'Depósito',
      title: 'Depósito via PIX',
      subtitle: 'Remetente: Thiago Silva',
      date: d0.iso,
      displayDate: d0.display,
      time: d0.time,
      color: 'text-success',
      amount: 2500.0,
    },
    {
      id: 102,
      type: 'Saque',
      title: 'Saque Banco 24h',
      subtitle: 'Terminal 0045-SP',
      date: d1.iso,
      displayDate: d1.display,
      time: '19:45',
      color: 'text-error',
      amount: -200.0,
    },
    {
      id: 103,
      type: 'Aplicação',
      title: 'Aplicação FIQE3',
      subtitle: 'Compra de 201 ações',
      date: d2.iso,
      displayDate: d2.display,
      time: '14:30',
      color: 'text-error',
      amount: -1250.5,
    },
    {
      id: 104,
      type: 'Resgate',
      title: 'Resgate Tesouro Direto',
      subtitle: 'Vencimento antecipado',
      date: d5.iso,
      displayDate: d5.display,
      time: '10:00',
      color: 'text-success',
      amount: 1450.8,
    },
  ]
}
