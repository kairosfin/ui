<script setup lang="ts">
import { usePortfolioStore } from '@/stores/portfolio'
import type { Order } from '@/types/Order'
import { computed, ref, watch, type PropType } from 'vue'
import AppButton from '../common/AppButton.vue'
import AppModal from '../common/AppModal.vue'
import OrderTimeline from './OrderTimeline.vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },

  order: {
    type: Object as PropType<Order>,
    default: () => ({}) as Order,
  },
})

const emit = defineEmits(['update:modelValue', 'order-updated'])
const portfolioStore = usePortfolioStore()
const isCancelling = ref(false)
const localOrder = ref<Order>({ ...props.order })

watch(
  () => props.order,
  (newVal) => {
    localOrder.value = { ...newVal }
  },
)

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

function currency(val: number) {
  return val?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

// Custo de aquisição = Preço * Qtd (sem taxas)
const acquisitionCost = computed(() => (localOrder.value.price || 0) * (localOrder.value.qty || 0))

// Total Final = Custo + Taxas
const orderTotal = computed(() => acquisitionCost.value + (localOrder.value.fees || 0))

const isCancellable = computed(() => localOrder.value.status === 'Registrada')

async function handleCancel() {
  isCancelling.value = true
  setTimeout(() => {
    portfolioStore.cancelOrder(localOrder.value.id)
    localOrder.value.status = 'Cancelada'
    localOrder.value.color = 'text-error'
    if (!localOrder.value.timeline) localOrder.value.timeline = []
    localOrder.value.timeline.push({
      date: new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR'),
      label: 'Cancelamento solicitado pelo usuário',
    })
    emit('order-updated')
    isCancelling.value = false
  }, 1000)
}
</script>

<template>
  <AppModal v-model="isOpen" :title="`Ordem #${localOrder.id || ''}`" back-text="Voltar">
    <div class="d-flex flex-column ga-1 mb-6 text-body-1 font-weight-medium">
      <div class="d-flex justify-space-between">
        <span>Ativo</span>
        <span class="text-uppercase">{{ localOrder.symbol || 'N/A' }}</span>
      </div>

      <div class="d-flex justify-space-between">
        <span>Tipo</span>
        <span>{{ localOrder.type }}</span>
      </div>

      <div class="d-flex justify-space-between">
        <span>Data</span>
        <span class="text-right">{{ localOrder.date }} 16:09:01</span>
      </div>

      <VDivider class="my-2" />

      <div class="d-flex justify-space-between">
        <span>Preço enviado</span>
        <span>A mercado</span>
      </div>

      <div class="d-flex justify-space-between">
        <span>Preço executado</span>
        <span>{{ currency(localOrder.price) }}</span>
      </div>

      <div v-if="localOrder.qty > 0" class="d-flex justify-space-between">
        <span>Quantidade executada</span>
        <span>{{ localOrder.qty }}/{{ localOrder.qty }}</span>
      </div>

      <div v-if="localOrder.qty > 0" class="d-flex justify-space-between">
        <span>Custo de aquisição</span>
        <span>{{ currency(acquisitionCost) }}</span>
      </div>

      <div class="d-flex justify-space-between">
        <span>Taxa</span>
        <span class="text-error">
          {{ localOrder.fees ? `${currency(localOrder.fees)}` : 'Grátis' }}
        </span>
      </div>

      <VDivider class="my-2" />

      <div class="d-flex justify-space-between text-h6">
        <span class="font-weight-bold">Total</span>
        <span class="font-weight-black">{{ currency(orderTotal) }}</span>
      </div>
    </div>

    <OrderTimeline :timeline="localOrder.timeline" />

    <div v-if="isCancellable" class="mt-auto pt-4">
      <AppButton
        text="Cancelar ordem"
        block
        color="error"
        variant="flat"
        :loading="isCancelling"
        @click="handleCancel"
      />
    </div>
  </AppModal>
</template>
