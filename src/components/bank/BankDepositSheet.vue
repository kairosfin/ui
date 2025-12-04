<script setup lang="ts">
import { useBankStore } from '@/stores/bank'
import { computed, ref } from 'vue'
import AppModal from '../common/AppModal.vue'
import AppQuantitySelector from '../common/AppQuantitySelector.vue' // <--- Importado

const props = defineProps({ modelValue: { type: Boolean, default: false } })
const emit = defineEmits(['update:modelValue'])

const bankStore = useBankStore()
const amount = ref(1000)

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

function handleDeposit() {
  bankStore.deposit(amount.value)
  isOpen.value = false
}

function currency(val: number) {
  return val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
}
</script>

<template>
  <AppModal
    v-model="isOpen"
    title="Depósito"
    back-text="Voltar"
    action-text="Depositar"
    @action="handleDeposit"
  >
    <AppQuantitySelector
      v-model="amount"
      :step="100"
      :min="100"
      btn-size="large"
      class="bg-border mb-4 py-4"
    >
      <span class="text-h5 font-weight-bold"> R$: {{ currency(amount) }} </span>
    </AppQuantitySelector>

    <div class="bg-border rounded-lg pa-4 d-flex">
      <VIcon icon="mdi-alert" class="mr-3 mt-1" color="grey-darken-3" size="small" />
      <div class="text-caption">
        <strong class="text-high-emphasis">Importante</strong><br />
        O valor depositado representa apenas um saldo virtual, o qual pode ser utilizado para
        simular negociações de ativos no Kairos Broker.
      </div>
    </div>
  </AppModal>
</template>
