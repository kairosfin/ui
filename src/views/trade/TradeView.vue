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

const itemsPerPage = 10
const currentPageLimit = ref(itemsPerPage)
const filters = ['Favoritos', 'Carteira', 'Maiores altas']

function goToAssetDetail(ticker: string) {
  router.push({ name: 'trade-detail', params: { ticker: ticker } })
}

// CORREÇÃO: Função atualizada para manter o estado da lista até 3 caracteres
async function fetchStocks() {
  // CLÁUSULA DE GUARDA: Mantém os resultados atuais se houver 1 ou 2 caracteres
  if (searchQuery.value.length > 0 && searchQuery.value.length < 3) {
    return
  }

  isLoading.value = true
  try {
    // Define os termos: Se >= 3, usa a busca. Se 0, usa o padrão.
    const terms = searchQuery.value.length >= 3 ? [searchQuery.value] : ['banco', 'sa']

    stocks.value = await stockService.search(terms)
  } catch (error) {
    console.error('Erro ao buscar ativos:', error)
  } finally {
    isLoading.value = false
  }
}

// Watcher com Debounce
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
      <AppSearchBar v-model="searchQuery" placeholder="Pesquisar (ex: itub, bradesco)" />
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

      <div
        v-if="searchQuery.length > 0 && searchQuery.length < 3"
        class="text-center mt-10 text-medium-emphasis"
      >
        Digite mais de 2 caracteres para iniciar a busca avançada.
      </div>

      <div v-else-if="stocks.length === 0" class="text-center mt-10 text-medium-emphasis">
        Nenhum ativo encontrado para a sua busca.
      </div>

      <div v-if="hasMoreItems" class="text-center mt-6">
        <AppButton text="Ver mais" variant="text" @click="currentPageLimit += itemsPerPage" />
      </div>
    </div>
  </VContainer>
</template>
