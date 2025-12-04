<script setup lang="ts">
defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: 'Pesquisar' },
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <VTextField
    :model-value="modelValue"
    :placeholder="placeholder"
    variant="solo"
    density="compact"
    hide-details
    flat
    rounded="lg"
    bg-color="border"
    class="app-search-bar"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <template v-slot:append-inner>
      <VIcon icon="mdi-magnify" color="primary" />
    </template>
  </VTextField>
</template>
