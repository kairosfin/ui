import type { BankTransaction } from '@/types/Bank'
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Interface alinhada com o OrderCard

export const useBankStore = defineStore('bank', () => {
  const balance = ref(1520.93)
  const isLoading = ref(false)
  const transactions = ref<BankTransaction[]>([])

  function fetchTransactions() {
    isLoading.value = true
    setTimeout(() => {
      transactions.value = [
        {
          id: 1,
          type: 'Aplicação',
          title: 'Aplicação FIQE3',
          subtitle: 'Ordem #15231',
          date: '2025-10-23',
          displayDate: '23/10/2025',
          price: -5.2, // <--- CORREÇÃO: Negativo para funcionar o filtro 'Débito'
          time: '16:09',
          color: 'text-error',
        },
        {
          id: 2,
          type: 'Resgate',
          title: 'Resgate ODPV3',
          subtitle: 'Ordem #15223',
          date: '2025-10-23',
          displayDate: '23/10/2025',
          price: 13.48, // Positivo (Crédito)
          time: '13:12',
          color: 'text-success',
        },
        {
          id: 3,
          type: 'Depósito',
          title: 'Depósito',
          subtitle: 'Adição manual de saldo',
          date: '2025-10-23',
          displayDate: '23/10/2025',
          price: 1150.0, // Positivo (Crédito)
          time: '10:08',
          color: 'text-success',
        },
        // Adicione mais mocks se necessário...
      ]
      isLoading.value = false
    }, 800)
  }

  const groupedTransactions = computed(() => {
    const groups: Record<string, BankTransaction[]> = {}
    transactions.value.forEach((t) => {
      if (!groups[t.displayDate]) groups[t.displayDate] = []
      groups[t.displayDate]!.push(t)
    })
    return groups
  })

  function deposit(value: number) {
    balance.value += value
    const today = new Date()
    transactions.value.unshift({
      id: Math.random(),
      type: 'Depósito',
      title: 'Depósito',
      subtitle: 'Adição manual de saldo',
      date: today.toISOString().split('T')[0] || '',
      displayDate: today.toLocaleDateString('pt-BR'),
      price: value,
      time: today.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      color: 'text-success',
    })
  }

  return { balance, transactions, groupedTransactions, isLoading, fetchTransactions, deposit }
})
