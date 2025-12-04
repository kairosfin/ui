<script setup lang="ts">
import PortfolioChart from '@/components/charts/PortfolioChart.vue'
import AppAccordion from '@/components/common/AppAccordion.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppFilterActions from '@/components/common/AppFilterActions.vue'
import AppFilterSheet from '@/components/common/AppFilterSheet.vue'
import AppSortSheet from '@/components/common/AppSortSheet.vue'
import AssetHeader from '@/components/common/AssetHeader.vue'
import BackButton from '@/components/common/ArrowButton.vue'
import OrderCard from '@/components/orders/OrderCard.vue'
import OrderDetailSheet from '@/components/orders/OrderDetailSheet.vue'
import PositionCard from '@/components/portfolio/PositionCard.vue'
import { usePortfolioStore } from '@/stores/portfolio'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const portfolioStore = usePortfolioStore()

const isLoading = ref(true)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const position = ref<any>(null)

const isFilterOpen = ref(false)
const isSortOpen = ref(false)
const isOrderDetailOpen = ref(false)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const selectedOrder = ref<any>({})

const currentSort = ref('date_desc')
const activeFilters = ref({
  search: '',
  type: null as string | null,
  period: null as string | null,
  status: null as string | null,
})

function goToTrade() {
  if (position.value) {
    router.push({ name: 'trade-detail', params: { ticker: position.value.symbol } })
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function onApplyFilter(filters: any) {
  activeFilters.value = filters
}

function openSort() {
  isSortOpen.value = true
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function openOrderDetails(order: any) {
  selectedOrder.value = { ...order, symbol: position.value.symbol }
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
    switch (currentSort.value) {
      case 'date_desc':
        return new Date(b.dateISO || 0).getTime() - new Date(a.dateISO || 0).getTime()
      case 'date_asc':
        return new Date(a.dateISO || 0).getTime() - new Date(b.dateISO || 0).getTime()
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

onMounted(async () => {
  const symbol = route.params.symbol as string
  if (symbol) {
    position.value = await portfolioStore.getPositionBySymbol(symbol)
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
          <PositionCard :position="position" minimal class="bg-grey-lighten-4" />
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
                  :symbol="position.symbol"
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
