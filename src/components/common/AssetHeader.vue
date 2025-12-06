<script setup lang="ts">
// eslint-disable-next-line @typescript-eslint/no-explicit-any
defineProps<{ position: any }>()

function currency(val: number) {
  return val?.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function formatPercent(val: number) {
  if (!val) return '0,00'
  return val.toFixed(2).replace('.', ',')
}
</script>

<template>
  <div class="d-flex justify-space-between align-center mt-6 mb-2">
    <div class="d-flex align-center">
      <VAvatar size="48" class="mr-3 bg-white elevation-1">
        <VImg :src="position.logo" class="pa-1" />
      </VAvatar>
      <div>
        <div class="text-h6 font-weight-bold line-height-1">{{ position.ticker }}</div>
        <div class="text-body-2 font-weight-medium">{{ position.name }}</div>
      </div>
    </div>
    <div class="text-right">
      <div class="text-h6 font-weight-bold">{{ currency(position.price) }}</div>
      <div
        class="text-body-2 font-weight-bold"
        :class="position.dailyYield >= 0 ? 'text-success' : 'text-error'"
      >
        {{ position.dailyYield >= 0 ? '+' : '' }}{{ formatPercent(position.dailyYield) }}%
      </div>
    </div>
  </div>
</template>
