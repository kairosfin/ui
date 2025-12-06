<script setup lang="ts">
import PortfolioChart from '@/components/charts/PortfolioChart.vue'
import AppAccordion from '@/components/common/AppAccordion.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppFilterActions from '@/components/common/AppFilterActions.vue'
import AppFilterSheet from '@/components/common/AppFilterSheet.vue'
import AppSortSheet from '@/components/common/AppSortSheet.vue'
import BackButton from '@/components/common/ArrowButton.vue'
import AssetHeader from '@/components/common/AssetHeader.vue'
import OrderCard from '@/components/orders/OrderCard.vue'
import OrderDetailSheet from '@/components/orders/OrderDetailSheet.vue'
import PositionCard from '@/components/portfolio/PositionCard.vue'
import stockService from '@/services/stockService'
import { usePortfolioStore } from '@/stores/portfolio'
import type { Order } from '@/types/Order'
import type { Position } from '@/types/Position'
import { QuoteRange } from '@/types/Stock'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const portfolioStore = usePortfolioStore()

const isLoading = ref(true)
const position = ref<Position | null>(null)

const isChartLoading = ref(false)
const chartSeries = ref<number[]>([])
const chartCategories = ref<string[]>([])

const isFilterOpen = ref(false)
const isSortOpen = ref(false)
const isOrderDetailOpen = ref(false)

const selectedOrder = ref<Order>({} as Order)

const currentSort = ref('date_desc')
const activeFilters = ref({
  search: '',
  type: null as string | null,
  period: null as string | null,
  status: null as string | null,
})

function goToTrade() {
  if (position.value) {
    router.push({ name: 'trade-detail', params: { ticker: position.value.ticker } })
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function onApplyFilter(filters: any) {
  activeFilters.value = filters
}

function openSort() {
  isSortOpen.value = true
}

function openOrderDetails(order: Order) {
  if (!position.value) return
  selectedOrder.value = { ...order, ticker: position.value.ticker }
  isOrderDetailOpen.value = true
}

const activeFiltersCount = computed(() => {
  let count = 0
  if (activeFilters.value.type) count++
  if (activeFilters.value.status) count++
  if (activeFilters.value.period) count++
  return count
})

const filteredOrders = computed(() => {
  if (!position.value || !position.value.orders) return []

  let result = [...position.value.orders]
  const { search, type, status, period } = activeFilters.value

  if (search) {
    const term = search.toLowerCase()
    result = result.filter(
      (o) =>
        o.id.toString().includes(term) ||
        o.type.toLowerCase().includes(term) ||
        o.status.toLowerCase().includes(term),
    )
  }
  if (type) result = result.filter((o) => o.type === type)
  if (status) result = result.filter((o) => o.status.includes(status))
  if (period && period !== 'Personalizado') {
    const now = new Date()
    const cutoff = new Date()
    if (period === 'Última semana') cutoff.setDate(now.getDate() - 7)
    else if (period === 'Último mês') cutoff.setMonth(now.getMonth() - 1)
    else if (period === '3 meses') cutoff.setMonth(now.getMonth() - 3)

    result = result.filter((o) => !o.dateISO || new Date(o.dateISO) >= cutoff)
  }

  result.sort((a, b) => {
    const dateA = new Date(a.dateISO || 0).getTime()
    const dateB = new Date(b.dateISO || 0).getTime()

    switch (currentSort.value) {
      case 'date_desc':
        return dateB - dateA
      case 'date_asc':
        return dateA - dateB
      case 'price_desc':
        return b.price - a.price
      case 'price_asc':
        return a.price - b.price
      default:
        return 0
    }
  })
  return result
})

async function fetchMarketData(ticker: string) {
  isChartLoading.value = true
  try {
    const quotes = await stockService.getHistory(ticker, QuoteRange.Month)

    if (quotes.length > 0) {
      const sortedQuotes = quotes.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      )

      chartSeries.value = sortedQuotes.map((q) => q.close)
      chartCategories.value = sortedQuotes.map((q) =>
        new Date(q.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
      )

      if (position.value) {
        const lastQuote = sortedQuotes[sortedQuotes.length - 1]
        position.value.price = lastQuote!.close

        position.value.currentTotal = position.value.quantity * lastQuote!.close
        position.value.profit =
          position.value.currentTotal - position.value.quantity * position.value.avgPrice
        position.value.profitPercent =
          (position.value.profit / (position.value.quantity * position.value.avgPrice)) * 100
      }
    }
  } catch (error) {
    console.error('Erro ao buscar histórico:', error)
  } finally {
    isChartLoading.value = false
  }
}

onMounted(async () => {
  const ticker = route.params.ticker as string
  if (ticker) {
    const result = await portfolioStore.getPositionByTicker(ticker)
    position.value = result || null

    if (position.value) {
      await fetchMarketData(ticker)
    }
  }
  isLoading.value = false
})
</script>

<template>
  <VContainer class="fill-height align-start pa-6 bg-background">
    <div v-if="isLoading" class="d-flex justify-center align-center fill-height w-100">
      <VProgressCircular indeterminate color="primary" />
    </div>

    <div v-else-if="position" class="w-100 pb-16">
      <div class="px-4 pt-4">
        <BackButton title="Posição" to="/app" />
        <AssetHeader :position="position" />
      </div>

      <div class="mb-4">
        <PortfolioChart />
      </div>

      <VRow align="start">
        <VCol cols="12" md="5">
          <PositionCard :position="position" minimal />
        </VCol>

        <VCol cols="12" md="7">
          <AppAccordion title="Ordens" :initially-open="true">
            <div>
              <AppFilterActions
                :count="activeFiltersCount"
                @click-filter="isFilterOpen = true"
                @click-sort="openSort"
              />

              <div class="d-flex flex-column mb-16">
                <div
                  v-if="filteredOrders.length === 0"
                  class="text-center py-8 text-medium-emphasis text-caption"
                >
                  Nenhuma ordem encontrada.
                </div>

                <OrderCard
                  v-for="order in filteredOrders"
                  :key="order.id"
                  :order="order"
                  :ticker="position.ticker"
                  @click="openOrderDetails"
                />
              </div>
            </div>
          </AppAccordion>
        </VCol>
      </VRow>

      <OrderDetailSheet v-model="isOrderDetailOpen" :order="selectedOrder" />

      <AppFilterSheet
        v-model="isFilterOpen"
        title="Filtrar ordens"
        :show-search="false"
        :type-options="['Compra', 'Venda', 'Resgate', 'Aplicação']"
        :status-options="['Executada', 'Cancelada', 'Em andamento']"
        @apply="onApplyFilter"
      />

      <AppSortSheet v-model="isSortOpen" v-model:selected="currentSort" />

      <VFooter app fixed class="bg-border elevation-10 px-4 py-3">
        <AppButton text="Negociar" @click="goToTrade" />
      </VFooter>
    </div>
  </VContainer>
</template>
