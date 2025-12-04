<script setup lang="ts">
import { useRouter } from 'vue-router'

defineProps({
  balance: {
    type: Number,
    required: true,
  },
})

const router = useRouter()

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function navigateToBank() {
  router.push('/app/bank')
}
</script>

<template>
  <VCard
    flat
    link
    color="border"
    class="pa-4 rounded-lg d-flex align-center justify-space-between"
    @click="navigateToBank"
  >
    <div class="d-flex align-center">
      <VIcon icon="mdi-cash" size="28" class="mr-3" />

      <div>
        <div class="text-body-1 font-weight-medium">Saldo em conta corrente</div>
        <div class="text-h6 font-weight-bold">
          {{ formatCurrency(balance) }}
        </div>
      </div>
    </div>

    <VIcon icon="mdi-chevron-right" />
  </VCard>
</template>
