import { db } from '@/data/mock-db'
import { bankService } from '@/services/bankService'
import type { BankTransaction } from '@/types/Bank'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useBankStore = defineStore('bank', () => {
  const balance = ref(0)
  const transactions = ref<BankTransaction[]>([])
  const isLoading = ref(false)

  async function fetchTransactions() {
    isLoading.value = true
    try {
      const data = await bankService.getStatement()
      balance.value = data.balance
      transactions.value = data.transactions
    } catch (error) {
      console.error('Erro ao buscar extrato:', error)
    } finally {
      isLoading.value = false
    }
  }

  async function deposit(value: number) {
    isLoading.value = true
    try {
      const newTransaction = await bankService.deposit(value)

      db.addTransaction(newTransaction)

      balance.value += value
      transactions.value.unshift(newTransaction)
    } catch (error) {
      console.error('Erro no depósito:', error)
    } finally {
      isLoading.value = false
    }
  }

  const groupedTransactions = computed(() => {
    const groups: Record<string, BankTransaction[]> = {}
    transactions.value.forEach((t) => {
      const dDate = t.displayDate || new Date(t.date).toLocaleDateString('pt-BR')
      if (!groups[dDate]) groups[dDate] = []
      groups[dDate]!.push(t)
    })
    return groups
  })

  return {
    balance,
    transactions,
    groupedTransactions,
    isLoading,
    fetchTransactions,
    deposit,
  }
})
