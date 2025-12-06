import { portfolioService } from '@/services/portfolioService'
import type { Order } from '@/types/Order'
import type { Position } from '@/types/Position'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const usePortfolioStore = defineStore('portfolio', () => {
  const positions = ref<Position[]>([])
  const balance = ref(0)
  const isLoading = ref(false)

  const totalInvested = computed(() =>
    positions.value.reduce((acc, pos) => acc + pos.currentTotal, 0),
  )

  const totalPortfolio = computed(() => totalInvested.value + balance.value)

  const totalProfit = computed(() => positions.value.reduce((acc, pos) => acc + pos.profit, 0))

  const totalProfitPercent = computed(() => {
    const costBasis = positions.value.reduce((acc, pos) => acc + pos.avgPrice * pos.quantity, 0)
    if (costBasis === 0) return '0.00'
    return ((totalProfit.value / costBasis) * 100).toFixed(2)
  })

  // Transforma lista de Posições em lista plana de Ordens para o Histórico Geral
  const allOrders = computed(() => {
    const orders: Order[] = []

    positions.value.forEach((pos) => {
      pos.orders.forEach((order) => {
        orders.push({
          ...order,
          ticker: pos.ticker,
          // Injeta a logo da posição na ordem para exibição na lista
          logo: pos.logo,
        } as Order & { logo?: string }) // Type assertion para adicionar logo dinamicamente
      })
    })

    return orders.sort((a, b) => {
      const dateA = new Date(a.dateISO || a.date).getTime()
      const dateB = new Date(b.dateISO || b.date).getTime()
      return dateB - dateA
    })
  })

  async function fetchPortfolio() {
    isLoading.value = true
    try {
      const data = await portfolioService.getPortfolio()
      positions.value = data.positions
      balance.value = data.balance
    } catch (error) {
      console.error('Erro ao buscar portfólio', error)
    } finally {
      isLoading.value = false
    }
  }

  // CRÍTICO: Atualizado de getPositionBySymbol para getByTicker
  async function getPositionByTicker(ticker: string) {
    if (positions.value.length === 0) await fetchPortfolio()
    // O Backend usa 'ticker' (PETR4), o front deve usar igual
    return positions.value.find((p) => p.ticker === ticker)
  }

  async function cancelOrder(orderId: number) {
    await portfolioService.cancelOrder(orderId)

    // Atualização Otimista (Optimistic UI)
    for (const pos of positions.value) {
      const order = pos.orders.find((o) => o.id === orderId)
      if (order) {
        order.status = 'Cancelada'
        order.color = 'text-error'

        // Adiciona timeline de cancelamento
        order.timeline.push({
          date: new Date().toLocaleDateString('pt-BR'),
          label: 'Cancelamento solicitado',
        })
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
    getPositionByTicker,
    cancelOrder,
  }
})
