<script setup lang="ts">
// Definimos a interface aqui ou importamos de types
interface OrderBookItem {
  qtdBuy: number
  buy: number
  sell: number
  qtdSell: number
}

defineProps({
  items: {
    type: Array as () => OrderBookItem[],
    required: true,
    default: () => [],
  },
})

function currency(val: number) {
  return val?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}
</script>

<template>
  <div class="pa-5 bg-border rounded-lg">
    <div
      class="d-flex justify-space-between mb-2 font-weight-bold text-body-1 border-b border-primary"
    >
      <span class="text-center w-25">Qtd</span>
      <span class="text-center w-25">Compra</span>
      <span class="text-center w-25">Venda</span>
      <span class="text-center w-25">Qtd</span>
    </div>

    <div v-for="(book, i) in items" :key="i" class="d-flex justify-space-between mb-1 text-body-1">
      <span class="text-center w-25 font-weight-medium">{{ book.qtdBuy }}</span>
      <span class="text-center w-25 text-success font-weight-bold">{{ currency(book.buy) }}</span>

      <span class="text-center w-25 text-error font-weight-bold">{{ currency(book.sell) }}</span>
      <span class="text-center w-25 font-weight-medium">{{ book.qtdSell }}</span>
    </div>
  </div>
</template>
