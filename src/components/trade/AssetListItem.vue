<script setup lang="ts">
import type { Stock } from '@/types/Stock'

const props = defineProps<{
  stock: Stock
}>()

const emit = defineEmits(['click'])

function formatCurrency(val: number) {
  return val?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatPercent(val: number) {
  if (!val) return '0,00'
  return val.toFixed(2).replace('.', ',')
}
</script>

<template>
  <div
    class="d-flex align-center py-4 border-b border-opacity-12 cursor-pointer hover-effect"
    @click="emit('click', props.stock)"
  >
    <VAvatar size="48" class="mr-3 bg-white elevation-1">
      <VImg :src="props.stock.logo" :alt="props.stock.ticker" class="pa-1" />
    </VAvatar>

    <div class="flex-grow-1">
      <div class="font-weight-bold text-body-1">{{ props.stock.ticker }}</div>
      <div class="text-body-2 text-medium-emphasis" style="max-width: 180px">
        {{ props.stock.name }}
      </div>
    </div>

    <div class="text-right">
      <div class="font-weight-bold text-body-1">
        {{ formatCurrency(props.stock.price) }}
      </div>

      <div
        class="text-body-2 font-weight-bold"
        :class="props.stock.dailyYield >= 0 ? 'text-success' : 'text-error'"
      >
        {{ props.stock.dailyYield >= 0 ? '+' : '' }}
        {{ formatPercent(props.stock.dailyYield) }}%
      </div>
    </div>
  </div>
</template>
