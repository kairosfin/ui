<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  order: { type: Object, required: true },
  symbol: { type: String, required: true },
})

const emit = defineEmits(['click'])

function currency(val: number) {
  return val?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const isTransaction = computed(() =>
  ['Resgate', 'Aplicação', 'Depósito'].includes(props.order.type),
)

const iconConfig = computed(() => {
  const type = props.order.type
  const status = props.order.status

  if (type === 'Resgate') {
    return { icon: 'mdi-arrow-bottom-right-thin', color: 'primary', bg: 'border' }
  }

  if (type === 'Aplicação') {
    return { icon: 'mdi-arrow-top-right-thin', color: 'primary', bg: 'border' }
  }

  if (type === 'Depósito') {
    return { icon: 'mdi-currency-usd', color: 'primary', bg: 'border' }
  }

  if (status === 'Registrada') {
    return { icon: 'mdi-clock-outline', color: 'primary', bg: 'border' }
  }

  if (status.includes('Executada')) {
    return { icon: 'mdi-check', color: 'primary', bg: 'border' }
  }

  return { icon: 'mdi-close', color: 'error', bg: 'border' }
})

const showLogo = computed(() => {
  // Mostra logo se existir E se não for uma transação genérica (Resgate/Depósito)
  return props.order.logo && !isTransaction.value
})

const displayTitle = computed(() => {
  if (isTransaction.value && !props.symbol.startsWith(props.order.type)) {
    return `${props.order.type} ${props.symbol}`
  }
  return props.symbol
})

const displaySubtitle = computed(() => {
  if (isTransaction.value) return props.order.status
  return props.order.date
})
</script>

<template>
  <div
    class="d-flex justify-space-between align-center py-3 border-b border-opacity-12 cursor-pointer"
    @click="emit('click', order)"
  >
    <div class="d-flex align-center">
      <VAvatar
        :color="showLogo ? 'transparent' : iconConfig.bg"
        variant="flat"
        size="40"
        class="mr-3"
      >
        <VImg v-if="showLogo" :src="order.logo" alt="Logo" />
        <VIcon v-else :icon="iconConfig.icon" :color="iconConfig.color" />
      </VAvatar>

      <div>
        <div class="text-h6 font-weight-bold">{{ displayTitle }}</div>
        <div class="text-body-1 font-weight-medium">{{ displaySubtitle }}</div>
      </div>
    </div>

    <div class="text-right">
      <div class="font-weight-bold text-h6" :class="order.color">
        {{ currency(order.price) }}
      </div>

      <div class="text-body-1 font-weight-medium">
        <template v-if="isTransaction">
          {{ order.date }}
        </template>
        <template v-else>
          Qtd. {{ order.qty }} <br />
          {{ order.status }}
        </template>
      </div>
    </div>
  </div>
</template>
