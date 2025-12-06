import stockService from '@/services/stockService'
import type { Quote, Stock } from '@/types/Stock'
import { QuoteRange } from '@/types/Stock'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMarketStore = defineStore('market', () => {
  const searchResults = ref<Stock[]>([])
  const currentStockHistory = ref<Quote[]>([])
  const isLoading = ref(false)
  const error = ref('')

  async function searchStocks(term: string) {
    if (!term) {
      searchResults.value = []
      return
    }

    isLoading.value = true
    error.value = ''

    try {
      const results = await stockService.search([term])
      searchResults.value = results
    } catch (e) {
      console.error(e)
      error.value = 'Erro ao buscar ações'
    } finally {
      isLoading.value = false
    }
  }

  async function fetchStockHistory(ticker: string, range: QuoteRange) {
    isLoading.value = true
    try {
      const history = await stockService.getHistory(ticker, range)
      currentStockHistory.value = history
    } catch (e) {
      console.error(e)
    } finally {
      isLoading.value = false
    }
  }

  return {
    searchResults,
    currentStockHistory,
    isLoading,
    error,
    searchStocks,
    fetchStockHistory,
  }
})
