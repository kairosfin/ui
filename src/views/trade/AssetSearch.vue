<script setup lang="ts">
import AppButton from '@/components/common/AppButton.vue' // <--- Adicionar este import
import AppSearchBar from '@/components/common/AppSearchBar.vue'
import BackButton from '@/components/common/ArrowButton.vue'
import FilterChipGroup from '@/components/common/FilterChipGroup.vue'
import AssetListItem from '@/components/trade/AssetListItem.vue'
import { stockService } from '@/services/stocks'
import type { StockQuote } from '@/types/Stock'
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const stocks = ref<StockQuote[]>([])
const isLoading = ref(true)
const searchQuery = ref('')
const selectedFilter = ref('Todos')

const itemsPerPage = 4
const currentPageLimit = ref(itemsPerPage)

const filters = ['Favoritos', 'Carteira', 'Maiores altas']

function goToAssetDetail(symbol: string) {
  router.push({ name: 'trade-detail', params: { ticker: symbol } })
}

const filteredStocks = computed(() => {
  let result = [...stocks.value]

  if (searchQuery.value) {
    const term = searchQuery.value.toLowerCase()
    result = result.filter(
      (s) => s.symbol.toLowerCase().includes(term) || s.shortName.toLowerCase().includes(term),
    )
  }

  if (selectedFilter.value === 'Maiores altas') {
    result.sort((a, b) => b.regularMarketChangePercent - a.regularMarketChangePercent)
  }

  return result
})

// --- LÓGICA DE VISUALIZAÇÃO (Paginada) ---
const visibleStocks = computed(() => {
  return filteredStocks.value.slice(0, currentPageLimit.value)
})

const hasMoreItems = computed(() => {
  return currentPageLimit.value < filteredStocks.value.length
})

function loadMore() {
  currentPageLimit.value += itemsPerPage
}

// Reseta a paginação ao buscar ou filtrar
watch([searchQuery, selectedFilter], () => {
  currentPageLimit.value = itemsPerPage
})

onMounted(async () => {
  try {
    isLoading.value = true
    stocks.value = await stockService.getAll()
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <VContainer class="align-start pa-4 bg-background">
    <div class="w-100 mb-6">
      <BackButton title="Portfólio" to="/app" />
    </div>

    <div class="w-100 mb-5">
      <AppSearchBar v-model="searchQuery" placeholder="Pesquisar ativo por nome ou ticker" />
    </div>

    <div class="w-100">
      <FilterChipGroup title="" :options="filters" v-model="selectedFilter" scrollable />
    </div>

    <div v-if="isLoading" class="w-100 d-flex justify-center mt-5">
      <VProgressCircular indeterminate color="primary" />
    </div>

    <div v-else class="w-100 pb-4">
      <AssetListItem
        v-for="stock in visibleStocks"
        :key="stock.symbol"
        :stock="stock"
        @click="goToAssetDetail(stock.symbol)"
      />

      <div v-if="filteredStocks.length === 0" class="text-center mt-10 text-medium-emphasis">
        Nenhum ativo encontrado.
      </div>

      <div v-if="hasMoreItems" class="text-center mt-6">
        <AppButton text="Ver mais" variant="text" @click="loadMore" />
      </div>
    </div>
  </VContainer>
</template>
