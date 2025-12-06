<script setup lang="ts">
import { portfolioService } from '@/services/portfolioService'
import stockService from '@/services/stockService'
import { QuoteRange } from '@/types/Stock'
import { computed, onMounted, ref, watch } from 'vue'
import { useDisplay } from 'vuetify'

const props = defineProps<{
  ticker?: string
}>()

const { mobile } = useDisplay()

const series = computed(() => [
  {
    name: props.ticker ? 'Preço' : 'Patrimônio',
    data: chartSeriesData.value,
  },
])

const chartSeriesData = ref<number[]>([])
const chartCategories = ref<string[]>([])
const isLoading = ref(false)

const timeFilters = ['1M', '6M', '1Y', 'YTD', 'ALL']
const selectedFilter = ref('1M')

function getRangeFromFilter(filter: string): QuoteRange {
  switch (filter) {
    case '1M':
      return QuoteRange.Month
    case '6M':
      return QuoteRange.Semester
    case '1Y':
      return QuoteRange.Year
    case 'YTD':
      return QuoteRange.YearToDate
    case 'ALL':
      return QuoteRange.Max
    default:
      return QuoteRange.Month
  }
}

const fetchData = async () => {
  isLoading.value = true
  try {
    if (props.ticker) {
      const range = getRangeFromFilter(selectedFilter.value)
      const quotes = await stockService.getHistory(props.ticker, range)

      const sorted = quotes.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

      chartSeriesData.value = sorted.map((q) => q.close)
      chartCategories.value = sorted.map((q) =>
        new Date(q.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
      )
    } else {
      const { values, dates } = await portfolioService.getPortfolioHistory(selectedFilter.value)
      chartSeriesData.value = values
      chartCategories.value = dates
    }
  } catch (error) {
    console.error('Erro ao carregar gráfico:', error)
  } finally {
    isLoading.value = false
  }
}

watch([() => props.ticker, selectedFilter], fetchData)

onMounted(() => {
  fetchData()
})

const chartOptions = computed(() => ({
  chart: {
    type: 'area',
    height: 250,
    fontFamily: 'Roboto, sans-serif',
    toolbar: { show: true },
    zoom: { enabled: true },
    animations: { enabled: true },
  },
  colors: ['#000000'],
  fill: {
    type: 'gradient',
    gradient: { shadeIntensity: 0.3, opacityFrom: 1, opacityTo: 0.4, stops: [0, 70, 100] },
  },
  dataLabels: { enabled: false },
  stroke: { curve: 'straight', width: 2 },
  xaxis: {
    categories: chartCategories.value,
    tickAmount: 6,
    labels: {
      style: { colors: '#000', fontSize: '12px', fontWeight: '600' },
      rotate: mobile.value ? -45 : 0,
      rotateAlways: mobile.value,
      hideOverlappingLabels: true,
    },
    axisBorder: { show: true, color: '#E0E0E0' },
    axisTicks: { show: false },
    tooltip: { enabled: false },
  },
  yaxis: {
    show: true,
    labels: {
      style: { colors: '#000', fontSize: '12px', fontWeight: '600' },
      formatter: (value: number) =>
        value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value.toFixed(2),
    },
  },
  grid: {
    show: true,
    borderColor: '#E0E0E0',
    strokeDashArray: 0,
    xaxis: { lines: { show: false } },
    yaxis: { lines: { show: true } },
    padding: { top: 0, right: 0, bottom: 0, left: 10 },
  },
  tooltip: {
    theme: 'light',
    y: { formatter: (val: number) => `R$ ${val.toLocaleString('pt-BR')}` },
  },
}))
</script>

<template>
  <VCard
    class="w-100 mb-4 pa-4 rounded-lg"
    variant="outlined"
    bg-color="background"
    color="secondary"
    :loading="isLoading"
  >
    <div class="d-flex justify-space-between align-center mb-4 overflow-x-auto">
      <div class="d-flex ga-1">
        <VBtn
          v-for="filter in timeFilters"
          :key="filter"
          size="small"
          :variant="selectedFilter === filter ? 'flat' : 'text'"
          :color="selectedFilter === filter ? 'primary' : 'primary'"
          class="font-weight-bold px-3"
          rounded="sm"
          :disabled="isLoading"
          @click="selectedFilter = filter"
        >
          {{ filter }}
        </VBtn>
      </div>
    </div>

    <div :style="{ opacity: isLoading ? 0.5 : 1, transition: 'opacity 0.3s' }">
      <apexchart type="area" height="250" :options="chartOptions" :series="series"></apexchart>
    </div>
  </VCard>
</template>
