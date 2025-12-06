<script setup lang="ts">
import type { Position } from '@/types/Position'
import { useRouter } from 'vue-router'
import AppButton from '../common/AppButton.vue'

const props = withDefaults(
  defineProps<{
    position: Position
    minimal?: boolean
  }>(),
  {
    minimal: false,
  },
)

const router = useRouter()

function currency(val: number) {
  return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatPercent(val: number) {
  if (!val) return '0,00'
  return val.toFixed(2).replace('.', ',')
}

function goToTrade() {
  router.push({
    name: 'trade-detail',
    params: { ticker: props.position.ticker },
  })
}

function handleCardClick() {
  if (props.minimal) return

  router.push({
    name: 'position-details',
    params: { ticker: props.position.ticker },
  })
}
</script>

<template>
  <VCard
    class="pa-4 rounded-lg elevation-0 bg-border"
    :class="[minimal ? 'cursor-default' : 'cursor-pointer']"
    :ripple="false"
    @click="handleCardClick"
  >
    <div v-if="!minimal" class="d-flex justify-space-between align-center mb-4">
      <div class="d-flex align-center">
        <VAvatar size="48" class="mr-3 bg-background elevation-1">
          <VImg :src="position.logo" alt="Logo" class="pa-1" />
        </VAvatar>

        <div>
          <div class="font-weight-bold text-h6">{{ position.ticker }}</div>
          <div class="text-body-2 font-weight-medium">{{ position.name }}</div>
        </div>
      </div>

      <div @click.stop class="d-inline-block">
        <AppButton
          text="Negociar"
          :block="false"
          size="small"
          class="text-none px-6 font-weight-bold mb-0"
          @click="goToTrade"
        />
      </div>
    </div>

    <VRow dense class="text-body-1">
      <VCol cols="6" class="pb-1">Quantidade</VCol>
      <VCol cols="6" class="text-right pb-1">
        {{ position.quantity }}
      </VCol>

      <VCol cols="6" class="pb-1">Preço médio</VCol>
      <VCol cols="6" class="text-right pb-1">
        {{ currency(position.avgPrice) }}
      </VCol>

      <VCol cols="6" class="pb-1">Posição</VCol>
      <VCol cols="6" class="text-right pb-1">
        {{ currency(position.currentTotal) }}
      </VCol>

      <VCol cols="6" class="">Rentabilidade</VCol>
      <VCol cols="6" class="text-right">
        {{ currency(position.profit) }} ({{ formatPercent(position.profitPercent) }}%)
      </VCol>
    </VRow>
  </VCard>
</template>
