<script setup lang="ts">
import { computed, ref } from 'vue'
import AppModal from './AppModal.vue' // <--- USA O MODAL
import AppSearchBar from './AppSearchBar.vue'
import FilterChipGroup from './FilterChipGroup.vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: 'Filtrar histórico' },
  showSearch: { type: Boolean, default: true },
  typeOptions: { type: Array as () => string[], default: () => [] },
  periodOptions: { type: Array as () => string[], default: () => [] },
  statusOptions: { type: Array as () => string[], default: () => [] },
})

const emit = defineEmits(['update:modelValue', 'apply'])

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const searchQuery = ref('')
const selectedType = ref<string | null>(null)
const selectedPeriod = ref<string | null>(null)
const selectedStatus = ref<string | null>(null)

function handleApply() {
  emit('apply', {
    search: searchQuery.value,
    type: selectedType.value,
    period: selectedPeriod.value,
    status: selectedStatus.value,
  })
  isOpen.value = false
}
</script>

<template>
  <AppModal
    v-model="isOpen"
    :title="title"
    back-text="Voltar"
    action-text="Filtrar resultados"
    @action="handleApply"
  >
    <AppSearchBar
      v-if="showSearch"
      v-model="searchQuery"
      placeholder="Título ou descrição"
      class="mb-6"
    />

    <FilterChipGroup
      v-if="typeOptions.length"
      title="Tipo"
      :options="typeOptions"
      v-model="selectedType"
    />

    <FilterChipGroup
      v-if="periodOptions.length"
      title="Período"
      :options="periodOptions"
      v-model="selectedPeriod"
    />

    <FilterChipGroup
      v-if="statusOptions.length"
      title="Status"
      :options="statusOptions"
      v-model="selectedStatus"
    />
  </AppModal>
</template>
