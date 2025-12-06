<script setup lang="ts">
import AppButton from '@/components/common/AppButton.vue'
import AppSearchBar from '@/components/common/AppSearchBar.vue'
import BackButton from '@/components/common/ArrowButton.vue'
import FilterChipGroup from '@/components/common/FilterChipGroup.vue'
import AssetListItem from '@/components/trade/AssetListItem.vue'
import stockService from '@/services/stockService'
import type { Stock } from '@/types/Stock'
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const stocks = ref<Stock[]>([])
const isLoading = ref(true)
const searchQuery = ref('')
const selectedFilter = ref('Todos')

const itemsPerPage = 10 // Aumentei para ver mais itens
const currentPageLimit = ref(itemsPerPage)
const filters = ['Favoritos', 'Carteira', 'Maiores altas']

function goToAssetDetail(ticker: string) {
  router.push({ name: 'trade-detail', params: { ticker: ticker } })
}

async function fetchStocks() {
  isLoading.value = true
  try {
    // LÓGICA SIMPLIFICADA:
    // Se digitou algo, busca o que digitou.
    // Se está vazio, busca termos genéricos ("banco", "sa") para preencher a lista inicial.
    const terms = searchQuery.value.length > 0 ? [searchQuery.value] : ['VALE']

    stocks.value = await stockService.search(terms)
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

// Debounce para não travar enquanto digita
let timeout: ReturnType<typeof setTimeout>
watch(searchQuery, () => {
  clearTimeout(timeout)
  timeout = setTimeout(fetchStocks, 500)
})

const visibleStocks = computed(() => {
  const result = [...stocks.value]
  if (selectedFilter.value === 'Maiores altas') {
    result.sort((a, b) => b.dailyYield - a.dailyYield)
  }
  return result.slice(0, currentPageLimit.value)
})

const hasMoreItems = computed(() => currentPageLimit.value < stocks.value.length)

onMounted(() => {
  fetchStocks()
})
</script>

<template>
  <VContainer class="align-start pa-4 bg-background">
    <div class="w-100 mb-6">
      <BackButton title="Portfólio" to="/app" />
    </div>

    <div class="w-100 mb-5">
      <AppSearchBar v-model="searchQuery" placeholder="Pesquisar (ex: itub, vale)" />
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
        :key="stock.ticker"
        :stock="stock"
        @click="goToAssetDetail(stock.ticker)"
      />

      <div v-if="stocks.length === 0" class="text-center mt-10 text-medium-emphasis">
        Nenhum ativo encontrado. Tente buscar por outro.
      </div>

      <div v-if="hasMoreItems" class="text-center mt-6">
        <AppButton text="Ver mais" variant="text" @click="currentPageLimit += itemsPerPage" />
      </div>
    </div>
  </VContainer>
</template>
