import { portfolioService } from '@/services/portfolio'
import type { Order } from '@/types/Order'
import type { Position } from '@/types/Position'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const usePortfolioStore = defineStore('portfolio', () => {
  const positions = ref<Position[]>([])
  const balance = ref(0)
  const isLoading = ref(false)

  // Getters
  const totalInvested = computed(() =>
    positions.value.reduce((acc, pos) => acc + pos.currentTotal, 0),
  )
  const totalPortfolio = computed(() => totalInvested.value + balance.value)
  const totalProfit = computed(() => positions.value.reduce((acc, pos) => acc + pos.profit, 0))
  const totalProfitPercent = computed(() => {
    const costBasis = positions.value.reduce((acc, pos) => acc + pos.avgPrice * pos.quantity, 0)
    if (costBasis === 0) return 0
    return ((totalProfit.value / costBasis) * 100).toFixed(2)
  })

  const allOrders = computed(() => {
    const orders: Order[] = []

    positions.value.forEach((pos) => {
      pos.orders.forEach((order) => {
        orders.push({
          ...order,
          symbol: pos.symbol,
          // NOVO: Injetamos a logo da posição na ordem para exibição na lista geral
          logo: pos.logo,
        } as Order & { logo?: string })
      })
    })

    // ... ordenação mantida ...
    return orders.sort((a, b) => {
      const dateA = new Date(a.dateISO || a.date).getTime()
      const dateB = new Date(b.dateISO || b.date).getTime()
      return dateB - dateA
    })
  })

  // Actions
  async function fetchPortfolio() {
    isLoading.value = true
    try {
      // Busca dados do "Backend" (db)
      const data = await portfolioService.getPortfolio()
      positions.value = data.positions
      balance.value = data.balance
    } catch (error) {
      console.error('Erro ao buscar portfólio', error)
    } finally {
      isLoading.value = false
    }
  }

  async function getPositionBySymbol(symbol: string) {
    if (positions.value.length === 0) await fetchPortfolio()
    return positions.value.find((p) => p.symbol === symbol)
  }

  async function cancelOrder(orderId: number) {
    // 1. Persiste no DB
    await portfolioService.cancelOrder(orderId)

    // 2. Atualiza estado local (Reatividade)
    for (const pos of positions.value) {
      const order = pos.orders.find((o) => o.id === orderId)
      if (order) {
        order.status = 'Cancelada'
        order.color = 'text-error'
        // Força atualização da timeline se necessário
      }
    }
  }

  return {
    positions,
    balance,
    isLoading,
    totalPortfolio,
    totalProfit,
    totalProfitPercent,
    allOrders,
    fetchPortfolio,
    getPositionBySymbol,
    cancelOrder,
  }
})
