<script setup lang="ts">
import AppButton from '@/components/common/AppButton.vue'
import AppFilterActions from '@/components/common/AppFilterActions.vue'
import AppFilterSheet from '@/components/common/AppFilterSheet.vue'
import AppSortSheet from '@/components/common/AppSortSheet.vue'
import BackButton from '@/components/common/ArrowButton.vue'
import OrderCard from '@/components/orders/OrderCard.vue'
import OrderDetailSheet from '@/components/orders/OrderDetailSheet.vue'
import { usePortfolioStore } from '@/stores/portfolio'
import { computed, onMounted, ref, watch } from 'vue'

const portfolioStore = usePortfolioStore()

const isFilterOpen = ref(false)
const isSortOpen = ref(false)
const isDetailOpen = ref(false)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const selectedOrder = ref<any>({})

const itemsPerPage = 8
const currentPageLimit = ref(itemsPerPage)

const currentSort = ref('date_desc')
const activeFilters = ref({
  search: '',
  type: null as string | null,
  period: null as string | null,
  status: null as string | null,
})

const filteredAllOrders = computed(() => {
  if (!portfolioStore.allOrders) return []

  let result = [...portfolioStore.allOrders]
  const { search, type, status, period } = activeFilters.value

  if (search) {
    const term = search.toLowerCase()
    result = result.filter(
      (o) => (o.ticker && o.ticker.toLowerCase().includes(term)) || o.id.toString().includes(term),
    )
  }

  if (type) result = result.filter((o) => o.type === type)
  if (status) result = result.filter((o) => o.status.includes(status))

  if (period && period !== 'Escolher período') {
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

const visibleOrders = computed(() => {
  return filteredAllOrders.value.slice(0, currentPageLimit.value)
})

const hasMoreItems = computed(() => {
  return currentPageLimit.value < filteredAllOrders.value.length
})

function loadMore() {
  currentPageLimit.value += itemsPerPage
}

watch(
  [activeFilters, currentSort],
  () => {
    currentPageLimit.value = itemsPerPage
  },
  { deep: true },
)

const activeFiltersCount = computed(() => {
  let count = 0
  if (activeFilters.value.type) count++
  if (activeFilters.value.status) count++
  if (activeFilters.value.period) count++
  return count
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function openDetails(order: any) {
  selectedOrder.value = order
  isDetailOpen.value = true
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function onApplyFilter(filters: any) {
  activeFilters.value = filters
}

onMounted(() => {
  portfolioStore.fetchPortfolio()
})
</script>

<template>
  <VContainer class="align-start pa-6 bg-background">
    <div class="w-100 mb-6">
      <BackButton title="Portfólio" to="/app" />
    </div>

    <div class="w-100 pb-5">
      <h3 class="text-body-1 font-weight-bold mb-2">Ordens</h3>
      <AppFilterActions
        :count="activeFiltersCount"
        @click-filter="isFilterOpen = true"
        :show-sort="false"
      />
    </div>

    <div v-if="portfolioStore.isLoading" class="d-flex justify-center mt-10">
      <VProgressCircular indeterminate color="primary" />
    </div>

    <div v-else class="d-flex flex-column pb-10">
      <div v-if="filteredAllOrders.length === 0" class="text-center py-8 text-medium text-caption">
        Nenhuma ordem encontrada.
      </div>

      <OrderCard
        v-for="order in visibleOrders"
        :key="order.id"
        :order="order"
        :ticker="order.ticker || ''"
        @click="openDetails"
      />

      <div v-if="hasMoreItems" class="mt-6 text-center">
        <AppButton
          text="Ver mais"
          variant="text"
          color="primary"
          :block="false"
          @click="loadMore"
        />
      </div>
    </div>

    <OrderDetailSheet v-model="isDetailOpen" :order="selectedOrder" />

    <AppFilterSheet
      v-model="isFilterOpen"
      title="Filtrar ordens"
      :type-options="['Compra', 'Venda']"
      :status-options="['Registrada', 'Executada', 'Cancelada']"
      @apply="onApplyFilter"
    />

    <AppSortSheet v-model="isSortOpen" v-model:selected="currentSort" />
  </VContainer>
</template>
