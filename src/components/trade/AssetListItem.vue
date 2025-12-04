<script setup lang="ts">
const props = defineProps({
  stock: { type: Object, required: true },
})

const emit = defineEmits(['click'])

function formatCurrency(val: number) {
  return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}
</script>

<template>
  <div
    class="d-flex align-center py-4 border-b border-opacity-12 cursor-pointer hover-effect"
    @click="emit('click', props.stock)"
  >
    <VAvatar size="48" class="mr-3 bg-white elevation-1">
      <VImg :src="props.stock.logoUrl" :alt="props.stock.symbol" class="pa-1" />
    </VAvatar>

    <div class="flex-grow-1">
      <div class="font-weight-bold text-body-1">{{ props.stock.symbol }}</div>
      <div class="text-body-2" style="max-width: 180px">
        {{ props.stock.shortName }}
      </div>
    </div>

    <div class="text-right">
      <div class="font-weight-bold text-body-1">
        {{ formatCurrency(props.stock.regularMarketPrice) }}
      </div>
      <div
        class="text-body-2 font-weight-bold"
        :class="stock.regularMarketChangePercent >= 0 ? 'text-success' : 'text-error'"
      >
        {{ props.stock.regularMarketChangePercent >= 0 ? '+' : '' }}
        {{ props.stock.regularMarketChangePercent.toFixed(2) }}%
      </div>
    </div>
  </div>
</template>
