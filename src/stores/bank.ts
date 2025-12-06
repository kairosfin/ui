import { db } from '@/data/mock-db' // Importa o DB persistente
import type { BankTransaction } from '@/types/Bank'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useBankStore = defineStore('bank', () => {
  // Inicializa com valor do DB (LocalStorage)
  const balance = ref(db.balance)
  const transactions = ref<BankTransaction[]>([])
  const isLoading = ref(false)

  function fetchTransactions() {
    isLoading.value = true
    // Simula delay de rede, mas pega dados persistidos
    setTimeout(() => {
      transactions.value = db.transactions
      balance.value = db.balance // Sincroniza saldo também
      isLoading.value = false
    }, 600)
  }

  const groupedTransactions = computed(() => {
    const groups: Record<string, BankTransaction[]> = {}
    transactions.value.forEach((t) => {
      // Garante que displayDate exista (se vier do DB cru pode precisar formatar)
      const dDate = t.displayDate || new Date(t.date).toLocaleDateString('pt-BR')

      if (!groups[dDate]) groups[dDate] = []
      groups[dDate]!.push(t)
    })
    return groups
  })

  function deposit(value: number) {
    const today = new Date()

    const newTx: BankTransaction = {
      id: Math.random(),
      type: 'Depósito',
      title: 'Depósito',
      subtitle: 'Adição manual de saldo',
      date: today.toISOString(),
      displayDate: today.toLocaleDateString('pt-BR'),
      amount: value, // Valor numérico para conta
      time: today.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      color: 'text-success',
    }

    // 1. Atualiza no DB (Persistência)
    db.updateBalance(value)
    db.addTransaction(newTx)

    // 2. Atualiza no Estado Local (Reatividade Imediata)
    balance.value += value
    transactions.value.unshift(newTx)
  }

  return { balance, transactions, groupedTransactions, isLoading, fetchTransactions, deposit }
})
