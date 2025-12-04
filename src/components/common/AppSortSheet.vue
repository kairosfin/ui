<script setup lang="ts">
import { computed } from 'vue'
import AppModal from './AppModal.vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  selected: { type: String, default: 'date_desc' },
})

const emit = defineEmits(['update:modelValue', 'update:selected'])

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const sortOptions = [
  { label: 'Mais recentes', value: 'date_desc', icon: 'mdi-calendar-arrow-left' },
  { label: 'Mais antigas', value: 'date_asc', icon: 'mdi-calendar-arrow-right' },
  { label: 'Maior valor', value: 'price_desc', icon: 'mdi-arrow-up-bold' },
  { label: 'Menor valor', value: 'price_asc', icon: 'mdi-arrow-down-bold' },
]

function selectOption(value: string) {
  emit('update:selected', value)
  isOpen.value = false
}
</script>

<template>
  <AppModal backText="Voltar" v-model="isOpen" title="Ordenar por">
    <VList class="pa-0" bg-color="transparent">
      <VListItem
        v-for="opt in sortOptions"
        :key="opt.value"
        @click="selectOption(opt.value)"
        :active="selected === opt.value"
        class="px-2 py-3 rounded-lg mb-1"
      >
        <template v-slot:prepend>
          <VIcon :icon="opt.icon" class="mr-4" />
        </template>

        <VListItemTitle class="font-weight-medium">
          {{ opt.label }}
        </VListItemTitle>

        <template v-slot:append v-if="selected === opt.value">
          <VIcon icon="mdi-check" color="primary" />
        </template>
      </VListItem>
    </VList>
  </AppModal>
</template>
