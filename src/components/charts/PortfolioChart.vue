<script setup lang="ts">
import { stockService } from '@/services/stocks'
import { computed, onMounted, ref, watch } from 'vue'
import { useDisplay } from 'vuetify'

const { mobile } = useDisplay()

const chartSeriesData = ref<number[]>([])
const chartCategories = ref<string[]>([])
const isLoading = ref(false)

const timeFilters = ['1M', '6M', '1Y', 'YTD', 'ALL']
const selectedFilter = ref('1Y')

const fetchChartData = async () => {
  try {
    isLoading.value = true
    const { values, dates } = await stockService.getPortfolioHistory(selectedFilter.value)
    chartSeriesData.value = values
    chartCategories.value = dates
  } catch (error) {
    console.error('Erro ao carregar gráfico:', error)
  } finally {
    isLoading.value = false
  }
}

watch(selectedFilter, () => {
  fetchChartData()
})

onMounted(() => {
  fetchChartData()
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
      style: { colors: '#000', fontSize: '14px', fontWeight: '600' },
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
      style: { colors: '#000', fontSize: '14px', fontWeight: '600' },
      formatter: (value: number) => (value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value),
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

const series = computed(() => [{ name: 'Patrimônio', data: chartSeriesData.value }])
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
