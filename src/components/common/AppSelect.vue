<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  modelValue: any
  items: string[]
}>()

const emit = defineEmits<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (e: 'update:modelValue', value: any): void
}>()

const model = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})
</script>

<template>
  <VSelect
    v-model="model"
    :items="items"
    variant="solo-filled"
    flat
    bg-color="border"
    hide-details
    density="default"
    class="font-weight-bold rounded-lg"
  />
</template>
