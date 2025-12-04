<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: Number, required: true },
  step: { type: Number, default: 1 },
  min: { type: Number, default: 0 },
  btnSize: { type: String, default: 'small' },
  label: { type: String, default: 'Qtd:' },
})

const emit = defineEmits(['update:modelValue'])

const model = computed({
  get: () => props.modelValue,
  set: (val: string | number) => {
    // Remove caracteres não numéricos caso o usuário cole texto
    const num = Number(String(val).replace(/\D/g, ''))
    if (!isNaN(num) && num >= props.min) {
      emit('update:modelValue', num)
    }
  },
})

function increment() {
  emit('update:modelValue', props.modelValue + props.step)
}

function decrement() {
  if (props.modelValue - props.step >= props.min) {
    emit('update:modelValue', props.modelValue - props.step)
  }
}
</script>

<template>
  <div class="rounded-lg d-flex align-center justify-space-between px-4 py-2 bg-border">
    <div class="d-flex align-center flex-grow-1 mr-2">
      <span class="font-weight-bold mr-2 text-no-wrap">{{ label }}</span>

      <VTextField
        v-model="model"
        variant="plain"
        type="text"
        inputmode="numeric"
        hide-details
        density="comfortable"
        single-line
        class="font-weight-bold"
      />
    </div>

    <!-- Removido ga-1 para juntar os botões -->
    <div class="d-flex align-center">
      <VBtn
        :size="btnSize"
        variant="plain"
        icon
        class="pa-0"
        style="min-width: auto; width: 32px"
        @click="decrement"
      >
        <VIcon icon="mdi-minus" size="x-large" color="primary" />
      </VBtn>

      <VBtn
        :size="btnSize"
        variant="plain"
        icon
        class="pa-0"
        style="min-width: auto; width: 32px"
        @click="increment"
      >
        <VIcon icon="mdi-plus" size="x-large" color="primary" />
      </VBtn>
    </div>
  </div>
</template>

<style scoped>
:deep(input) {
  text-align: center;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}
</style>
