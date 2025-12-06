<script setup lang="ts">
import type { Order } from '@/types/Order'
import { computed } from 'vue'

const props = defineProps<{
  order: Order & { logo?: string }
  ticker: string
}>()

const emit = defineEmits(['click'])

function currency(val: number) {
  return val?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const isTransaction = computed(() =>
  ['Resgate', 'Aplicação', 'Depósito', 'Saque'].includes(props.order.type || ''),
)

const iconConfig = computed(() => {
  const type = props.order.type
  const status = props.order.status || ''

  if (type === 'Resgate') {
    return { icon: 'mdi-arrow-bottom-right-thin', color: 'primary', bg: 'border' }
  }
  if (type === 'Aplicação' || type === 'Depósito') {
    return { icon: 'mdi-arrow-top-right-thin', color: 'primary', bg: 'border' }
  }
  if (status === 'Registrada') {
    return { icon: 'mdi-clock-outline', color: 'primary', bg: 'border' }
  }
  if (status.includes('Executada') || status === 'Concluída') {
    return { icon: 'mdi-check', color: 'primary', bg: 'border' }
  }
  return { icon: 'mdi-close', color: 'error', bg: 'border' }
})

const showLogo = computed(() => {
  return props.order.logo && !isTransaction.value
})

const displayTitle = computed(() => {
  if (isTransaction.value && props.ticker && !props.ticker.startsWith(props.order.type)) {
    return `${props.order.type} ${props.ticker}`
  }
  return props.ticker
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
        <div class="text-body-1 font-weight-bold">{{ displayTitle }}</div>
        <div class="text-body-2 text-md-body-1">{{ displaySubtitle }}</div>
      </div>
    </div>

    <div class="text-right">
      <div class="font-weight-bold text-body-1" :class="order.color">
        {{ currency(order.price) }}
      </div>

      <div class="text-body-2 text-md-body-1">
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
